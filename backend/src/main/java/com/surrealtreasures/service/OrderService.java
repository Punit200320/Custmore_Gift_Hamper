package com.surrealtreasures.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.CorporateQuotation;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Order;
import com.surrealtreasures.entity.OrderItem;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.repository.CorporateQuotationRepository;
import com.surrealtreasures.repository.OrderRepository;
import com.surrealtreasures.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Order Processing, Inventory Revalidation, and Warehouse Packing Slip Generation.
 * Reuses validation rules from HamperRecommendationService and CorporateQuotationService.
 */
@Service
@Transactional
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CorporateQuotationRepository quotationRepository;
    private final ObjectMapper objectMapper;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        CorporateQuotationRepository quotationRepository,
                        ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.quotationRepository = quotationRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Create and confirm an order from a confirmed hamper selection or accepted corporate quotation.
     * Revalidates inventory stock, allergy restrictions, and budget constraints before confirmation.
     * Deducts inventory stock upon confirmation.
     */
    public OrderResponseDTO createOrder(CreateOrderRequestDTO request) {
        validateOrderRequest(request);

        // 1. Resolve Items (from corporate quotation or explicit hamper items)
        List<OrderItemRequestDTO> itemsToOrder = new ArrayList<>();
        String resolvedBoxSize = request.getBoxSize();
        String resolvedPackaging = request.getPackagingOption();
        List<String> customerAllergies = new ArrayList<>(request.getAllergies() != null ? request.getAllergies() : Collections.emptyList());
        List<String> excludedIngredients = new ArrayList<>(request.getExcludedIngredients() != null ? request.getExcludedIngredients() : Collections.emptyList());

        if (request.getQuotationId() != null && !request.getQuotationId().trim().isEmpty()) {
            CorporateQuotation quote = quotationRepository.findById(request.getQuotationId().trim())
                    .orElseThrow(() -> new ApiException("Corporate quotation not found with ID: " + request.getQuotationId(), HttpStatus.NOT_FOUND));

            // Verify quotation is accepted/confirmed and fulfillable
            if (!"CONFIRMED".equalsIgnoreCase(quote.getStatus()) || !Boolean.TRUE.equals(quote.getFulfillable())) {
                throw new ApiException(String.format("Cannot create order from unconfirmed or rejected corporate quotation '%s'. Status: %s, Message: %s",
                        quote.getId(), quote.getStatus(), quote.getStatusMessage()), HttpStatus.BAD_REQUEST);
            }

            try {
                CorporateQuotationResponseDTO snapshot = objectMapper.readValue(quote.getSnapshotJson(), CorporateQuotationResponseDTO.class);
                if (resolvedBoxSize == null && snapshot.getPackagingOption() != null) {
                    resolvedBoxSize = mapPackagingToBoxSize(snapshot.getPackagingOption());
                }
                if (resolvedPackaging == null) {
                    resolvedPackaging = snapshot.getPackagingOption();
                }

                // If items were not explicitly overridden in request, map from quotation items
                if (request.getItems() == null || request.getItems().isEmpty()) {
                    for (CorporateQuotationItemDTO itemSnapshot : snapshot.getItems()) {
                        int totalRequired = itemSnapshot.getTotalQuantityRequired();
                        itemsToOrder.add(new OrderItemRequestDTO(itemSnapshot.getProductId(), totalRequired));
                    }
                } else {
                    itemsToOrder.addAll(request.getItems());
                }
            } catch (JsonProcessingException e) {
                log.error("Failed to parse corporate quotation snapshot for ID: {}", quote.getId(), e);
                throw new ApiException("Invalid corporate quotation snapshot data in database.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            if (request.getItems() == null || request.getItems().isEmpty()) {
                throw new ApiException("Order must contain at least one product item.", HttpStatus.BAD_REQUEST);
            }
            itemsToOrder.addAll(request.getItems());
        }

        if (itemsToOrder.isEmpty()) {
            throw new ApiException("No product items could be resolved for order confirmation.", HttpStatus.BAD_REQUEST);
        }

        // 2. Recheck Inventory Stock, Safety/Allergies, and Pricing
        BigDecimal totalProductRetail = BigDecimal.ZERO;
        BigDecimal totalProductCost = BigDecimal.ZERO;
        boolean allCostsRecorded = true;
        List<OrderItem> orderItems = new ArrayList<>();
        int sequenceNumber = 1;

        // Group quantities by productId to check total requested per product
        Map<String, Integer> productQuantities = new LinkedHashMap<>();
        for (OrderItemRequestDTO itemReq : itemsToOrder) {
            int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
            productQuantities.put(itemReq.getProductId(), productQuantities.getOrDefault(itemReq.getProductId(), 0) + qty);
        }

        // Validate stock for all products before deducting
        for (Map.Entry<String, Integer> entry : productQuantities.entrySet()) {
            String prodId = entry.getKey();
            int requiredStock = entry.getValue();

            Product product = productRepository.findById(prodId)
                    .orElseThrow(() -> new ApiException("Product not found with ID: " + prodId, HttpStatus.NOT_FOUND));

            if (Boolean.FALSE.equals(product.getActive())) {
                throw new ApiException(String.format("Product '%s' (ID: %s) is inactive and cannot be ordered.",
                        product.getName(), product.getId()), HttpStatus.BAD_REQUEST);
            }

            int availableStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (availableStock < requiredStock) {
                throw new ApiException(String.format("Insufficient stock for product '%s' (%s): requested %d units, but inventory only has %d units.",
                        product.getName(), product.getId(), requiredStock, availableStock), HttpStatus.BAD_REQUEST);
            }
        }

        // Validate allergy and conservative ingredient safety constraints
        for (OrderItemRequestDTO itemReq : itemsToOrder) {
            Product product = productRepository.findById(itemReq.getProductId()).get();
            int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;

            if (!customerAllergies.isEmpty() || !excludedIngredients.isEmpty()) {
                // Check declared allergens
                if (product.getDeclaredAllergens() != null) {
                    for (String declared : product.getDeclaredAllergens()) {
                        for (String allergy : customerAllergies) {
                            if (declared.equalsIgnoreCase(allergy) ||
                                declared.toLowerCase().contains(allergy.toLowerCase()) ||
                                allergy.toLowerCase().contains(declared.toLowerCase())) {
                                throw new ApiException(String.format("Allergy Safety Violation: Product '%s' contains declared allergen '%s' matching customer allergy restriction '%s'.",
                                        product.getName(), declared, allergy), HttpStatus.BAD_REQUEST);
                            }
                        }
                    }
                }

                // Check conservative safety policy: if customer specified allergies, product must be VERIFIED
                if (product.getIngredientVerificationStatus() != IngredientVerificationStatus.VERIFIED) {
                    throw new ApiException(String.format("Conservative Safety Policy: Product '%s' ingredients are %s and cannot be certified safe for allergen-sensitive orders.",
                            product.getName(), product.getIngredientVerificationStatus()), HttpStatus.BAD_REQUEST);
                }
            }

            // Dimensions: use item-provided dimensions if available, otherwise product recorded dimensions
            BigDecimal lengthCm = itemReq.getLengthCm() != null ? itemReq.getLengthCm() : product.getLengthCm();
            BigDecimal widthCm = itemReq.getWidthCm() != null ? itemReq.getWidthCm() : product.getWidthCm();
            BigDecimal heightCm = itemReq.getHeightCm() != null ? itemReq.getHeightCm() : product.getHeightCm();
            BigDecimal volumeCm3 = itemReq.getVolumeCm3() != null ? itemReq.getVolumeCm3() : product.getVolumeCm3();
            BigDecimal weightGrams = itemReq.getWeightGrams() != null ? itemReq.getWeightGrams() : product.getWeightGrams();

            if (volumeCm3 == null && lengthCm != null && widthCm != null && heightCm != null) {
                volumeCm3 = lengthCm.multiply(widthCm).multiply(heightCm).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal unitRetail = product.getRetailPrice() != null ? product.getRetailPrice() : BigDecimal.ZERO;
            BigDecimal lineRetail = unitRetail.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
            totalProductRetail = totalProductRetail.add(lineRetail);

            BigDecimal unitCost = product.getUnitCost();
            BigDecimal lineCost = null;
            if (unitCost != null) {
                lineCost = unitCost.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
                totalProductCost = totalProductCost.add(lineCost);
            } else {
                allCostsRecorded = false;
            }

            OrderItem orderItem = new OrderItem(
                    sequenceNumber++,
                    product.getId(),
                    product.getName(),
                    product.getCategory(),
                    qty,
                    unitRetail,
                    lineRetail,
                    unitCost,
                    lineCost,
                    lengthCm,
                    widthCm,
                    heightCm,
                    volumeCm3,
                    weightGrams,
                    product.getPackagingInfo(),
                    product.getCrossContaminationWarning(),
                    product.getIngredientVerificationStatus() != null ? product.getIngredientVerificationStatus().name() : "UNVERIFIED"
            );
            orderItems.add(orderItem);
        }

        // Packaging & Total Pricing
        BigDecimal packagingRetail = request.getPackagingRetailPrice();
        if (packagingRetail == null) {
            packagingRetail = (resolvedBoxSize != null && !resolvedBoxSize.trim().isEmpty())
                    ? new BigDecimal("150.00") : BigDecimal.ZERO;
        }

        BigDecimal packagingCost = request.getPackagingCost();
        if (packagingCost == null) {
            packagingCost = (resolvedBoxSize != null && !resolvedBoxSize.trim().isEmpty())
                    ? new BigDecimal("60.00") : BigDecimal.ZERO;
        }

        BigDecimal totalOrderAmount = totalProductRetail.add(packagingRetail).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalOrderCost = allCostsRecorded ? totalProductCost.add(packagingCost).setScale(2, RoundingMode.HALF_UP) : null;

        // 3. Recheck Budget Constraint
        if (request.getCustomerBudget() != null) {
            if (totalOrderAmount.compareTo(request.getCustomerBudget()) > 0) {
                throw new ApiException(String.format("Budget Exceeded: Order total ₹%s exceeds customer specified budget limit of ₹%s.",
                        totalOrderAmount.toPlainString(), request.getCustomerBudget().toPlainString()), HttpStatus.BAD_REQUEST);
            }
        }

        // 4. Deduct Inventory Stock
        for (Map.Entry<String, Integer> entry : productQuantities.entrySet()) {
            Product product = productRepository.findById(entry.getKey()).get();
            int newStock = product.getStockQuantity() - entry.getValue();
            product.setStockQuantity(newStock);
            productRepository.save(product);
            log.info("Deducted {} units for product {}. New available stock: {}", entry.getValue(), product.getId(), newStock);
        }

        // 5. Persist Order Entity
        String orderId = "ORD-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderRef = request.getOrderReference();
        if (orderRef == null || orderRef.trim().isEmpty()) {
            orderRef = "ST-REF-" + System.currentTimeMillis();
        }

        Order order = new Order(
                orderId,
                orderRef.trim(),
                request.getQuotationId(),
                request.getCustomerName().trim(),
                request.getCustomerEmail().trim(),
                request.getRecipientName() != null ? request.getRecipientName().trim() : request.getCustomerName().trim(),
                request.getDeliveryAddress().trim(),
                resolvedBoxSize,
                resolvedPackaging != null ? resolvedPackaging : "Standard Keepsake Presentation Box",
                "WAREHOUSE_READY",
                "Order confirmed and verified against inventory, allergy constraints, and budget. Warehouse slip generated.",
                totalProductRetail,
                packagingRetail,
                totalOrderAmount,
                allCostsRecorded ? totalProductCost : null,
                packagingCost,
                totalOrderCost,
                request.getCustomerBudget(),
                request.getFulfilmentNotes(),
                new HashSet<>(customerAllergies),
                LocalDateTime.now()
        );

        for (OrderItem oi : orderItems) {
            order.addItem(oi);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Persisted confirmed order {} with reference {} and {} items.", savedOrder.getId(), savedOrder.getOrderReference(), savedOrder.getItems().size());

        return mapToOrderResponseDTO(savedOrder);
    }

    /**
     * Retrieve an order by its unique ID.
     */
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found with ID: " + orderId, HttpStatus.NOT_FOUND));
        return mapToOrderResponseDTO(order);
    }

    /**
     * Generate structured warehouse packing slip payload for warehouse dispatch and integration.
     * Validates 2D dimensions, item volume against box capacity, compiles grounded packing instructions,
     * allergen warnings, and cost breakdown.
     */
    @Transactional(readOnly = true)
    public WarehousePackingSlipDTO generatePackingSlip(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found with ID: " + orderId, HttpStatus.NOT_FOUND));

        String boxSize = order.getBoxSize();
        BoxDimensionsDTO boxDimensions = BoxDimensionsDTO.getStandardBoxDimensions(boxSize);

        // 1. Physical Dimension & Volume Capacity Validation
        DimensionFitValidationDTO dimensionFitValidation = evaluatePhysicalFit(boxDimensions, order.getItems(), boxSize);

        BoxPackingDetailsDTO boxDetails = new BoxPackingDetailsDTO(
                boxSize != null ? boxSize : "Unspecified Box",
                order.getPackagingOption() != null ? order.getPackagingOption() : "Artisan Keepsake Box",
                boxDimensions,
                dimensionFitValidation
        );

        // 2. Assemble Packing Slip Items with Grounded Instructions
        List<PackingSlipItemDTO> slipItems = new ArrayList<>();
        List<String> productAllergenWarnings = new ArrayList<>();
        List<String> crossContaminationWarnings = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            ItemDimensionsDTO itemDim = null;
            if (item.getLengthCm() != null && item.getWidthCm() != null && item.getHeightCm() != null) {
                itemDim = new ItemDimensionsDTO(
                        item.getLengthCm(),
                        item.getWidthCm(),
                        item.getHeightCm(),
                        item.getVolumeCm3(),
                        item.getWeightGrams()
                );
            }

            // Grounded Packing Instructions from recorded packaging data
            String packingInstructions = generateGroundedPackingInstructions(item);

            // Item-level Allergen Warnings
            String allergenWarning = null;
            if (item.getCrossContaminationWarning() != null && !item.getCrossContaminationWarning().trim().isEmpty()) {
                allergenWarning = "Cross-contamination note: " + item.getCrossContaminationWarning().trim();
                crossContaminationWarnings.add(String.format("%s: %s", item.getProductName(), item.getCrossContaminationWarning().trim()));
            }

            // Retrieve declared allergens from master product entity for full safety audit
            List<String> declaredAllergens = Collections.emptyList();
            Optional<Product> prodOpt = productRepository.findById(item.getProductId());
            if (prodOpt.isPresent() && prodOpt.get().getDeclaredAllergens() != null) {
                declaredAllergens = prodOpt.get().getDeclaredAllergens();
                if (!declaredAllergens.isEmpty()) {
                    productAllergenWarnings.add(String.format("%s declared allergens: %s",
                            item.getProductName(), String.join(", ", declaredAllergens)));
                }
            }

            PackingSlipItemDTO slipItem = new PackingSlipItemDTO(
                    item.getItemSequence(),
                    item.getProductId(),
                    item.getProductName(),
                    item.getCategory(),
                    item.getQuantity(),
                    itemDim,
                    item.getPackagingInfo(),
                    packingInstructions,
                    declaredAllergens,
                    allergenWarning,
                    item.getUnitRetailPrice(),
                    item.getTotalRetailPrice(),
                    item.getUnitCost(),
                    item.getTotalCost(),
                    item.getIngredientVerificationStatus()
            );
            slipItems.add(slipItem);
        }

        // 3. Allergen Restrictions & Safety Audit
        AllergenSafetySlipDTO allergenSummary = new AllergenSafetySlipDTO(
                new ArrayList<>(order.getAllergens()),
                productAllergenWarnings,
                crossContaminationWarnings,
                "VERIFIED_SAFE"
        );

        // 4. Cost Breakdown
        boolean costAvailable = (order.getTotalOrderCost() != null);
        PackingSlipCostBreakdownDTO costBreakdown = new PackingSlipCostBreakdownDTO(
                order.getTotalProductRetail(),
                order.getPackagingRetailPrice(),
                order.getTotalOrderAmount(),
                order.getTotalProductCost(),
                order.getPackagingCost(),
                order.getTotalOrderCost(),
                costAvailable
        );

        return new WarehousePackingSlipDTO(
                order.getId(),
                order.getOrderReference(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getCustomerName(),
                order.getRecipientName(),
                order.getDeliveryAddress(),
                order.getFulfilmentNotes(),
                boxDetails,
                slipItems,
                allergenSummary,
                costBreakdown
        );
    }

    /**
     * Evaluates 2D footprint, individual item dimensions, and total volume capacity.
     * Returns explicit NOT_VALIDATED_MISSING_DIMENSIONS status if box or item dimensions are missing.
     */
    private DimensionFitValidationDTO evaluatePhysicalFit(BoxDimensionsDTO boxDimensions, List<OrderItem> items, String boxSize) {
        if (boxDimensions == null) {
            String msg = String.format("Box size '%s' has no configured physical dimensions. Physical fit cannot be certified; staging for manual box selection.",
                    boxSize != null ? boxSize : "Unspecified");
            return DimensionFitValidationDTO.missingDimensions(Collections.singletonList("Box: " + (boxSize != null ? boxSize : "Unspecified")), msg);
        }

        List<String> missingDimensionItems = new ArrayList<>();
        for (OrderItem item : items) {
            if (item.getLengthCm() == null || item.getWidthCm() == null || item.getHeightCm() == null) {
                missingDimensionItems.add(String.format("%s (%s)", item.getProductName(), item.getProductId()));
            }
        }

        if (!missingDimensionItems.isEmpty()) {
            String msg = String.format("Physical dimensions not recorded for item(s): %s. Physical fit cannot be verified without complete dimensional data.",
                    String.join(", ", missingDimensionItems));
            return DimensionFitValidationDTO.missingDimensions(missingDimensionItems, msg);
        }

        // All product and box dimensions are available: validate physical fit
        List<String> violations = new ArrayList<>();
        BigDecimal totalVolume = BigDecimal.ZERO;
        BigDecimal boxMaxSide = boxDimensions.getLengthCm().max(boxDimensions.getWidthCm());
        BigDecimal boxMinSide = boxDimensions.getLengthCm().min(boxDimensions.getWidthCm());
        BigDecimal boxHeight = boxDimensions.getHeightCm();

        for (OrderItem item : items) {
            BigDecimal itemMaxSide = item.getLengthCm().max(item.getWidthCm());
            BigDecimal itemMinSide = item.getLengthCm().min(item.getWidthCm());

            // 2D footprint check (with 90-degree planar rotation)
            if (itemMaxSide.compareTo(boxMaxSide) > 0 || itemMinSide.compareTo(boxMinSide) > 0) {
                violations.add(String.format("Item '%s' 2D footprint (%sx%s cm) exceeds box interior boundary (%sx%s cm).",
                        item.getProductName(), item.getLengthCm(), item.getWidthCm(), boxDimensions.getLengthCm(), boxDimensions.getWidthCm()));
            }

            // Height check
            if (item.getHeightCm().compareTo(boxHeight) > 0) {
                violations.add(String.format("Item '%s' height (%s cm) exceeds box interior depth (%s cm).",
                        item.getProductName(), item.getHeightCm(), boxHeight));
            }

            // Volume calculation
            BigDecimal unitVolume = item.getVolumeCm3() != null ? item.getVolumeCm3()
                    : item.getLengthCm().multiply(item.getWidthCm()).multiply(item.getHeightCm()).setScale(2, RoundingMode.HALF_UP);
            BigDecimal itemTotalVolume = unitVolume.multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            totalVolume = totalVolume.add(itemTotalVolume);
        }

        BigDecimal boxCapacity = boxDimensions.getVolumeCapacityCm3();
        BigDecimal utilization = BigDecimal.ZERO;
        if (boxCapacity != null && boxCapacity.compareTo(BigDecimal.ZERO) > 0) {
            utilization = totalVolume.multiply(new BigDecimal("100")).divide(boxCapacity, 2, RoundingMode.HALF_UP);
        }

        if (!violations.isEmpty()) {
            return DimensionFitValidationDTO.fitExceeded(
                    "DIMENSION_FIT_EXCEEDED",
                    "One or more items exceed configured box physical boundary dimensions: " + String.join("; ", violations),
                    violations,
                    totalVolume,
                    boxCapacity,
                    utilization
            );
        }

        if (boxCapacity != null && totalVolume.compareTo(boxCapacity) > 0) {
            violations.add(String.format("Total product volume (%s cm3) exceeds box capacity (%s cm3).",
                    totalVolume.toPlainString(), boxCapacity.toPlainString()));
            return DimensionFitValidationDTO.fitExceeded(
                    "VOLUME_CAPACITY_EXCEEDED",
                    String.format("Total product volume (%s cm3) exceeds box capacity (%s cm3) by %s cm3.",
                            totalVolume.toPlainString(), boxCapacity.toPlainString(), totalVolume.subtract(boxCapacity).toPlainString()),
                    violations,
                    totalVolume,
                    boxCapacity,
                    utilization
            );
        }

        return DimensionFitValidationDTO.verifiedFit(
                totalVolume,
                boxCapacity,
                utilization,
                String.format("Physical fit verified. Total items volume is %s cm3 (%s%% of %s cm3 box capacity). All 2D boundaries satisfied.",
                        totalVolume.toPlainString(), utilization.toPlainString(), boxCapacity != null ? boxCapacity.toPlainString() : "N/A")
        );
    }

    /**
     * Generates grounded packing instructions based solely on recorded product packaging,
     * container format, and recorded handling notes. Avoids fabricated physics or ungrounded rules.
     */
    private String generateGroundedPackingInstructions(OrderItem item) {
        String packagingInfo = item.getPackagingInfo();
        if (packagingInfo == null || packagingInfo.trim().isEmpty()) {
            return "Standard careful handling applies. No container specifications recorded in catalogue.";
        }

        String lower = packagingInfo.toLowerCase();
        StringBuilder sb = new StringBuilder();
        sb.append("Recorded container: ").append(packagingInfo.trim()).append(". ");

        if (lower.contains("glass") || lower.contains("bottle") || lower.contains("jar")) {
            sb.append("Fragile glass container: cushion with protective wood wool and secure upright in presentation bed.");
        } else if (lower.contains("paper") || lower.contains("wrap") || lower.contains("soap")) {
            sb.append("Artisan paper wrap: place atop dry wood shavings away from damp or oily surfaces.");
        } else if (lower.contains("tin")) {
            sb.append("Metal travel tin: seat securely in accessory bedding.");
        } else if (lower.contains("drawer box") || lower.contains("gemstone") || lower.contains("jade")) {
            sb.append("Self-contained gift drawer box: place flat along the base or side boundary of the hamper.");
        } else {
            sb.append("Nestle securely in wood wool bedding according to standard workshop packing guidelines.");
        }

        return sb.toString();
    }

    private void validateOrderRequest(CreateOrderRequestDTO request) {
        if (request == null) {
            throw new ApiException("Order request cannot be null.", HttpStatus.BAD_REQUEST);
        }
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new ApiException("Customer name is required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getCustomerEmail() == null || request.getCustomerEmail().trim().isEmpty()) {
            throw new ApiException("Customer email is required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getDeliveryAddress() == null || request.getDeliveryAddress().trim().isEmpty()) {
            throw new ApiException("Delivery address is required.", HttpStatus.BAD_REQUEST);
        }
    }

    private String mapPackagingToBoxSize(String packagingOption) {
        if (packagingOption == null) {
            return "Classic";
        }
        String lower = packagingOption.toLowerCase();
        if (lower.contains("petite")) return "Petite";
        if (lower.contains("deluxe")) return "Deluxe";
        if (lower.contains("grand") || lower.contains("trunk")) return "Grand";
        return "Classic";
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderReference(order.getOrderReference());
        dto.setQuotationId(order.getQuotationId());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setRecipientName(order.getRecipientName());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setBoxSize(order.getBoxSize());
        dto.setPackagingOption(order.getPackagingOption());
        dto.setStatus(order.getStatus());
        dto.setStatusMessage(order.getStatusMessage());
        dto.setTotalProductRetail(order.getTotalProductRetail());
        dto.setPackagingRetailPrice(order.getPackagingRetailPrice());
        dto.setTotalOrderAmount(order.getTotalOrderAmount());
        dto.setTotalProductCost(order.getTotalProductCost());
        dto.setPackagingCost(order.getPackagingCost());
        dto.setTotalOrderCost(order.getTotalOrderCost());
        dto.setCustomerBudget(order.getCustomerBudget());
        dto.setFulfilmentNotes(order.getFulfilmentNotes());
        dto.setAllergens(new HashSet<>(order.getAllergens()));
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream().map(item -> new OrderItemResponseDTO(
                item.getId(),
                item.getItemSequence(),
                item.getProductId(),
                item.getProductName(),
                item.getCategory(),
                item.getQuantity(),
                item.getUnitRetailPrice(),
                item.getTotalRetailPrice(),
                item.getUnitCost(),
                item.getTotalCost(),
                item.getLengthCm(),
                item.getWidthCm(),
                item.getHeightCm(),
                item.getVolumeCm3(),
                item.getWeightGrams(),
                item.getPackagingInfo(),
                item.getCrossContaminationWarning(),
                item.getIngredientVerificationStatus()
        )).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
