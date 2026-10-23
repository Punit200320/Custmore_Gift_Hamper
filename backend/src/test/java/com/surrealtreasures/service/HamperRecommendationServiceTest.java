package com.surrealtreasures.service;

import com.surrealtreasures.dto.*;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HamperRecommendationServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private HamperRecommendationService recommendationService;

    private List<Product> testCatalog;

    @BeforeEach
    void setUp() {
        testCatalog = Arrays.asList(
                // 1. Safe verified artisan soap
                new Product("p1", "Lavender Soap", "Calming artisan soap", "Artisan Soaps",
                        new BigDecimal("300.00"), new BigDecimal("100.00"), BigDecimal.ZERO,
                        50, new HashSet<>(Arrays.asList("All", "Sensitive")),
                        Arrays.asList("olive oil", "lavender oil"),
                        Arrays.asList("lavender"),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 2. Nut allergen verified butter
                new Product("p2", "Almond Rose Soufflé", "Rich body cream", "Handmade Skincare",
                        new BigDecimal("500.00"), new BigDecimal("180.00"), BigDecimal.ZERO,
                        20, new HashSet<>(Arrays.asList("Dry", "Sensitive")),
                        Arrays.asList("sweet almond oil", "shea butter", "rose extract"),
                        Arrays.asList("almond", "tree nuts"),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 3. Oily skin scrub with walnut
                new Product("p3", "Walnut Scrub", "Astringent polish", "Handmade Skincare",
                        new BigDecimal("400.00"), new BigDecimal("150.00"), BigDecimal.ZERO,
                        30, new HashSet<>(Arrays.asList("Oily")),
                        Arrays.asList("walnut shell", "tea tree oil"),
                        Arrays.asList("walnut", "tree nuts"),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 4. Safe verified lip butter
                new Product("p4", "Cardamom Lip Butter", "Gentle lip balm", "Handmade Skincare",
                        new BigDecimal("200.00"), new BigDecimal("70.00"), BigDecimal.ZERO,
                        40, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("shea butter", "cardamom oil"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 5. Safe verified jade roller
                new Product("p5", "Jade Facial Roller", "Cooling stone roller", "Facial Tools",
                        new BigDecimal("450.00"), new BigDecimal("150.00"), BigDecimal.ZERO,
                        15, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("nephrite jade"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.VERIFIED, true, false, null),

                // 6. Safe verified soy candle
                new Product("p6", "Vanilla Candle", "Hand-poured soy candle", "Personalised Gifts",
                        new BigDecimal("350.00"), new BigDecimal("120.00"), BigDecimal.ZERO,
                        30, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("soy wax", "vanilla oil"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 7. Luxury saffron elixir (high value)
                new Product("p7", "Kumkumadi Night Elixir", "Precious night oil", "Handmade Skincare",
                        new BigDecimal("900.00"), new BigDecimal("350.00"), BigDecimal.ZERO,
                        10, new HashSet<>(Arrays.asList("All", "Dry")),
                        Arrays.asList("saffron", "sandalwood oil", "sesame seed oil"),
                        Arrays.asList("sesame"),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 8. Out of stock item
                new Product("p8", "Beard Elixir OOS", "Out of stock item", "Bath and Body",
                        new BigDecimal("600.00"), new BigDecimal("200.00"), BigDecimal.ZERO,
                        0, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("argan oil"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.VERIFIED, true, true, null),

                // 9. Inactive item
                new Product("p9", "Discontinued Balm", "Inactive item", "Handmade Skincare",
                        new BigDecimal("250.00"), new BigDecimal("80.00"), BigDecimal.ZERO,
                        25, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("beeswax"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.VERIFIED, false, true, null),

                // 10. UNVERIFIED ingredient item
                new Product("p10", "Unverified Herbal Dust", "Formula pending lab check", "Bath and Body",
                        new BigDecimal("280.00"), new BigDecimal("90.00"), BigDecimal.ZERO,
                        30, new HashSet<>(Arrays.asList("All")),
                        Arrays.asList("botanical salt"),
                        Collections.emptyList(),
                        IngredientVerificationStatus.UNVERIFIED, true, true, null)
        );
    }

    @Test
    @DisplayName("1. Budget Cap: Final hamper total including packaging must NEVER exceed maxBudget")
    void testBudgetCapStrictlyRespected() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("1200.00"));
        request.setPackagingCost(new BigDecimal("150.00"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        assertFalse(response.getTiers().isEmpty());

        for (Map.Entry<String, HamperTierDTO> entry : response.getTiers().entrySet()) {
            HamperTierDTO tier = entry.getValue();
            assertTrue(tier.getFinalTotal().compareTo(request.getMaxBudget()) <= 0,
                    String.format("Tier %s total ₹%s exceeded max budget ₹%s",
                            entry.getKey(), tier.getFinalTotal(), request.getMaxBudget()));
            assertTrue(tier.getRemainingBudget().compareTo(BigDecimal.ZERO) >= 0);
            assertEquals(tier.getProductSubtotal().add(tier.getPackagingCost()), tier.getFinalTotal());
        }
    }

    @Test
    @DisplayName("2. Allergen Exclusion: Products containing declared allergens or ingredient conflicts are strictly excluded")
    void testAllergenExclusionDeclared() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2000.00"));
        request.setAllergies(Collections.singletonList("almond"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);

        // Verify Almond Rose Soufflé (p2) is excluded
        boolean p2Excluded = response.getExclusions().stream()
                .anyMatch(ex -> ex.getProductId().equals("p2") && ex.getExclusionCategory().equals("ALLERGEN_CONFLICT"));
        assertTrue(p2Excluded, "Product with almond must be excluded with ALLERGEN_CONFLICT reason");

        // Verify none of the recommended tiers contains p2
        for (HamperTierDTO tier : response.getTiers().values()) {
            boolean hasP2 = tier.getProducts().stream().anyMatch(p -> p.getId().equals("p2"));
            assertFalse(hasP2, "Recommended tier must not contain allergen-conflicting product p2");
        }
    }

    @Test
    @DisplayName("3. Conservative Safety: Unverified ingredients are strictly excluded when customer specifies allergies")
    void testConservativeUnverifiedIngredientExclusion() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2000.00"));
        request.setAllergies(Collections.singletonList("peanuts")); // Any allergy triggers conservative policy

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        // p10 has UNVERIFIED status -> must be excluded
        boolean p10Excluded = response.getExclusions().stream()
                .anyMatch(ex -> ex.getProductId().equals("p10") && ex.getExclusionCategory().equals("UNVERIFIED_INGREDIENTS"));
        assertTrue(p10Excluded, "Unverified ingredient product must be conservatively excluded when allergy specified");

        for (HamperTierDTO tier : response.getTiers().values()) {
            boolean hasP10 = tier.getProducts().stream().anyMatch(p -> p.getId().equals("p10"));
            assertFalse(hasP10, "Unverified product must not be recommended to customer with allergy restrictions");
        }
    }

    @Test
    @DisplayName("4. Skin Type Filtering: Incompatible skin type products are reliably excluded")
    void testSkinTypeFiltering() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2000.00"));
        request.setSkinType("Sensitive");

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        // p3 (Walnut Scrub) is strictly for "Oily" skin and incompatible with "Sensitive"
        boolean p3Excluded = response.getExclusions().stream()
                .anyMatch(ex -> ex.getProductId().equals("p3") && ex.getExclusionCategory().equals("SKIN_TYPE_INCOMPATIBLE"));
        assertTrue(p3Excluded, "Product formulated strictly for Oily skin must be excluded for Sensitive skin customer");

        for (HamperTierDTO tier : response.getTiers().values()) {
            boolean hasP3 = tier.getProducts().stream().anyMatch(p -> p.getId().equals("p3"));
            assertFalse(hasP3, "Incompatible skin-type product p3 must not be in recommendation tiers");
        }
    }

    @Test
    @DisplayName("5. Stock Limits: Out of stock (stock=0) and inactive products are excluded")
    void testStockLimitsAndInactiveExclusion() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2000.00"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        // p8 is out of stock (stock=0)
        boolean p8Excluded = response.getExclusions().stream()
                .anyMatch(ex -> ex.getProductId().equals("p8") && ex.getExclusionCategory().equals("OUT_OF_STOCK"));
        assertTrue(p8Excluded, "Out of stock product p8 must be excluded");

        // p9 is inactive (active=false)
        boolean p9Excluded = response.getExclusions().stream()
                .anyMatch(ex -> ex.getProductId().equals("p9") && ex.getExclusionCategory().equals("INACTIVE"));
        assertTrue(p9Excluded, "Inactive product p9 must be excluded");
    }

    @Test
    @DisplayName("6. Packaging Cost: Included in total and cannot be bypassed")
    void testPackagingCostInclusion() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        BigDecimal packagingFee = new BigDecimal("250.00");
        request.setMaxBudget(new BigDecimal("1500.00"));
        request.setPackagingCost(packagingFee);

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        for (HamperTierDTO tier : response.getTiers().values()) {
            assertEquals(packagingFee, tier.getPackagingCost(), "Tier packaging cost must match requested packaging cost");
            assertEquals(tier.getProductSubtotal().add(packagingFee), tier.getFinalTotal());
        }
    }

    @Test
    @DisplayName("7. Duplicate Prevention: No duplicate products within any recommended hamper tier")
    void testNoDuplicateProductsInHamper() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2500.00"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        for (Map.Entry<String, HamperTierDTO> entry : response.getTiers().entrySet()) {
            HamperTierDTO tier = entry.getValue();
            Set<String> uniqueIds = new HashSet<>();
            for (ProductRecommendationDTO prod : tier.getProducts()) {
                boolean added = uniqueIds.add(prod.getId());
                assertTrue(added, String.format("Tier %s contains duplicate product ID: %s", entry.getKey(), prod.getId()));
            }
        }
    }

    @Test
    @DisplayName("8. Infeasible Budget: When budget is less than packaging cost, returns NO_COMBINATION_POSSIBLE")
    void testNoValidCombinationWhenBudgetTooLow() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("100.00"));
        request.setPackagingCost(new BigDecimal("150.00")); // Packaging exceeds budget!

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        assertEquals("NO_COMBINATION_POSSIBLE", response.getStatus());
        assertTrue(response.getTiers().isEmpty());
        assertNotNull(response.getMessage());
    }

    @Test
    @DisplayName("9. Three Distinct Tiers: LOW, MEDIUM, HIGH generated with distinct sets")
    void testThreeDistinctTiersGenerated() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2200.00"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        assertEquals("SUCCESS", response.getStatus());
        assertEquals(3, response.getTiers().size());
        assertTrue(response.getTiers().containsKey("LOW"));
        assertTrue(response.getTiers().containsKey("MEDIUM"));
        assertTrue(response.getTiers().containsKey("HIGH"));

        HamperTierDTO low = response.getTiers().get("LOW");
        HamperTierDTO med = response.getTiers().get("MEDIUM");
        HamperTierDTO high = response.getTiers().get("HIGH");

        // Verify distinct totals and progressive pricing
        assertTrue(low.getFinalTotal().compareTo(med.getFinalTotal()) <= 0);
        assertTrue(med.getFinalTotal().compareTo(high.getFinalTotal()) <= 0);
    }

    @Test
    @DisplayName("10. Upsell Calculation: Computes valid upsell with accurate extra spend above maxBudget")
    void testUpsellCalculation() {
        when(productRepository.findAll()).thenReturn(testCatalog);

        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("1000.00"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response.getUpsell());
        if (Boolean.TRUE.equals(response.getUpsell().getAvailable())) {
            assertTrue(response.getUpsell().getAdditionalSpend().compareTo(BigDecimal.ZERO) > 0);
            assertEquals(response.getUpsell().getNewTotal().subtract(request.getMaxBudget()),
                    response.getUpsell().getAdditionalSpend());
            assertNotNull(response.getUpsell().getSuggestedProduct());
            assertNotNull(response.getUpsell().getMessage());
        }
    }
}
