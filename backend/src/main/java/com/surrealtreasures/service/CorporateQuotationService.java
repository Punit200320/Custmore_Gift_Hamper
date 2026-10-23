package com.surrealtreasures.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.CorporateQuotation;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.repository.CorporateQuotationRepository;
import com.surrealtreasures.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Corporate Bulk-Order Quotation and Margin Estimation.
 * Reuses master catalogue data and HamperRecommendationService eligibility logic.
 * Enforces real recorded unit costs, explicit rounding rules, and immutable snapshot persistence.
 */
@Service
@Transactional
public class CorporateQuotationService {

    private static final Logger log = LoggerFactory.getLogger(CorporateQuotationService.class);

    private final ProductRepository productRepository;
    private final HamperRecommendationService recommendationService;
    private final CorporateQuotationRepository quotationRepository;
    private final ObjectMapper objectMapper;

    @Value("${corporate.quotes.min-quantity:1}")
    private int minQuantity = 1;

    @Value("${corporate.quotes.max-quantity:5000}")
    private int maxQuantity = 5000;

    public CorporateQuotationService(ProductRepository productRepository,
                                     HamperRecommendationService recommendationService,
                                     CorporateQuotationRepository quotationRepository,
                                     ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.recommendationService = recommendationService;
        this.quotationRepository = quotationRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Generate, validate, calculate, and persist a corporate quotation.
     */
    public CorporateQuotationResponseDTO generateQuotation(CorporateQuotationRequestDTO request) {
        validateRequest(request);

        int quantity = request.getQuantity();

        // 1. Resolve Budget
        BigDecimal budgetPerHamper = request.getBudgetPerHamper();
        BigDecimal totalBudget = request.getTotalBudget();

        if (budgetPerHamper == null && totalBudget != null) {
            budgetPerHamper = totalBudget.divide(BigDecimal.valueOf(quantity), 2, RoundingMode.HALF_UP);
        } else if (totalBudget == null && budgetPerHamper != null) {
            totalBudget = budgetPerHamper.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
        }

        // 2. Resolve Product Items (from explicit items, product IDs, or recommendation tier)
        List<CorporateQuoteItemRequestDTO> resolvedItems = resolveHamperItems(request, budgetPerHamper);

        if (resolvedItems.isEmpty()) {
            throw new ApiException("No eligible products could be determined for the quotation.", HttpStatus.BAD_REQUEST);
        }

        // 3. Revalidate Stock, Allergy Restrictions, and Skin-Type for the FULL requested quantity
        List<CorporateQuotationItemDTO> quoteItems = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> missingCosts = new ArrayList<>();
        List<ProductExclusionDTO> exclusions = new ArrayList<>();

        boolean stockDeficitDetected = false;
        boolean allergenConflictDetected = false;
        boolean unverifiedIngredientDetected = false;

        BigDecimal productRetailPerHamper = BigDecimal.ZERO;
        BigDecimal productCostPerHamper = BigDecimal.ZERO;
        boolean allProductCostsRecorded = true;

        for (CorporateQuoteItemRequestDTO itemReq : resolvedItems) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ApiException("Product not found with ID: " + itemReq.getProductId(), HttpStatus.NOT_FOUND));

            int qtyPerHamper = itemReq.getQuantityPerHamper();
            int totalRequiredStock = qtyPerHamper * quantity;
            int availableStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            boolean stockSufficient = availableStock >= totalRequiredStock;

            if (!stockSufficient) {
                stockDeficitDetected = true;
                int deficit = totalRequiredStock - availableStock;
                warnings.add(String.format("Insufficient stock for '%s' (%s): requested %d units in bulk (%d per hamper * %d hampers), but inventory has %d units (deficit: %d).",
                        product.getName(), product.getId(), totalRequiredStock, qtyPerHamper, quantity, availableStock, deficit));
            }

            // Check Inactive
            if (Boolean.FALSE.equals(product.getActive())) {
                warnings.add(String.format("Product '%s' (%s) is marked INACTIVE in master catalogue.", product.getName(), product.getId()));
            }

            // Reuse eligibility checks from recommendationService
            CustomerRequirementsDTO eligibilityReq = new CustomerRequirementsDTO();
            eligibilityReq.setAllergies(request.getAllergies());
            eligibilityReq.setExcludedIngredients(request.getIngredientRestrictions());
            eligibilityReq.setSkinType(request.getSkinType());
            eligibilityReq.setRequestedQuantity(totalRequiredStock);
            eligibilityReq.setMaxBudget(budgetPerHamper);

            Optional<ProductExclusionDTO> exclusion = recommendationService.evaluateEligibility(product, eligibilityReq, budgetPerHamper);
            if (exclusion.isPresent()) {
                ProductExclusionDTO ex = exclusion.get();
                exclusions.add(ex);
                if ("ALLERGEN_CONFLICT".equals(ex.getExclusionCategory())) {
                    allergenConflictDetected = true;
                    warnings.add(String.format("Allergy Safety Violation: Product '%s' conflicts with restrictions: %s", product.getName(), ex.getReason()));
                } else if ("UNVERIFIED_INGREDIENTS".equals(ex.getExclusionCategory())) {
                    unverifiedIngredientDetected = true;
                    warnings.add(String.format("Conservative Safety Policy: Product '%s' ingredients are %s and cannot be verified allergy-safe.",
                            product.getName(), product.getIngredientVerificationStatus()));
                } else if ("SKIN_TYPE_INCOMPATIBLE".equals(ex.getExclusionCategory())) {
                    warnings.add(String.format("Skin Type Mismatch: Product '%s' is not formulated for %s skin.", product.getName(), request.getSkinType()));
                }
            }

            // Price & Cost Calculations
            BigDecimal unitRetail = product.getRetailPrice() != null ? product.getRetailPrice() : BigDecimal.ZERO;
            BigDecimal unitCost = product.getUnitCost();

            BigDecimal itemRetailTotal = unitRetail.multiply(BigDecimal.valueOf(qtyPerHamper)).setScale(2, RoundingMode.HALF_UP);
            productRetailPerHamper = productRetailPerHamper.add(itemRetailTotal);

            BigDecimal itemCostTotal = null;
            boolean costRecorded = (unitCost != null);

            if (costRecorded) {
                itemCostTotal = unitCost.multiply(BigDecimal.valueOf(qtyPerHamper)).setScale(2, RoundingMode.HALF_UP);
                productCostPerHamper = productCostPerHamper.add(itemCostTotal);
            } else {
                allProductCostsRecorded = false;
                missingCosts.add(String.format("Product '%s' (ID: %s)", product.getName(), product.getId()));
            }

            CorporateQuotationItemDTO itemDTO = new CorporateQuotationItemDTO(
                    product.getId(),
                    product.getName(),
                    product.getCategory(),
                    unitRetail,
                    unitCost,
                    qtyPerHamper,
                    totalRequiredStock,
                    unitRetail.multiply(BigDecimal.valueOf(totalRequiredStock)).setScale(2, RoundingMode.HALF_UP),
                    itemCostTotal != null ? unitCost.multiply(BigDecimal.valueOf(totalRequiredStock)).setScale(2, RoundingMode.HALF_UP) : null,
                    availableStock,
                    stockSufficient,
                    product.getIngredientVerificationStatus(),
                    product.getDeclaredAllergens(),
                    costRecorded
            );
            quoteItems.add(itemDTO);
        }

        // 4. Packaging and Additional Costs
        BigDecimal packagingPrice = request.getPackagingPrice() != null ? request.getPackagingPrice() : new BigDecimal("150.00");
        BigDecimal packagingCost = request.getPackagingCost() != null ? request.getPackagingCost() : new BigDecimal("60.00");
        BigDecimal otherCosts = request.getOtherConfiguredCosts() != null ? request.getOtherConfiguredCosts() : BigDecimal.ZERO;
        BigDecimal otherSellingPrice = request.getOtherConfiguredSellingPrice() != null ? request.getOtherConfiguredSellingPrice() : BigDecimal.ZERO;

        BigDecimal sellingPricePerHamper = productRetailPerHamper.add(packagingPrice).add(otherSellingPrice).setScale(2, RoundingMode.HALF_UP);
        BigDecimal estimatedCostPerHamper = null;
        BigDecimal grossProfitPerHamper = null;
        BigDecimal totalQuote = sellingPricePerHamper.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal estimatedTotalCost = null;
        BigDecimal estimatedTotalGrossProfit = null;
        BigDecimal estimatedGrossMarginPercentage = null;

        if (allProductCostsRecorded && packagingCost != null) {
            estimatedCostPerHamper = productCostPerHamper.add(packagingCost).add(otherCosts).setScale(2, RoundingMode.HALF_UP);
            grossProfitPerHamper = sellingPricePerHamper.subtract(estimatedCostPerHamper).setScale(2, RoundingMode.HALF_UP);
            estimatedTotalCost = estimatedCostPerHamper.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
            estimatedTotalGrossProfit = totalQuote.subtract(estimatedTotalCost).setScale(2, RoundingMode.HALF_UP);

            // Gross margin % = (selling price - estimated cost) / selling price * 100
            // Handle zero selling price safely
            if (sellingPricePerHamper.compareTo(BigDecimal.ZERO) == 0) {
                estimatedGrossMarginPercentage = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            } else {
                estimatedGrossMarginPercentage = sellingPricePerHamper.subtract(estimatedCostPerHamper)
                        .multiply(new BigDecimal("100"))
                        .divide(sellingPricePerHamper, 2, RoundingMode.HALF_UP);
            }
        }

        // 5. Budget Evaluation
        boolean withinBudget = true;
        BigDecimal budgetVariancePerHamper = null;
        BigDecimal totalBudgetVariance = null;

        if (budgetPerHamper != null) {
            budgetVariancePerHamper = budgetPerHamper.subtract(sellingPricePerHamper).setScale(2, RoundingMode.HALF_UP);
            totalBudgetVariance = (totalBudget != null ? totalBudget : budgetPerHamper.multiply(BigDecimal.valueOf(quantity)))
                    .subtract(totalQuote).setScale(2, RoundingMode.HALF_UP);

            if (sellingPricePerHamper.compareTo(budgetPerHamper) > 0) {
                withinBudget = false;
                BigDecimal excess = sellingPricePerHamper.subtract(budgetPerHamper);
                warnings.add(String.format("Budget Exceeded: Selling price ₹%s per hamper exceeds customer budget limit of ₹%s by ₹%s.",
                        sellingPricePerHamper.toPlainString(), budgetPerHamper.toPlainString(), excess.toPlainString()));
            }
        }

        // 6. Determine Quotation Status and Fulfillment Flag
        String status;
        String statusMessage;
        boolean fulfillable;

        if (stockDeficitDetected) {
            status = "REJECTED_INSUFFICIENT_STOCK";
            statusMessage = "Quotation cannot be fulfilled due to insufficient inventory for bulk order quantities.";
            fulfillable = false;
        } else if (allergenConflictDetected || unverifiedIngredientDetected) {
            status = "REJECTED_ALLERGEN_RESTRICTION";
            statusMessage = "Quotation violates customer allergy safety or conservative ingredient verification policies.";
            fulfillable = false;
        } else if (!withinBudget) {
            status = "REJECTED_BUDGET_EXCEEDED";
            statusMessage = "Quotation pricing exceeds customer specified budget limits.";
            fulfillable = false;
        } else if (!allProductCostsRecorded) {
            status = "INCOMPLETE_ESTIMATE";
            statusMessage = String.format("Quotation calculated with status INCOMPLETE_ESTIMATE because unit costs are unrecorded for: %s. Profit margin cannot be estimated.",
                    String.join(", ", missingCosts));
            fulfillable = true; // Can be submitted for review, but margin cannot be finalized
        } else {
            status = "CONFIRMED";
            statusMessage = "Corporate bulk quotation confirmed and verified against catalogue inventory, budget, and safety criteria.";
            fulfillable = true;
        }

        // 7. Assemble Response DTO
        CorporatePricingBreakdownDTO pricingBreakdown = new CorporatePricingBreakdownDTO(
                sellingPricePerHamper,
                productCostPerHamper,
                packagingCost,
                packagingPrice,
                otherCosts,
                estimatedCostPerHamper,
                grossProfitPerHamper,
                totalQuote,
                estimatedTotalCost,
                estimatedTotalGrossProfit,
                estimatedGrossMarginPercentage,
                allProductCostsRecorded
        );

        CorporateBudgetEvaluationDTO budgetEvaluation = new CorporateBudgetEvaluationDTO(
                budgetPerHamper,
                totalBudget,
                sellingPricePerHamper,
                totalQuote,
                budgetVariancePerHamper,
                totalBudgetVariance,
                withinBudget
        );

        String quoteId = "CQ-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        CorporateQuotationResponseDTO response = new CorporateQuotationResponseDTO();
        response.setQuoteId(quoteId);
        response.setCompanyName(request.getCompanyName());
        response.setStatus(status);
        response.setStatusMessage(statusMessage);
        response.setFulfillable(fulfillable);
        response.setRequestedQuantity(quantity);
        response.setOccasion(request.getOccasion());
        response.setRecipientProfile(request.getRecipientProfile());
        response.setPricingBreakdown(pricingBreakdown);
        response.setBudgetEvaluation(budgetEvaluation);
        response.setItems(quoteItems);
        response.setWarnings(warnings);
        response.setMissingCosts(missingCosts);
        response.setExclusions(exclusions);
        response.setPackagingOption(request.getPackagingOptionName() != null ? request.getPackagingOptionName() : "Luxury Keepsake Packaging");
        response.setCreatedAt(LocalDateTime.now());

        // 8. Snapshot Persistence
        saveQuoteSnapshot(response);

        return response;
    }

    /**
     * Retrieve an already issued quotation by ID from the snapshot database.
     */
    @Transactional(readOnly = true)
    public CorporateQuotationResponseDTO getQuotationById(String quoteId) {
        CorporateQuotation quote = quotationRepository.findById(quoteId)
                .orElseThrow(() -> new ApiException("Corporate quotation not found with ID: " + quoteId, HttpStatus.NOT_FOUND));

        try {
            return objectMapper.readValue(quote.getSnapshotJson(), CorporateQuotationResponseDTO.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize quotation snapshot for ID: {}", quoteId, e);
            throw new ApiException("Corrupted quotation snapshot data in records.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieve all quotations, optionally filtered by company name.
     */
    @Transactional(readOnly = true)
    public List<CorporateQuotationResponseDTO> getAllQuotations(String companyName) {
        List<CorporateQuotation> entities;
        if (companyName != null && !companyName.trim().isEmpty()) {
            entities = quotationRepository.findByCompanyNameContainingIgnoreCase(companyName.trim());
        } else {
            entities = quotationRepository.findAll();
        }

        return entities.stream().map(e -> {
            try {
                return objectMapper.readValue(e.getSnapshotJson(), CorporateQuotationResponseDTO.class);
            } catch (JsonProcessingException ex) {
                log.error("Failed to parse quote snapshot: {}", e.getId(), ex);
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    private void saveQuoteSnapshot(CorporateQuotationResponseDTO dto) {
        try {
            String snapshotJson = objectMapper.writeValueAsString(dto);

            CorporatePricingBreakdownDTO pb = dto.getPricingBreakdown();
            CorporateBudgetEvaluationDTO be = dto.getBudgetEvaluation();

            CorporateQuotation entity = new CorporateQuotation(
                    dto.getQuoteId(),
                    dto.getCompanyName(),
                    dto.getRequestedQuantity(),
                    dto.getOccasion(),
                    dto.getRecipientProfile(),
                    dto.getStatus(),
                    dto.getStatusMessage(),
                    dto.getFulfillable(),
                    be != null ? be.getBudgetPerHamper() : null,
                    be != null ? be.getTotalBudget() : null,
                    pb != null ? pb.getSellingPricePerHamper() : null,
                    pb != null ? pb.getProductCostPerHamper() : null,
                    pb != null ? pb.getPackagingCostPerHamper() : null,
                    pb != null ? pb.getOtherConfiguredCostsPerHamper() : null,
                    pb != null ? pb.getEstimatedCostPerHamper() : null,
                    pb != null ? pb.getEstimatedGrossProfitPerHamper() : null,
                    pb != null ? pb.getTotalQuote() : null,
                    pb != null ? pb.getEstimatedTotalCost() : null,
                    pb != null ? pb.getEstimatedTotalGrossProfit() : null,
                    pb != null ? pb.getEstimatedGrossMarginPercentage() : null,
                    snapshotJson,
                    dto.getCreatedAt()
            );

            quotationRepository.save(entity);
            log.info("Persisted corporate quotation snapshot: {} for company: {}", dto.getQuoteId(), dto.getCompanyName());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize quotation snapshot for ID: {}", dto.getQuoteId(), e);
            throw new ApiException("Failed to serialize quotation snapshot for persistence.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validateRequest(CorporateQuotationRequestDTO request) {
        if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
            throw new ApiException("Company name or reference is required.", HttpStatus.BAD_REQUEST);
        }

        Integer qty = request.getQuantity();
        if (qty == null || qty < minQuantity || qty > maxQuantity) {
            throw new ApiException(String.format("Requested quantity (%s) is outside configured operational limits (%d to %d hampers).",
                    qty, minQuantity, maxQuantity), HttpStatus.BAD_REQUEST);
        }

        if (request.getBudgetPerHamper() == null && request.getTotalBudget() == null) {
            throw new ApiException("Either budget per hamper or total budget must be provided.", HttpStatus.BAD_REQUEST);
        }

        if (request.getBudgetPerHamper() != null && request.getBudgetPerHamper().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Budget per hamper must be greater than zero.", HttpStatus.BAD_REQUEST);
        }

        if (request.getTotalBudget() != null && request.getTotalBudget().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Total budget must be greater than zero.", HttpStatus.BAD_REQUEST);
        }
    }

    private List<CorporateQuoteItemRequestDTO> resolveHamperItems(CorporateQuotationRequestDTO request, BigDecimal budgetPerHamper) {
        // Case 1: Explicit items provided with quantities
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            return request.getItems();
        }

        // Case 2: Explicit product IDs provided
        if (request.getSelectedProductIds() != null && !request.getSelectedProductIds().isEmpty()) {
            return request.getSelectedProductIds().stream()
                    .map(id -> new CorporateQuoteItemRequestDTO(id, 1))
                    .collect(Collectors.toList());
        }

        // Case 3: Derive from recommendation service tier
        CustomerRequirementsDTO recReq = new CustomerRequirementsDTO();
        recReq.setMaxBudget(budgetPerHamper);
        recReq.setRequestedQuantity(request.getQuantity());
        recReq.setOccasion(request.getOccasion());
        recReq.setRecipientRelationship(request.getRecipientProfile());
        recReq.setSkinType(request.getSkinType());
        recReq.setAllergies(request.getAllergies());
        recReq.setExcludedIngredients(request.getIngredientRestrictions());
        recReq.setPackagingCost(request.getPackagingPrice() != null ? request.getPackagingPrice() : new BigDecimal("150.00"));

        HamperRecommendationResponse recResponse = recommendationService.generateRecommendations(recReq);

        if ("NO_COMBINATION_POSSIBLE".equals(recResponse.getStatus()) || recResponse.getTiers().isEmpty()) {
            throw new ApiException("No hamper combinations could be created within the specified budget and allergy constraints.", HttpStatus.BAD_REQUEST);
        }

        String tierKey = request.getSelectedHamperTier();
        HamperTierDTO selectedTier = null;

        if (tierKey != null && recResponse.getTiers().containsKey(tierKey.toUpperCase())) {
            selectedTier = recResponse.getTiers().get(tierKey.toUpperCase());
        } else if (recResponse.getTiers().containsKey("HIGH")) {
            selectedTier = recResponse.getTiers().get("HIGH");
        } else if (recResponse.getTiers().containsKey("MEDIUM")) {
            selectedTier = recResponse.getTiers().get("MEDIUM");
        } else {
            selectedTier = recResponse.getTiers().values().iterator().next();
        }

        return selectedTier.getProducts().stream()
                .map(p -> new CorporateQuoteItemRequestDTO(p.getId(), p.getQuantity() != null ? p.getQuantity() : 1))
                .collect(Collectors.toList());
    }
}
