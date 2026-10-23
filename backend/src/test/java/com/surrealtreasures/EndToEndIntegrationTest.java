package com.surrealtreasures;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.repository.OrderRepository;
import com.surrealtreasures.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * STEP 5: End-to-End Integration Verification Suite.
 * Runs against an isolated in-memory PostgreSQL-compatible H2 database.
 * Exercises the entire pipeline: Catalogue -> Recommendation -> Corporate Quote -> Order -> Packing Slip.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class EndToEndIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("E2E Step 1: Product Catalog & Transparency API returns verified facts vs unverified disclosures")
    void testE2E_ProductTransparencyFlow() throws Exception {
        // 1. Fetch catalogue
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(10))))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].retailPrice").exists());

        // 2. Fetch verified product transparency
        mockMvc.perform(get("/api/products/prod_soap_lavender/transparency"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("prod_soap_lavender"))
                .andExpect(jsonPath("$.ingredientVerificationStatus").value("VERIFIED"))
                .andExpect(jsonPath("$.verifiedFields", hasItem("ingredients")))
                .andExpect(jsonPath("$.packagingInfo").value("Biodegradable banana fiber paper wrap with cotton twine"));

        // 3. Fetch unverified product transparency: explicitly marks unverified data
        mockMvc.perform(get("/api/products/prod_unverified_bath_dust/transparency"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("prod_unverified_bath_dust"))
                .andExpect(jsonPath("$.ingredientVerificationStatus").value("UNVERIFIED"))
                .andExpect(jsonPath("$.unverifiedOrUnknownFields", hasItem("ingredients")))
                .andExpect(jsonPath("$.allergenSafetyStatement", containsString("cannot be guaranteed allergen-safe")));
    }

    @Test
    @DisplayName("E2E Step 2: Hamper Recommendation generates tiers within budget cap and excludes allergens")
    void testE2E_RecommendationFlow() throws Exception {
        CustomerRequirementsDTO req = new CustomerRequirementsDTO();
        req.setMaxBudget(new BigDecimal("2500.00"));
        req.setOccasion("Anniversary");
        req.setSkinType("Sensitive");
        req.setAllergies(Collections.singletonList("tree nuts")); // prod_butter_rose and prod_scrub_walnut must be excluded

        MvcResult result = mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.maxBudget").value(2500.00))
                .andExpect(jsonPath("$.tiers.HIGH").exists())
                .andExpect(jsonPath("$.tiers.MEDIUM").exists())
                .andExpect(jsonPath("$.tiers.LOW").exists())
                .andReturn();

        HamperRecommendationResponse response = objectMapper.readValue(result.getResponse().getContentAsString(), HamperRecommendationResponse.class);

        // Budget assertion across all tiers
        response.getTiers().forEach((tierKey, tier) -> {
            assertTrue(tier.getFinalTotal().compareTo(new BigDecimal("2500.00")) <= 0,
                    String.format("Tier %s final total ₹%s must not exceed budget cap ₹2500.00", tierKey, tier.getFinalTotal()));
            tier.getProducts().forEach(p -> {
                assertNotEquals("prod_butter_rose", p.getId(), "Tree nut butter must be excluded");
                assertNotEquals("prod_scrub_walnut", p.getId(), "Tree nut scrub must be excluded");
            });
        });
    }

    @Test
    @DisplayName("E2E Step 3: Corporate Quotation generates accurate margins from recorded costs and persists immutable snapshot")
    void testE2E_CorporateQuotationFlow() throws Exception {
        CorporateQuotationRequestDTO quoteReq = new CorporateQuotationRequestDTO();
        quoteReq.setCompanyName("Zenith Technologies Pune");
        quoteReq.setQuantity(20);
        quoteReq.setOccasion("Diwali Corporate Gala");
        quoteReq.setBudgetPerHamper(new BigDecimal("2000.00"));
        quoteReq.setPackagingOptionName("Handcrafted Pine Wood Keepsake Chest");
        quoteReq.setPackagingPrice(new BigDecimal("150.00"));
        quoteReq.setPackagingCost(new BigDecimal("60.00"));
        quoteReq.setItems(Arrays.asList(
                new CorporateQuoteItemRequestDTO("prod_soap_lavender", 1),
                new CorporateQuoteItemRequestDTO("prod_body_oil_citrus", 1)
        ));

        MvcResult result = mockMvc.perform(post("/api/corporate/quotes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(quoteReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.fulfillable").value(true))
                .andExpect(jsonPath("$.pricingBreakdown.costsComplete").value(true))
                .andExpect(jsonPath("$.budgetEvaluation.withinBudget").value(true))
                .andReturn();

        CorporateQuotationResponseDTO quote = objectMapper.readValue(result.getResponse().getContentAsString(), CorporateQuotationResponseDTO.class);
        assertNotNull(quote.getQuoteId());

        // Arithmetic verification: Lavender soap retail 320 + oil 680 + pkg 150 = 1150
        assertEquals(new BigDecimal("1150.00"), quote.getPricingBreakdown().getSellingPricePerHamper());
        // Lavender cost 120 + oil cost 260 + pkg cost 60 = 440
        assertEquals(new BigDecimal("440.00"), quote.getPricingBreakdown().getEstimatedCostPerHamper());
        // Gross profit = 1150 - 440 = 710
        assertEquals(new BigDecimal("710.00"), quote.getPricingBreakdown().getEstimatedGrossProfitPerHamper());
        // Total quote = 1150 * 20 = 23000
        assertEquals(new BigDecimal("23000.00"), quote.getPricingBreakdown().getTotalQuote());

        // Verify snapshot retrieval
        mockMvc.perform(get("/api/corporate/quotes/" + quote.getQuoteId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quoteId").value(quote.getQuoteId()))
                .andExpect(jsonPath("$.companyName").value("Zenith Technologies Pune"));
    }

    @Test
    @DisplayName("E2E Step 4: Full Order to Warehouse Packing Slip export with inventory deduction and 2D fit check")
    void testE2E_OrderToPackingSlipFlow() throws Exception {
        Product soap = productRepository.findById("prod_soap_lavender").orElseThrow();
        int initialStock = soap.getStockQuantity();

        CreateOrderRequestDTO orderReq = new CreateOrderRequestDTO(
                "Nandita Roy",
                "nandita.roy@example.com",
                "Penthouse 7, Koregaon Park Annexe, Pune",
                "Grand",
                "Handcrafted Pine Wood Keepsake Trunk",
                Arrays.asList(
                        new OrderItemRequestDTO("prod_soap_lavender", 2),
                        new OrderItemRequestDTO("prod_body_oil_citrus", 1)
                )
        );
        orderReq.setFulfilmentNotes("Laser engraved lid: 'Nandita & Kabir'. Enclose calligraphy deckled card.");

        // 1. Create order
        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("WAREHOUSE_READY"))
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andReturn();

        OrderResponseDTO createdOrder = objectMapper.readValue(orderResult.getResponse().getContentAsString(), OrderResponseDTO.class);
        String orderId = createdOrder.getId();

        // 2. Verify inventory was decremented accurately
        Product updatedSoap = productRepository.findById("prod_soap_lavender").orElseThrow();
        assertEquals(initialStock - 2, updatedSoap.getStockQuantity());

        // 3. Fetch packing slip
        mockMvc.perform(get("/api/orders/" + orderId + "/packing-slip"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(orderId))
                .andExpect(jsonPath("$.orderStatus").value("WAREHOUSE_READY"))
                .andExpect(jsonPath("$.boxDetails.selectedBoxSize").value("Grand"))
                .andExpect(jsonPath("$.boxDetails.dimensionFitValidation.fitVerified").value(true))
                .andExpect(jsonPath("$.items[0].sequenceNumber").value(1))
                .andExpect(jsonPath("$.items[0].packingInstructions", containsString("paper wrap")))
                .andExpect(jsonPath("$.items[1].sequenceNumber").value(2))
                .andExpect(jsonPath("$.items[1].packingInstructions", containsString("glass")))
                .andExpect(jsonPath("$.allergenSummary.safetyAuditStatus").value("VERIFIED_SAFE"))
                .andExpect(jsonPath("$.costBreakdown.costBreakdownAvailable").value(true))
                .andExpect(jsonPath("$.fulfilmentNotes", containsString("Nandita & Kabir")));
    }

    @Test
    @DisplayName("E2E Negative API Tests: Malformed requests, missing fields, negative values, and unknown product IDs")
    void testE2E_NegativeApiValidationTests() throws Exception {
        // A. Missing required customerName & deliveryAddress on order
        CreateOrderRequestDTO missingFields = new CreateOrderRequestDTO();
        missingFields.setCustomerEmail("valid@example.com");
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingFields)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.customerName").exists())
                .andExpect(jsonPath("$.errors.deliveryAddress").exists());

        // B. Negative quantity in order item
        CreateOrderRequestDTO negativeQty = new CreateOrderRequestDTO(
                "Test User", "test@example.com", "Address", "Classic", "Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_soap_lavender", -5))
        );
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(negativeQty)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors['items[0].quantity']").exists());

        // C. Unknown product ID in order
        CreateOrderRequestDTO unknownProd = new CreateOrderRequestDTO(
                "Test User", "test@example.com", "Address", "Classic", "Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_non_existent_999", 1))
        );
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unknownProd)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Product not found")));

        // D. Out of stock product rejection
        CreateOrderRequestDTO oosOrder = new CreateOrderRequestDTO(
                "Test User", "test@example.com", "Address", "Classic", "Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_out_of_stock_elixir", 1))
        );
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(oosOrder)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Insufficient stock")));

        // E. Recommendation missing / negative budget
        CustomerRequirementsDTO invalidBudgetReq = new CustomerRequirementsDTO();
        invalidBudgetReq.setMaxBudget(new BigDecimal("-100.00"));
        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidBudgetReq)))
                .andExpect(status().isBadRequest());
    }
}
