package com.surrealtreasures.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.CorporateQuotation;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Order;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.repository.CorporateQuotationRepository;
import com.surrealtreasures.repository.OrderRepository;
import com.surrealtreasures.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CorporateQuotationRepository quotationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    @DisplayName("Create valid order from hamper selection, deducts inventory, and sets WAREHOUSE_READY status")
    void testCreateOrder_FromHamperSelection_Success() {
        Product soap = productRepository.findById("prod_soap_lavender").orElseThrow();
        int initialStock = soap.getStockQuantity();

        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Ananya Sharma",
                "ananya@example.com",
                "Flat 4B, Koregaon Park, Pune",
                "Classic",
                "Handcrafted Pine Wood Keepsake Chest",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_soap_lavender", 2),
                        new OrderItemRequestDTO("prod_body_oil_citrus", 1)
                )
        );
        request.setFulfilmentNotes("Calligraphed gift card: Wishing you pure botanical bliss!");

        OrderResponseDTO response = orderService.createOrder(request);

        assertNotNull(response.getId());
        assertTrue(response.getId().startsWith("ORD-"));
        assertEquals("WAREHOUSE_READY", response.getStatus());
        assertEquals("Ananya Sharma", response.getCustomerName());
        assertEquals("Classic", response.getBoxSize());
        assertEquals(2, response.getItems().size());
        assertEquals(1, response.getItems().get(0).getItemSequence());
        assertEquals(2, response.getItems().get(1).getItemSequence());

        // Verify stock deducted in catalogue
        Product updatedSoap = productRepository.findById("prod_soap_lavender").orElseThrow();
        assertEquals(initialStock - 2, updatedSoap.getStockQuantity());
    }

    @Test
    @DisplayName("Create order from accepted corporate quotation maps items and deducts bulk stock")
    void testCreateOrder_FromAcceptedCorporateQuotation() throws Exception {
        Product soap = productRepository.findById("prod_soap_lavender").orElseThrow();
        int initialStock = soap.getStockQuantity();

        CorporateQuotationResponseDTO snapshotDTO = new CorporateQuotationResponseDTO();
        snapshotDTO.setQuoteId("CQ-TEST-1001");
        snapshotDTO.setCompanyName("Acme Corp");
        snapshotDTO.setStatus("CONFIRMED");
        snapshotDTO.setFulfillable(true);
        snapshotDTO.setPackagingOption("Handcrafted Pine Wood Keepsake Chest");

        CorporateQuotationItemDTO itemSnapshot = new CorporateQuotationItemDTO(
                "prod_soap_lavender",
                "Lavender & Roman Chamomile Artisan Soap",
                "Artisan Soaps",
                new BigDecimal("320.00"),
                new BigDecimal("120.00"),
                2,
                4, // 4 total units
                new BigDecimal("1280.00"),
                new BigDecimal("480.00"),
                initialStock,
                true,
                IngredientVerificationStatus.VERIFIED,
                Collections.singletonList("lavender"),
                true
        );
        snapshotDTO.setItems(Collections.singletonList(itemSnapshot));

        CorporateQuotation quote = new CorporateQuotation(
                "CQ-TEST-1001",
                "Acme Corp",
                2,
                "Corporate Festive Gifting",
                "Executives",
                "CONFIRMED",
                "Confirmed and fulfillable",
                true,
                new BigDecimal("2000.00"),
                new BigDecimal("4000.00"),
                new BigDecimal("790.00"),
                new BigDecimal("300.00"),
                new BigDecimal("60.00"),
                BigDecimal.ZERO,
                new BigDecimal("360.00"),
                new BigDecimal("430.00"),
                new BigDecimal("1580.00"),
                new BigDecimal("720.00"),
                new BigDecimal("860.00"),
                new BigDecimal("54.43"),
                objectMapper.writeValueAsString(snapshotDTO),
                LocalDateTime.now()
        );
        quotationRepository.save(quote);

        CreateOrderRequestDTO orderReq = new CreateOrderRequestDTO();
        orderReq.setQuotationId("CQ-TEST-1001");
        orderReq.setCustomerName("Acme HR");
        orderReq.setCustomerEmail("hr@acme.com");
        orderReq.setDeliveryAddress("Acme Tower, Mumbai");

        OrderResponseDTO orderResponse = orderService.createOrder(orderReq);

        assertNotNull(orderResponse);
        assertEquals("CQ-TEST-1001", orderResponse.getQuotationId());
        assertEquals("WAREHOUSE_READY", orderResponse.getStatus());
        assertEquals(1, orderResponse.getItems().size());
        assertEquals(4, orderResponse.getItems().get(0).getQuantity());

        Product updatedSoap = productRepository.findById("prod_soap_lavender").orElseThrow();
        assertEquals(initialStock - 4, updatedSoap.getStockQuantity());
    }

    @Test
    @DisplayName("Prevent order creation from rejected corporate quotation")
    void testCreateOrder_Fails_WhenQuotationRejected() throws Exception {
        CorporateQuotation quote = new CorporateQuotation(
                "CQ-REJECTED-001",
                "Budget Constrained Corp",
                50,
                "Gifting",
                "Employees",
                "REJECTED_INSUFFICIENT_STOCK",
                "Insufficient stock in warehouse",
                false,
                new BigDecimal("500.00"),
                new BigDecimal("25000.00"),
                new BigDecimal("800.00"),
                new BigDecimal("300.00"),
                new BigDecimal("60.00"),
                BigDecimal.ZERO,
                new BigDecimal("360.00"),
                new BigDecimal("440.00"),
                new BigDecimal("40000.00"),
                new BigDecimal("18000.00"),
                new BigDecimal("22000.00"),
                new BigDecimal("55.00"),
                "{}",
                LocalDateTime.now()
        );
        quotationRepository.save(quote);

        CreateOrderRequestDTO orderReq = new CreateOrderRequestDTO();
        orderReq.setQuotationId("CQ-REJECTED-001");
        orderReq.setCustomerName("Budget Corp");
        orderReq.setCustomerEmail("budget@corp.com");
        orderReq.setDeliveryAddress("Cyber Hub, Gurgaon");

        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(orderReq));
        assertTrue(ex.getMessage().contains("rejected corporate quotation"));
    }

    @Test
    @DisplayName("Reject order when stock is insufficient and verify no stock is deducted")
    void testCreateOrder_Fails_InsufficientStock() {
        Product butter = productRepository.findById("prod_butter_rose").orElseThrow();
        int initialStock = butter.getStockQuantity();

        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Pooja Mehta",
                "pooja@example.com",
                "12 Viman Nagar, Pune",
                "Classic",
                "Presentation Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_butter_rose", initialStock + 50))
        );

        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(request));
        assertTrue(ex.getMessage().contains("Insufficient stock"));

        // Verify stock is preserved
        Product unchangedButter = productRepository.findById("prod_butter_rose").orElseThrow();
        assertEquals(initialStock, unchangedButter.getStockQuantity());
    }

    @Test
    @DisplayName("Reject order when product contains declared allergen matching customer restriction")
    void testCreateOrder_Fails_AllergenViolation() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Rohan Kulkarni",
                "rohan@example.com",
                "Baner, Pune",
                "Classic",
                "Presentation Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_butter_rose", 1))
        );
        // prod_butter_rose contains declared sweet almond oil / tree nuts
        request.setAllergies(Collections.singletonList("tree nuts"));

        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(request));
        assertTrue(ex.getMessage().contains("Allergy Safety Violation"));
        assertTrue(ex.getMessage().contains("tree nuts"));
    }

    @Test
    @DisplayName("Reject order with unverified ingredients when customer has active allergy restrictions")
    void testCreateOrder_Fails_ConservativeUnverifiedIngredientSafety() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Suresh Nair",
                "suresh@example.com",
                "Aundh, Pune",
                "Classic",
                "Presentation Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_unverified_bath_dust", 1))
        );
        request.setAllergies(Collections.singletonList("fragrance"));

        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(request));
        assertTrue(ex.getMessage().contains("Conservative Safety Policy"));
    }

    @Test
    @DisplayName("Reject order when total order amount exceeds specified customer budget")
    void testCreateOrder_Fails_BudgetExceeded() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Amit Patel",
                "amit@example.com",
                "FC Road, Pune",
                "Classic",
                "Presentation Box",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_body_oil_citrus", 2), // 680 * 2 = 1360
                        new OrderItemRequestDTO("prod_butter_rose", 1)      // 540
                )
        );
        request.setPackagingRetailPrice(new BigDecimal("150.00")); // Total = 1360 + 540 + 150 = 2050
        request.setCustomerBudget(new BigDecimal("1500.00"));

        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(request));
        assertTrue(ex.getMessage().contains("Budget Exceeded"));
    }

    @Test
    @DisplayName("Packing slip guarantees deterministic sequential sequence numbers (1, 2, 3...)")
    void testGeneratePackingSlip_SequentialSequenceNumbers() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Kavita Verma",
                "kavita@example.com",
                "Kalyani Nagar, Pune",
                "Deluxe",
                "Handcrafted Pine Wood Keepsake Chest",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_soap_lavender", 1),
                        new OrderItemRequestDTO("prod_body_oil_citrus", 1),
                        new OrderItemRequestDTO("prod_tool_jade_roller", 1)
                )
        );

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        assertEquals(3, slip.getItems().size());
        assertEquals(1, slip.getItems().get(0).getSequenceNumber());
        assertEquals(2, slip.getItems().get(1).getSequenceNumber());
        assertEquals(3, slip.getItems().get(2).getSequenceNumber());
    }

    @Test
    @DisplayName("Packing slip verifies 2D dimensions and volume fit when all physical dimensions are present")
    void testGeneratePackingSlip_VerifiedDimensionsAndVolumeFit() {
        // Lavender soap (8x6x3 cm, 144 cm3) and Wild Bergamot Oil (5x5x14 cm, 350 cm3) in Deluxe box (32x25x12 cm, 9600 cm3)
        // Wait: Wild Bergamot oil height is 14cm. In Deluxe box height is 12cm.
        // Let's test in Grand box (40x30x15 cm, 18000 cm3) so it fits in all 3 dimensions!
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Vikram Singhania",
                "vikram@example.com",
                "Boat Club Road, Pune",
                "Grand",
                "Grand Keepsake Trunk",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_soap_lavender", 2),
                        new OrderItemRequestDTO("prod_body_oil_citrus", 1)
                )
        );

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        DimensionFitValidationDTO fit = slip.getBoxDetails().getDimensionFitValidation();
        assertNotNull(fit);
        assertEquals("DIMENSION_FIT_VERIFIED", fit.getStatus());
        assertTrue(fit.isFitVerified());
        assertNotNull(fit.getTotalItemsVolumeCm3());
        assertNotNull(fit.getBoxVolumeCapacityCm3());
        assertTrue(fit.getVolumeUtilizationPercentage().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(fit.getValidationMessage().contains("Physical fit verified"));
    }

    @Test
    @DisplayName("Packing slip returns explicit NOT_VALIDATED_MISSING_DIMENSIONS status when item dimensions are missing")
    void testGeneratePackingSlip_MissingDimensions_ReturnsExplicitUnknownStatus() {
        // prod_lip_cardamom has no recorded physical dimensions in demo catalogue
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Sunita Deshmukh",
                "sunita@example.com",
                "Prabhat Road, Pune",
                "Classic",
                "Presentation Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_lip_cardamom", 1))
        );

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        DimensionFitValidationDTO fit = slip.getBoxDetails().getDimensionFitValidation();
        assertNotNull(fit);
        assertEquals("NOT_VALIDATED_MISSING_DIMENSIONS", fit.getStatus());
        assertFalse(fit.isFitVerified());
        assertFalse(fit.getMissingDimensionItems().isEmpty());
        assertTrue(fit.getValidationMessage().contains("Physical fit cannot be verified"));
    }

    @Test
    @DisplayName("Packing slip detects exceeded dimension or volume capacity")
    void testGeneratePackingSlip_ExceededDimensionsOrCapacity() {
        // Order with an oversized item in Petite box (20x15x8 cm)
        // Jade roller length is 15cm, height is 3cm, width 6cm -> fits 20x15x8.
        // But Wild Bergamot oil height is 14cm -> exceeds Petite box height of 8cm!
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Oversized Customer",
                "oversized@example.com",
                "Camp, Pune",
                "Petite",
                "Petite Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_body_oil_citrus", 1))
        );

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        DimensionFitValidationDTO fit = slip.getBoxDetails().getDimensionFitValidation();
        assertNotNull(fit);
        assertEquals("DIMENSION_FIT_EXCEEDED", fit.getStatus());
        assertFalse(fit.isFitVerified());
        assertFalse(fit.getFitConstraintViolations().isEmpty());
    }

    @Test
    @DisplayName("Packing slip contains grounded instructions and recorded allergen warnings")
    void testGeneratePackingSlip_GroundedPackingInstructionsAndAllergenWarnings() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Meera Joshi",
                "meera@example.com",
                "Model Colony, Pune",
                "Classic",
                "Presentation Box",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_soap_lavender", 1),
                        new OrderItemRequestDTO("prod_body_oil_citrus", 1)
                )
        );

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        PackingSlipItemDTO soapItem = slip.getItems().get(0);
        assertTrue(soapItem.getPackingInstructions().contains("paper wrap"));

        PackingSlipItemDTO oilItem = slip.getItems().get(1);
        assertTrue(oilItem.getPackingInstructions().contains("glass"));
        assertTrue(oilItem.getPackingInstructions().contains("Fragile"));

        // Allergen summary and cross contamination
        assertNotNull(slip.getAllergenSummary());
        assertEquals("VERIFIED_SAFE", slip.getAllergenSummary().getSafetyAuditStatus());
    }

    @Test
    @DisplayName("Packing slip provides complete cost breakdown when unit costs are available")
    void testGeneratePackingSlip_CostBreakdown() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Nitin Gadre",
                "nitin@example.com",
                "Salunke Vihar, Pune",
                "Classic",
                "Pine Wood Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_soap_lavender", 2))
        );
        request.setPackagingRetailPrice(new BigDecimal("150.00"));
        request.setPackagingCost(new BigDecimal("60.00"));

        OrderResponseDTO order = orderService.createOrder(request);
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(order.getId());

        PackingSlipCostBreakdownDTO cost = slip.getCostBreakdown();
        assertNotNull(cost);
        assertTrue(cost.isCostBreakdownAvailable());
        assertEquals(new BigDecimal("640.00"), cost.getTotalProductRetail()); // 320 * 2
        assertEquals(new BigDecimal("150.00"), cost.getPackagingRetailPrice());
        assertEquals(new BigDecimal("790.00"), cost.getTotalOrderRetail());
        assertEquals(new BigDecimal("240.00"), cost.getTotalProductCost());  // 120 * 2
        assertEquals(new BigDecimal("60.00"), cost.getPackagingCost());
        assertEquals(new BigDecimal("300.00"), cost.getTotalCost());
    }
}
