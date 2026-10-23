package com.surrealtreasures.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.CorporateQuotation;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.repository.CorporateQuotationRepository;
import com.surrealtreasures.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CorporateQuotationServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private HamperRecommendationService recommendationService;

    @Mock
    private CorporateQuotationRepository quotationRepository;

    private ObjectMapper objectMapper;
    private CorporateQuotationService quotationService;

    private Product saffronOil;
    private Product roseCreme;
    private Product lavSoap;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        quotationService = new CorporateQuotationService(
                productRepository,
                recommendationService,
                quotationRepository,
                objectMapper
        );

        saffronOil = new Product(
                "prod_saffron",
                "Kashmiri Saffron Nectar",
                "Pure saffron face oil",
                "Face Care",
                new BigDecimal("899.00"),
                new BigDecimal("350.00"), // Real recorded unit cost
                new BigDecimal("20.00"),
                100, // In stock
                new HashSet<>(Arrays.asList("All", "Dry")),
                Arrays.asList("saffron", "sweet almond oil", "jojoba oil"),
                Arrays.asList("sweet almond"),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.of(2026, 6, 1),
                "Glass dropper bottle",
                null,
                true,
                true,
                "https://example.com/saffron.jpg"
        );

        roseCreme = new Product(
                "prod_rose",
                "Damask Rose Night Crème",
                "Rose night cream",
                "Face Care",
                new BigDecimal("749.00"),
                new BigDecimal("280.00"),
                new BigDecimal("15.00"),
                50,
                new HashSet<>(Arrays.asList("All", "Normal")),
                Arrays.asList("damask rose water", "shea butter"),
                Collections.emptyList(),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.of(2026, 6, 1),
                "Amber glass jar",
                null,
                true,
                true,
                "https://example.com/rose.jpg"
        );

        lavSoap = new Product(
                "prod_soap",
                "Lavender Cold Process Soap",
                "Gentle artisan soap",
                "Artisan Soaps",
                new BigDecimal("320.00"),
                new BigDecimal("110.00"),
                new BigDecimal("10.00"),
                200,
                new HashSet<>(Arrays.asList("All")),
                Arrays.asList("saponified olive oil", "lavender oil"),
                Arrays.asList("lavender"),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.of(2026, 6, 1),
                "Banana fiber wrap",
                null,
                true,
                true,
                "https://example.com/soap.jpg"
        );
    }

    @Test
    @DisplayName("Support smaller adjustable batches and scale totals linearly")
    void testSmallAndAdjustableBatchQuantities() {
        when(productRepository.findById("prod_saffron")).thenReturn(Optional.of(saffronOil));
        when(productRepository.findById("prod_soap")).thenReturn(Optional.of(lavSoap));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req5 = new CorporateQuotationRequestDTO();
        req5.setCompanyName("TechVentures India");
        req5.setQuantity(5); // Small batch
        req5.setBudgetPerHamper(new BigDecimal("2000.00"));
        req5.setPackagingPrice(new BigDecimal("150.00"));
        req5.setPackagingCost(new BigDecimal("60.00"));
        req5.setItems(Arrays.asList(
                new CorporateQuoteItemRequestDTO("prod_saffron", 1),
                new CorporateQuoteItemRequestDTO("prod_soap", 1)
        ));

        CorporateQuotationResponseDTO resp5 = quotationService.generateQuotation(req5);

        assertNotNull(resp5);
        assertEquals("CONFIRMED", resp5.getStatus());
        assertTrue(resp5.getFulfillable());
        assertEquals(5, resp5.getRequestedQuantity());

        // Selling price per hamper = 899 + 320 + 150 = 1369.00
        BigDecimal expectedPricePerHamper = new BigDecimal("1369.00");
        assertEquals(expectedPricePerHamper, resp5.getPricingBreakdown().getSellingPricePerHamper());
        // Cost per hamper = 350 + 110 + 60 = 520.00
        BigDecimal expectedCostPerHamper = new BigDecimal("520.00");
        assertEquals(expectedCostPerHamper, resp5.getPricingBreakdown().getEstimatedCostPerHamper());
        // Gross profit per hamper = 1369 - 520 = 849.00
        assertEquals(new BigDecimal("849.00"), resp5.getPricingBreakdown().getEstimatedGrossProfitPerHamper());

        // Batch 5 totals
        assertEquals(new BigDecimal("6845.00"), resp5.getPricingBreakdown().getTotalQuote()); // 1369 * 5
        assertEquals(new BigDecimal("2600.00"), resp5.getPricingBreakdown().getEstimatedTotalCost()); // 520 * 5
        assertEquals(new BigDecimal("4245.00"), resp5.getPricingBreakdown().getEstimatedTotalGrossProfit()); // 849 * 5

        // Margin % = (1369 - 520) / 1369 * 100 = 849 / 1369 * 100 = 62.016... -> 62.02%
        assertEquals(new BigDecimal("62.02"), resp5.getPricingBreakdown().getEstimatedGrossMarginPercentage());

        // Verify quote persisted
        verify(quotationRepository, times(1)).save(any(CorporateQuotation.class));
    }

    @Test
    @DisplayName("Validate positive quantity and reject requests outside operational limits")
    void testQuantityValidationOperationalLimits() {
        CorporateQuotationRequestDTO reqZero = new CorporateQuotationRequestDTO("Acme Corp", 0, new BigDecimal("1500.00"));
        ApiException exZero = assertThrows(ApiException.class, () -> quotationService.generateQuotation(reqZero));
        assertEquals(HttpStatus.BAD_REQUEST, exZero.getStatus());
        assertTrue(exZero.getMessage().contains("outside configured operational limits"));

        CorporateQuotationRequestDTO reqNeg = new CorporateQuotationRequestDTO("Acme Corp", -10, new BigDecimal("1500.00"));
        ApiException exNeg = assertThrows(ApiException.class, () -> quotationService.generateQuotation(reqNeg));
        assertEquals(HttpStatus.BAD_REQUEST, exNeg.getStatus());

        CorporateQuotationRequestDTO reqTooLarge = new CorporateQuotationRequestDTO("Acme Corp", 10000, new BigDecimal("1500.00"));
        ApiException exTooLarge = assertThrows(ApiException.class, () -> quotationService.generateQuotation(reqTooLarge));
        assertEquals(HttpStatus.BAD_REQUEST, exTooLarge.getStatus());
    }

    @Test
    @DisplayName("Bulk stock constraints: Reject quote if bulk required stock exceeds available inventory")
    void testBulkStockConstraintRejection() {
        // saffronOil stock is 100
        when(productRepository.findById("prod_saffron")).thenReturn(Optional.of(saffronOil));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO bulkReq = new CorporateQuotationRequestDTO();
        bulkReq.setCompanyName("Global MegaCorp");
        bulkReq.setQuantity(150); // Needs 150 units, but only 100 available!
        bulkReq.setBudgetPerHamper(new BigDecimal("2500.00"));
        bulkReq.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_saffron", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(bulkReq);

        assertNotNull(resp);
        assertEquals("REJECTED_INSUFFICIENT_STOCK", resp.getStatus());
        assertFalse(resp.getFulfillable());
        assertFalse(resp.getItems().get(0).getStockSufficient());
        assertEquals(100, resp.getItems().get(0).getAvailableStock());
        assertEquals(150, resp.getItems().get(0).getTotalQuantityRequired());

        // Warning message details deficit
        assertTrue(resp.getWarnings().stream().anyMatch(w -> w.contains("deficit: 50")));
    }

    @Test
    @DisplayName("Missing costs: Return INCOMPLETE_ESTIMATE and explain what needs to be supplied")
    void testMissingCostsIncompleteEstimate() {
        Product uncostedProduct = new Product(
                "prod_uncosted",
                "Artisan Lavender Candle",
                "Hand-poured candle",
                "Accessories",
                new BigDecimal("499.00"),
                null, // UNIT COST IS MISSING!
                BigDecimal.ZERO,
                200,
                new HashSet<>(Collections.singletonList("All")),
                Collections.emptyList(),
                Collections.emptyList(),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.now(),
                "Glass vessel",
                null,
                true,
                true,
                null
        );

        when(productRepository.findById("prod_uncosted")).thenReturn(Optional.of(uncostedProduct));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Incomplete Cost Partner");
        req.setQuantity(20);
        req.setBudgetPerHamper(new BigDecimal("1000.00"));
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_uncosted", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(req);

        assertEquals("INCOMPLETE_ESTIMATE", resp.getStatus());
        assertFalse(resp.getPricingBreakdown().getCostsComplete());
        assertNull(resp.getPricingBreakdown().getEstimatedGrossMarginPercentage());
        assertFalse(resp.getMissingCosts().isEmpty());
        assertTrue(resp.getMissingCosts().get(0).contains("Artisan Lavender Candle"));
        assertTrue(resp.getStatusMessage().contains("Profit margin cannot be estimated"));
    }

    @Test
    @DisplayName("Zero selling price safety: Ensure divide-by-zero is handled safely and returns 0.00%")
    void testZeroSellingPriceSafety() {
        Product freeSample = new Product(
                "prod_free",
                "Complimentary Botanical Tester",
                "Free sample",
                "Samples",
                BigDecimal.ZERO, // Zero selling price
                new BigDecimal("15.00"), // Has unit cost
                BigDecimal.ZERO,
                500,
                new HashSet<>(Collections.singletonList("All")),
                Collections.emptyList(),
                Collections.emptyList(),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.now(),
                null,
                null,
                true,
                true,
                null
        );

        when(productRepository.findById("prod_free")).thenReturn(Optional.of(freeSample));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Sample Promotion Inc");
        req.setQuantity(10);
        req.setBudgetPerHamper(new BigDecimal("100.00"));
        req.setPackagingPrice(BigDecimal.ZERO); // Zero packaging charge
        req.setPackagingCost(BigDecimal.ZERO);
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_free", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(req);

        assertNotNull(resp);
        assertEquals(BigDecimal.ZERO.setScale(2), resp.getPricingBreakdown().getSellingPricePerHamper());
        // Margin must safely be 0.00% without exception
        assertEquals(new BigDecimal("0.00"), resp.getPricingBreakdown().getEstimatedGrossMarginPercentage());
    }

    @Test
    @DisplayName("Margin calculation and explicit RoundingMode.HALF_UP precision")
    void testMarginCalculationAndExplicitRounding() {
        // Selling price = 300.00, Cost = 200.00
        // Gross margin = (300 - 200) / 300 * 100 = 100 / 300 * 100 = 33.33333... -> 33.33%
        Product testProd = new Product(
                "prod_round",
                "Soap Rounding Test",
                "Test soap",
                "Soaps",
                new BigDecimal("150.00"),
                new BigDecimal("140.00"),
                BigDecimal.ZERO,
                100,
                new HashSet<>(Collections.singletonList("All")),
                Collections.emptyList(),
                Collections.emptyList(),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.now(),
                null,
                null,
                true,
                true,
                null
        );

        when(productRepository.findById("prod_round")).thenReturn(Optional.of(testProd));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Precision Finance Ltd");
        req.setQuantity(10);
        req.setBudgetPerHamper(new BigDecimal("500.00"));
        req.setPackagingPrice(new BigDecimal("150.00")); // Total selling price = 150 + 150 = 300.00
        req.setPackagingCost(new BigDecimal("60.00"));   // Total cost = 140 + 60 = 200.00
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_round", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(req);

        assertEquals(new BigDecimal("300.00"), resp.getPricingBreakdown().getSellingPricePerHamper());
        assertEquals(new BigDecimal("200.00"), resp.getPricingBreakdown().getEstimatedCostPerHamper());
        assertEquals(new BigDecimal("100.00"), resp.getPricingBreakdown().getEstimatedGrossProfitPerHamper());
        // Explicit RoundingMode.HALF_UP 33.33%
        assertEquals(new BigDecimal("33.33"), resp.getPricingBreakdown().getEstimatedGrossMarginPercentage());
    }

    @Test
    @DisplayName("Budget violation: Reject quote when selling price exceeds customer budget")
    void testBudgetViolationsRejection() {
        when(productRepository.findById("prod_saffron")).thenReturn(Optional.of(saffronOil));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Budget Constrained Org");
        req.setQuantity(10);
        // Selling price will be 899 + 150 = 1049.00
        req.setBudgetPerHamper(new BigDecimal("800.00")); // Budget is only 800.00!
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_saffron", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(req);

        assertEquals("REJECTED_BUDGET_EXCEEDED", resp.getStatus());
        assertFalse(resp.getFulfillable());
        assertFalse(resp.getBudgetEvaluation().getWithinBudget());
        assertTrue(resp.getWarnings().stream().anyMatch(w -> w.contains("Budget Exceeded")));
    }

    @Test
    @DisplayName("Allergy constraint: Reject quote when product conflicts with customer restrictions")
    void testAllergyRestrictionViolation() {
        when(productRepository.findById("prod_saffron")).thenReturn(Optional.of(saffronOil));

        // Mock recommendationService returning allergy conflict
        ProductExclusionDTO allergyEx = new ProductExclusionDTO(
                "prod_saffron",
                "Kashmiri Saffron Nectar",
                "ALLERGEN_CONFLICT",
                "Product contains declared allergen: sweet almond"
        );
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.of(allergyEx));

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Allergy Conscious Corp");
        req.setQuantity(20);
        req.setBudgetPerHamper(new BigDecimal("2000.00"));
        req.setAllergies(Collections.singletonList("nut"));
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_saffron", 1)));

        CorporateQuotationResponseDTO resp = quotationService.generateQuotation(req);

        assertEquals("REJECTED_ALLERGEN_RESTRICTION", resp.getStatus());
        assertFalse(resp.getFulfillable());
        assertTrue(resp.getWarnings().stream().anyMatch(w -> w.contains("Allergy Safety Violation")));
    }

    @Test
    @DisplayName("Snapshot persistence: Future catalogue price updates do not change historic quote")
    void testSnapshotPersistenceAndRetrieval() {
        when(productRepository.findById("prod_saffron")).thenReturn(Optional.of(saffronOil));
        when(recommendationService.evaluateEligibility(any(), any(), any())).thenReturn(Optional.empty());

        CorporateQuotationRequestDTO req = new CorporateQuotationRequestDTO();
        req.setCompanyName("Snapshot Verify Ltd");
        req.setQuantity(10);
        req.setBudgetPerHamper(new BigDecimal("2000.00"));
        req.setItems(Collections.singletonList(new CorporateQuoteItemRequestDTO("prod_saffron", 1)));

        CorporateQuotationResponseDTO issuedQuote = quotationService.generateQuotation(req);
        String quoteId = issuedQuote.getQuoteId();

        // Simulate database holding this snapshot
        CorporateQuotation savedEntity = new CorporateQuotation();
        savedEntity.setId(quoteId);
        try {
            savedEntity.setSnapshotJson(objectMapper.writeValueAsString(issuedQuote));
        } catch (Exception e) {
            fail(e);
        }

        when(quotationRepository.findById(quoteId)).thenReturn(Optional.of(savedEntity));

        // Now imagine master catalogue product price increases from 899 to 1499
        saffronOil.setRetailPrice(new BigDecimal("1499.00"));

        // Retrieve quote from persistence
        CorporateQuotationResponseDTO retrievedQuote = quotationService.getQuotationById(quoteId);

        // Verify the retrieved quote maintains the exact original price 899.00, NOT 1499.00!
        assertEquals(new BigDecimal("899.00"), retrievedQuote.getItems().get(0).getUnitRetailPrice());
        assertEquals(issuedQuote.getPricingBreakdown().getTotalQuote(), retrievedQuote.getPricingBreakdown().getTotalQuote());
    }
}
