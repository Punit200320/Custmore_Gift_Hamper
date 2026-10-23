package com.surrealtreasures.service;

import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Budget-Based Hamper Recommendation Engine.
 * Implements deterministic knapsack-style optimisation with strict eligibility
 * filtering (allergens, conservative unverified ingredients, skin-type, stock).
 */
@Service
@Transactional(readOnly = true)
public class HamperRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(HamperRecommendationService.class);

    private final ProductRepository productRepository;

    public HamperRecommendationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Generate 3 tiered hamper recommendations (LOW, MEDIUM, HIGH)
     * based strictly on customer budget and requirements.
     */
    public HamperRecommendationResponse generateRecommendations(CustomerRequirementsDTO request) {
        BigDecimal maxBudget = request.getMaxBudget();
        BigDecimal packagingCost = request.getPackagingCost();
        int requestedQuantity = request.getRequestedQuantity();

        List<Product> allProducts = productRepository.findAll();
        List<ProductExclusionDTO> exclusions = new ArrayList<>();
        List<Product> eligibleProducts = new ArrayList<>();

        // Check if packaging cost alone exceeds maximum budget
        if (maxBudget.compareTo(packagingCost) <= 0) {
            String msg = String.format("Maximum budget of ₹%s is insufficient to cover standard luxury keepsake packaging (₹%s).",
                    maxBudget.toPlainString(), packagingCost.toPlainString());
            return new HamperRecommendationResponse(
                    "NO_COMBINATION_POSSIBLE",
                    msg,
                    maxBudget,
                    Collections.emptyMap(),
                    UpsellSuggestionDTO.notAvailable("Budget cannot cover packaging and product minimums."),
                    exclusions,
                    0,
                    allProducts.size()
            );
        }

        BigDecimal availableProductBudget = maxBudget.subtract(packagingCost);

        // 1. Strict Eligibility Filtering
        for (Product product : allProducts) {
            Optional<ProductExclusionDTO> exclusion = evaluateEligibility(product, request, availableProductBudget);
            if (exclusion.isPresent()) {
                exclusions.add(exclusion.get());
            } else {
                eligibleProducts.add(product);
            }
        }

        if (eligibleProducts.isEmpty()) {
            String msg = "No eligible products match your strict criteria within the budget. Please review exclusion reasons.";
            return new HamperRecommendationResponse(
                    "NO_COMBINATION_POSSIBLE",
                    msg,
                    maxBudget,
                    Collections.emptyMap(),
                    UpsellSuggestionDTO.notAvailable("No eligible products available for upsell."),
                    exclusions,
                    0,
                    exclusions.size()
            );
        }

        // 2. Score and Sort Eligible Products for Deterministic Optimization
        Map<String, Integer> productScores = scoreProducts(eligibleProducts, request);

        // Sort products by score descending, then retail price descending, then id ascending
        List<Product> sortedProducts = new ArrayList<>(eligibleProducts);
        sortedProducts.sort((a, b) -> {
            int scoreA = productScores.getOrDefault(a.getId(), 0);
            int scoreB = productScores.getOrDefault(b.getId(), 0);
            if (scoreB != scoreA) {
                return Integer.compare(scoreB, scoreA);
            }
            int priceComp = b.getRetailPrice().compareTo(a.getRetailPrice());
            if (priceComp != 0) {
                return priceComp;
            }
            return a.getId().compareTo(b.getId());
        });

        // 3. Generate Distinct Tier Combinations (LOW, MEDIUM, HIGH)
        Map<String, HamperTierDTO> tiers = new LinkedHashMap<>();

        // Target budgets for tiers
        BigDecimal lowTargetBudget = packagingCost.add(availableProductBudget.multiply(new BigDecimal("0.65"))).setScale(2, RoundingMode.HALF_UP);
        BigDecimal mediumTargetBudget = packagingCost.add(availableProductBudget.multiply(new BigDecimal("0.85"))).setScale(2, RoundingMode.HALF_UP);
        BigDecimal highTargetBudget = maxBudget;

        Set<Set<String>> usedProductCombinations = new HashSet<>();

        // High Tier (Luxe, closest to maximum budget)
        Optional<HamperTierDTO> highTier = buildTierCombination(
                "HIGH",
                "Opulent Luxury Hamper",
                sortedProducts,
                packagingCost,
                maxBudget,
                highTargetBudget,
                new BigDecimal("0.80"), // Minimum 80% budget utilization preferred
                usedProductCombinations,
                "Curated for maximum indulgence, premium botanical formulations, and lavish gifting experience."
        );
        highTier.ifPresent(tier -> {
            tiers.put("HIGH", tier);
            usedProductCombinations.add(getProductIdSet(tier));
        });

        // Medium Tier (Balanced Value)
        Optional<HamperTierDTO> mediumTier = buildTierCombination(
                "MEDIUM",
                "Balanced Artisan Value Hamper",
                sortedProducts,
                packagingCost,
                maxBudget,
                mediumTargetBudget,
                new BigDecimal("0.60"), // 60% - 85% range
                usedProductCombinations,
                "Optimal harmony of essential daily rituals, thoughtful keepsakes, and balanced spend."
        );
        mediumTier.ifPresent(tier -> {
            tiers.put("MEDIUM", tier);
            usedProductCombinations.add(getProductIdSet(tier));
        });

        // Low Tier (Affordable Budget-Saving)
        Optional<HamperTierDTO> lowTier = buildTierCombination(
                "LOW",
                "Affordable Budget-Saving Hamper",
                sortedProducts,
                packagingCost,
                maxBudget,
                lowTargetBudget,
                new BigDecimal("0.35"), // 35% - 65% range
                usedProductCombinations,
                "Gentle on your budget while delivering handcrafted beauty, pure botanicals, and keepsake delight."
        );
        lowTier.ifPresent(tier -> {
            tiers.put("LOW", tier);
            usedProductCombinations.add(getProductIdSet(tier));
        });

        // 4. Generate Upsell Suggestion
        UpsellSuggestionDTO upsell = generateUpsellSuggestion(tiers, sortedProducts, packagingCost, maxBudget);

        // 5. Build Final Response Message
        String status;
        String message;
        if (tiers.size() == 3) {
            status = "SUCCESS";
            message = "Generated 3 distinct, verified safe hamper tiers strictly within your ₹" + maxBudget.toPlainString() + " budget.";
        } else if (!tiers.isEmpty()) {
            status = "PARTIAL";
            message = String.format("Generated %d distinct tier(s) within ₹%s. Additional distinct tiers could not be assembled without compromising safety, duplicate constraints, or budget limits.",
                    tiers.size(), maxBudget.toPlainString());
        } else {
            status = "NO_COMBINATION_POSSIBLE";
            message = "Unable to construct a valid multi-item hamper under current budget and strict restrictions.";
        }

        return new HamperRecommendationResponse(
                status,
                message,
                maxBudget,
                tiers,
                upsell,
                exclusions,
                eligibleProducts.size(),
                exclusions.size()
        );
    }

    /**
     * Strict eligibility evaluation according to business rules.
     */
    public Optional<ProductExclusionDTO> evaluateEligibility(Product product, CustomerRequirementsDTO request, BigDecimal availableBudget) {
        // 1. Inactive check
        if (Boolean.FALSE.equals(product.getActive())) {
            return Optional.of(new ProductExclusionDTO(
                    product.getId(),
                    product.getName(),
                    "INACTIVE",
                    "Product is marked inactive in the master catalogue."
            ));
        }

        // 2. Out of stock check
        if (product.getStockQuantity() == null || product.getStockQuantity() < request.getRequestedQuantity()) {
            int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            return Optional.of(new ProductExclusionDTO(
                    product.getId(),
                    product.getName(),
                    "OUT_OF_STOCK",
                    String.format("Insufficient stock available (%d in stock, %d requested).", available, request.getRequestedQuantity())
            ));
        }

        // 3. Single item retail price exceeds available product budget
        if (product.getRetailPrice().compareTo(availableBudget) > 0) {
            return Optional.of(new ProductExclusionDTO(
                    product.getId(),
                    product.getName(),
                    "BUDGET_EXCEEDED",
                    String.format("Retail price ₹%s exceeds entire available product budget of ₹%s (after packaging).",
                            product.getRetailPrice().toPlainString(), availableBudget.toPlainString())
            ));
        }

        // 4. Allergy & Excluded Ingredients Checking
        List<String> customerAllergies = new ArrayList<>(request.getAllergies());
        customerAllergies.addAll(request.getExcludedIngredients());

        boolean hasAllergyRestrictions = !customerAllergies.isEmpty();

        if (hasAllergyRestrictions) {
            // Rule: When allergy restrictions are supplied, treat unknown or unverified ingredient information conservatively; never label it safe.
            if (product.getIngredientVerificationStatus() != IngredientVerificationStatus.VERIFIED) {
                return Optional.of(new ProductExclusionDTO(
                        product.getId(),
                        product.getName(),
                        "UNVERIFIED_INGREDIENTS",
                        String.format("Product ingredient verification status is '%s'. Excluded under conservative allergy safety policy.",
                                product.getIngredientVerificationStatus())
                ));
            }

            // Normalize customer allergies
            Set<String> normalizedCustomerAllergens = customerAllergies.stream()
                    .map(this::normalizeTerm)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            // Check against declared allergens
            if (product.getDeclaredAllergens() != null) {
                for (String allergen : product.getDeclaredAllergens()) {
                    String normAllergen = normalizeTerm(allergen);
                    for (String customerAllergen : normalizedCustomerAllergens) {
                        if (isAllergenMatch(normAllergen, customerAllergen)) {
                            return Optional.of(new ProductExclusionDTO(
                                    product.getId(),
                                    product.getName(),
                                    "ALLERGEN_CONFLICT",
                                    String.format("Product contains declared allergen: '%s' which conflicts with customer allergy restriction '%s'.",
                                            allergen, customerAllergen)
                            ));
                        }
                    }
                }
            }

            // Check against product ingredients
            if (product.getIngredients() != null) {
                for (String ingredient : product.getIngredients()) {
                    String normIngredient = normalizeTerm(ingredient);
                    for (String customerAllergen : normalizedCustomerAllergens) {
                        if (isAllergenMatch(normIngredient, customerAllergen)) {
                            return Optional.of(new ProductExclusionDTO(
                                    product.getId(),
                                    product.getName(),
                                    "ALLERGEN_CONFLICT",
                                    String.format("Product contains restricted ingredient: '%s' which conflicts with customer constraint '%s'.",
                                            ingredient, customerAllergen)
                            ));
                        }
                    }
                }
            }
        }

        // 5. Skin Type Compatibility Checking
        String customerSkinType = request.getSkinType();
        if (customerSkinType != null && !customerSkinType.trim().isEmpty() && !customerSkinType.equalsIgnoreCase("All")) {
            String normCustomerSkin = normalizeTerm(customerSkinType);

            Set<String> productSkinTypes = product.getSkinTypes();
            if (productSkinTypes != null && !productSkinTypes.isEmpty()) {
                Set<String> normProductSkins = productSkinTypes.stream()
                        .map(this::normalizeTerm)
                        .collect(Collectors.toSet());

                boolean isCompatible = normProductSkins.contains("all")
                        || normProductSkins.contains("any")
                        || normProductSkins.contains(normCustomerSkin)
                        || normProductSkins.contains("all skin types")
                        || normProductSkins.contains("normal");

                if (!isCompatible) {
                    return Optional.of(new ProductExclusionDTO(
                            product.getId(),
                            product.getName(),
                            "SKIN_TYPE_INCOMPATIBLE",
                            String.format("Product is formulated exclusively for %s skin and is incompatible with customer's %s skin type.",
                                    productSkinTypes, customerSkinType)
                    ));
                }
            }
        }

        return Optional.empty();
    }

    /**
     * Diagnostic transparency explanation for a specific product against customer constraints.
     * Reuses strict Step 1 eligibility logic without duplication.
     */
    public Optional<ProductExclusionExplanationDTO> explainProductEligibility(String productId, CustomerRequirementsDTO request) {
        return productRepository.findById(productId)
                .map(product -> explainProductEligibility(product, request));
    }

    public ProductExclusionExplanationDTO explainProductEligibility(Product product, CustomerRequirementsDTO request) {
        BigDecimal packagingCost = request.getPackagingCost() != null ? request.getPackagingCost() : new BigDecimal("150.00");
        BigDecimal availableBudget = request.getMaxBudget() != null
                ? request.getMaxBudget().subtract(packagingCost)
                : new BigDecimal("100000.00");

        Optional<ProductExclusionDTO> exclusion = evaluateEligibility(product, request, availableBudget);
        ProductTransparencyDTO transparency = ProductTransparencyDTO.fromEntity(product);

        if (exclusion.isPresent()) {
            ProductExclusionDTO ex = exclusion.get();
            String conflict = extractConflictingRestriction(product, request, ex.getExclusionCategory());
            transparency.setSafeForCustomerAllergies(false);
            return new ProductExclusionExplanationDTO(
                    product.getId(),
                    product.getName(),
                    false,
                    ex.getExclusionCategory(),
                    ex.getReason(),
                    conflict,
                    transparency
            );
        } else {
            transparency.setSafeForCustomerAllergies(true);
            return new ProductExclusionExplanationDTO(
                    product.getId(),
                    product.getName(),
                    true,
                    null,
                    "Product is eligible and matches all customer criteria.",
                    null,
                    transparency
            );
        }
    }

    private String extractConflictingRestriction(Product product, CustomerRequirementsDTO request, String category) {
        if ("ALLERGEN_CONFLICT".equals(category)) {
            List<String> customerAllergens = new ArrayList<>(request.getAllergies());
            customerAllergens.addAll(request.getExcludedIngredients());
            for (String ca : customerAllergens) {
                String normCa = normalizeTerm(ca);
                if (product.getDeclaredAllergens() != null) {
                    for (String da : product.getDeclaredAllergens()) {
                        if (isAllergenMatch(normalizeTerm(da), normCa)) return "Declared allergen: " + da;
                    }
                }
                if (product.getIngredients() != null) {
                    for (String ing : product.getIngredients()) {
                        if (isAllergenMatch(normalizeTerm(ing), normCa)) return "Restricted ingredient: " + ing;
                    }
                }
            }
        } else if ("SKIN_TYPE_INCOMPATIBLE".equals(category)) {
            return "Customer skin type: " + request.getSkinType() + " (Product formulated for: " + product.getSkinTypes() + ")";
        } else if ("UNVERIFIED_INGREDIENTS".equals(category)) {
            return "Unverified ingredient status: " + product.getIngredientVerificationStatus();
        } else if ("OUT_OF_STOCK".equals(category)) {
            return "Stock available: " + product.getStockQuantity() + ", Requested: " + request.getRequestedQuantity();
        } else if ("BUDGET_EXCEEDED".equals(category)) {
            return "Retail price: ₹" + product.getRetailPrice();
        }
        return category;
    }

    /**
     * Term normalization helper: lowercases, trims, and cleans punctuation.
     */
    private String normalizeTerm(String term) {
        if (term == null) return "";
        return term.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Accurate allergen matching that accounts for plurals and exact token matching,
     * avoiding false substring matches (e.g. "coconut" should not match "nut").
     */
    private boolean isAllergenMatch(String productTerm, String customerTerm) {
        if (productTerm.isEmpty() || customerTerm.isEmpty()) return false;

        if (productTerm.equals(customerTerm)) return true;

        // Plural matching (e.g. nuts vs nut, almonds vs almond)
        if (customerTerm.endsWith("s") && productTerm.equals(customerTerm.substring(0, customerTerm.length() - 1))) return true;
        if (productTerm.endsWith("s") && customerTerm.equals(productTerm.substring(0, productTerm.length() - 1))) return true;

        // Tokenized word-boundary matching
        String[] productWords = productTerm.split("\\s+");
        for (String word : productWords) {
            if (word.equals(customerTerm)) return true;
            if (customerTerm.endsWith("s") && word.equals(customerTerm.substring(0, customerTerm.length() - 1))) return true;
            if (word.endsWith("s") && customerTerm.equals(word.substring(0, word.length() - 1))) return true;
        }

        return false;
    }

    /**
     * Score products based on preference match, occasion, and handcrafted quality.
     */
    private Map<String, Integer> scoreProducts(List<Product> products, CustomerRequirementsDTO request) {
        Map<String, Integer> scores = new HashMap<>();

        Set<String> normalizedPreferences = request.getPreferences().stream()
                .map(this::normalizeTerm)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        String normOccasion = normalizeTerm(request.getOccasion());
        String normRecipient = normalizeTerm(request.getRecipientRelationship());

        for (Product product : products) {
            int score = 10; // Base score for any eligible product

            String normCategory = normalizeTerm(product.getCategory());
            String normDesc = normalizeTerm(product.getDescription());
            String normName = normalizeTerm(product.getName());

            // Preference category matching
            for (String pref : normalizedPreferences) {
                if (normCategory.contains(pref) || normName.contains(pref) || normDesc.contains(pref)) {
                    score += 15;
                }
            }

            // Occasion relevance
            if (!normOccasion.isEmpty() && (normDesc.contains(normOccasion) || normName.contains(normOccasion))) {
                score += 10;
            }

            // Recipient relevance
            if (!normRecipient.isEmpty() && normDesc.contains(normRecipient)) {
                score += 8;
            }

            // Handmade artisan bonus
            if (Boolean.TRUE.equals(product.getHandmade())) {
                score += 5;
            }

            scores.put(product.getId(), score);
        }

        return scores;
    }

    /**
     * Deterministic optimization algorithm to select a distinct hamper tier combination.
     */
    private Optional<HamperTierDTO> buildTierCombination(
            String tierKey,
            String tierName,
            List<Product> candidates,
            BigDecimal packagingCost,
            BigDecimal absoluteMaxBudget,
            BigDecimal targetBudget,
            BigDecimal minBudgetRatio,
            Set<Set<String>> previouslyUsedCombinations,
            String distinctReason
    ) {
        BigDecimal productBudgetCap = targetBudget.subtract(packagingCost);
        if (productBudgetCap.compareTo(BigDecimal.ZERO) <= 0) {
            return Optional.empty();
        }

        BigDecimal minProductSpend = productBudgetCap.multiply(minBudgetRatio).setScale(2, RoundingMode.HALF_UP);

        List<Product> bestCombination = null;
        BigDecimal bestSpend = BigDecimal.ZERO;

        // Try combinations of sizes 2 to 5 items (guaranteeing variety and no duplicates)
        for (int targetSize = 3; targetSize >= 2; targetSize--) {
            List<Product> combo = findBestCombinationOfSize(candidates, targetSize, productBudgetCap, previouslyUsedCombinations);
            if (combo != null && !combo.isEmpty()) {
                BigDecimal comboTotal = calculateProductsTotal(combo);
                if (comboTotal.compareTo(bestSpend) > 0) {
                    bestSpend = comboTotal;
                    bestCombination = combo;
                }
            }
        }

        // If no combination of 2-3 items found, try 1 item or 4 items if budget permits
        if (bestCombination == null) {
            List<Product> combo4 = findBestCombinationOfSize(candidates, 4, productBudgetCap, previouslyUsedCombinations);
            if (combo4 != null && !combo4.isEmpty()) {
                bestCombination = combo4;
                bestSpend = calculateProductsTotal(combo4);
            } else {
                List<Product> combo1 = findBestCombinationOfSize(candidates, 1, productBudgetCap, previouslyUsedCombinations);
                if (combo1 != null && !combo1.isEmpty()) {
                    bestCombination = combo1;
                    bestSpend = calculateProductsTotal(combo1);
                }
            }
        }

        if (bestCombination == null || bestCombination.isEmpty()) {
            return Optional.empty();
        }

        BigDecimal finalTotal = bestSpend.add(packagingCost);

        // Verification safety check: Final total MUST NEVER exceed customer's maximum budget!
        if (finalTotal.compareTo(absoluteMaxBudget) > 0) {
            log.error("CRITICAL SAFETY BREACH PREVENTED: Calculated hamper total ₹{} exceeds max budget ₹{}", finalTotal, absoluteMaxBudget);
            return Optional.empty();
        }

        BigDecimal remainingBudget = absoluteMaxBudget.subtract(finalTotal);
        BigDecimal utilizationPercent = finalTotal.multiply(new BigDecimal("100"))
                .divide(absoluteMaxBudget, 1, RoundingMode.HALF_UP);

        List<ProductRecommendationDTO> productDTOs = bestCombination.stream()
                .map(p -> new ProductRecommendationDTO(
                        p.getId(),
                        p.getName(),
                        p.getCategory(),
                        p.getRetailPrice(),
                        1,
                        p.getRetailPrice(),
                        p.getHandmade(),
                        p.getIngredientVerificationStatus(),
                        p.getDeclaredAllergens(),
                        p.getImageUrl()
                ))
                .collect(Collectors.toList());

        return Optional.of(new HamperTierDTO(
                tierKey,
                tierName,
                productDTOs,
                productDTOs.size(),
                bestSpend,
                packagingCost,
                finalTotal,
                remainingBudget,
                utilizationPercent,
                distinctReason
        ));
    }

    /**
     * Bounded recursive search to find highest-value combination of a fixed size.
     */
    private List<Product> findBestCombinationOfSize(List<Product> candidates, int size, BigDecimal maxBudget, Set<Set<String>> excludeCombos) {
        List<Product> best = null;
        BigDecimal maxTotal = BigDecimal.ZERO;

        int n = Math.min(candidates.size(), 20); // Limit search space to top 20 candidates for fast deterministic resolution
        List<Product> subset = candidates.subList(0, n);

        List<List<Product>> allCombos = new ArrayList<>();
        generateCombinations(subset, size, 0, new ArrayList<>(), allCombos);

        for (List<Product> combo : allCombos) {
            Set<String> idSet = combo.stream().map(Product::getId).collect(Collectors.toSet());
            if (excludeCombos.contains(idSet)) {
                continue;
            }

            BigDecimal total = calculateProductsTotal(combo);
            if (total.compareTo(maxBudget) <= 0 && total.compareTo(maxTotal) > 0) {
                maxTotal = total;
                best = combo;
            }
        }

        return best;
    }

    private void generateCombinations(List<Product> items, int k, int start, List<Product> current, List<List<Product>> result) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < items.size(); i++) {
            current.add(items.get(i));
            generateCombinations(items, k, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    private BigDecimal calculateProductsTotal(List<Product> products) {
        BigDecimal total = BigDecimal.ZERO;
        for (Product p : products) {
            total = total.add(p.getRetailPrice());
        }
        return total;
    }

    private Set<String> getProductIdSet(HamperTierDTO tier) {
        return tier.getProducts().stream()
                .map(ProductRecommendationDTO::getId)
                .collect(Collectors.toSet());
    }

    /**
     * Generate upsell recommendation only when a real eligible item can elevate the hamper,
     * calculating exact additional spend.
     */
    private UpsellSuggestionDTO generateUpsellSuggestion(Map<String, HamperTierDTO> tiers, List<Product> eligibleProducts, BigDecimal packagingCost, BigDecimal maxBudget) {
        HamperTierDTO baseTier = tiers.get("HIGH");
        if (baseTier == null) {
            baseTier = tiers.get("MEDIUM");
        }
        if (baseTier == null) {
            baseTier = tiers.get("LOW");
        }
        if (baseTier == null) {
            return UpsellSuggestionDTO.notAvailable("No eligible base tier available to compute an upsell.");
        }

        Set<String> existingProductIds = getProductIdSet(baseTier);
        BigDecimal currentTotal = baseTier.getFinalTotal();

        Product bestUpsellProduct = null;
        BigDecimal minAdditionalSpend = null;

        for (Product candidate : eligibleProducts) {
            if (existingProductIds.contains(candidate.getId())) {
                continue; // Avoid duplicates
            }

            BigDecimal candidateNewTotal = currentTotal.add(candidate.getRetailPrice());
            BigDecimal additionalSpend = candidateNewTotal.subtract(maxBudget);

            // Upsell should be within reasonable extra budget range (e.g. +₹100 to +₹600 over original budget)
            if (additionalSpend.compareTo(BigDecimal.ZERO) > 0 && additionalSpend.compareTo(new BigDecimal("700.00")) <= 0) {
                if (minAdditionalSpend == null || additionalSpend.compareTo(minAdditionalSpend) < 0) {
                    minAdditionalSpend = additionalSpend;
                    bestUpsellProduct = candidate;
                }
            }
        }

        if (bestUpsellProduct != null && minAdditionalSpend != null) {
            BigDecimal newTotal = currentTotal.add(bestUpsellProduct.getRetailPrice());
            ProductRecommendationDTO productDTO = new ProductRecommendationDTO(
                    bestUpsellProduct.getId(),
                    bestUpsellProduct.getName(),
                    bestUpsellProduct.getCategory(),
                    bestUpsellProduct.getRetailPrice(),
                    1,
                    bestUpsellProduct.getRetailPrice(),
                    bestUpsellProduct.getHandmade(),
                    bestUpsellProduct.getIngredientVerificationStatus(),
                    bestUpsellProduct.getDeclaredAllergens(),
                    bestUpsellProduct.getImageUrl()
            );

            String message = String.format("Add '%s' for ₹%s more (+₹%s above your ₹%s budget) to elevate your hamper to an opulent masterwork.",
                    bestUpsellProduct.getName(),
                    bestUpsellProduct.getRetailPrice().toPlainString(),
                    minAdditionalSpend.toPlainString(),
                    maxBudget.toPlainString());

            return new UpsellSuggestionDTO(
                    true,
                    productDTO,
                    currentTotal,
                    newTotal,
                    minAdditionalSpend,
                    message
            );
        }

        return UpsellSuggestionDTO.notAvailable("No suitable upsell item found within standard incremental threshold.");
    }
}
