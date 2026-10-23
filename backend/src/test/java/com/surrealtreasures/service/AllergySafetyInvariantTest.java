package com.surrealtreasures.service;

import com.surrealtreasures.dto.CreateOrderRequestDTO;
import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.HamperRecommendationResponse;
import com.surrealtreasures.dto.OrderItemRequestDTO;
import com.surrealtreasures.dto.ProductExclusionDTO;
import com.surrealtreasures.dto.ProductTransparencyDTO;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.integration.OpenRouterClient;
import com.surrealtreasures.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Dedicated Allergy Safety Invariant Verification.
 * Verifies that:
 * 1. Declared allergen conflicts are strictly excluded.
 * 2. Unknown or unverified ingredient data is NEVER falsely marked safe.
 * 3. External AI suggestions CANNOT override deterministic safety policies.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AllergySafetyInvariantTest {

    @Autowired
    private HamperRecommendationService recommendationService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @MockBean
    private OpenRouterClient mockOpenRouterClient;

    @Test
    @DisplayName("Safety Invariant 1: Declared allergen conflicts are strictly excluded from recommendation and order")
    void testDeclaredAllergensExcluded() {
        CustomerRequirementsDTO req = new CustomerRequirementsDTO();
        req.setMaxBudget(new BigDecimal("3000.00"));
        req.setAllergies(Collections.singletonList("nuts"));

        HamperRecommendationResponse response = recommendationService.generateRecommendations(req);

        // Assert that no tier contains nut-bearing products (prod_butter_rose or prod_scrub_walnut)
        response.getTiers().values().forEach(tier -> {
            tier.getProducts().forEach(item -> {
                assertNotEquals("prod_butter_rose", item.getId(), "Nut-bearing butter must be excluded");
                assertNotEquals("prod_scrub_walnut", item.getId(), "Nut-bearing scrub must be excluded");
            });
        });

        // Verify exclusion audit trail
        boolean nutExclusionRecorded = response.getExclusions().stream()
                .anyMatch(ex -> "ALLERGEN_CONFLICT".equals(ex.getExclusionCategory()) && ex.getReason().toLowerCase().contains("nut"));
        assertTrue(nutExclusionRecorded, "Allergen exclusion reason must be captured in audit trail");
    }

    @Test
    @DisplayName("Safety Invariant 2: Unknown or unverified ingredient data is NEVER falsely marked safe")
    void testUnverifiedIngredientNeverMarkedSafe() {
        // Look up unverified bath dust demo product
        Optional<ProductTransparencyDTO> transparency = productService.getProductTransparencyById("prod_unverified_bath_dust");
        assertTrue(transparency.isPresent());
        ProductTransparencyDTO dto = transparency.get();

        assertEquals(IngredientVerificationStatus.UNVERIFIED, dto.getIngredientVerificationStatus());
        assertNull(dto.getLastVerificationDate());
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("ingredients"),
                "Unverified ingredients must be explicitly disclosed in unverifiedOrUnknownFields");
        assertTrue(dto.getAllergenSafetyStatement().contains("cannot be guaranteed allergen-safe"),
                "Unverified products must include explicit conservative safety warning");

        // Conservative recommendation policy: allergic customer must have unverified product excluded
        CustomerRequirementsDTO req = new CustomerRequirementsDTO();
        req.setMaxBudget(new BigDecimal("3000.00"));
        req.setAllergies(Collections.singletonList("lavender"));

        Product unverifiedProduct = productRepository.findById("prod_unverified_bath_dust").orElseThrow();
        Optional<ProductExclusionDTO> exclusion = recommendationService.evaluateEligibility(unverifiedProduct, req, new BigDecimal("2500.00"));
        assertTrue(exclusion.isPresent());
        assertEquals("UNVERIFIED_INGREDIENTS", exclusion.get().getExclusionCategory());
    }

    @Test
    @DisplayName("Safety Invariant 3: External AI suggestions CANNOT override deterministic safety checks")
    void testAiCannotOverrideDeterministicSafetyChecks() {
        // Simulate an external AI prompt recommending an allergen-conflicted product
        // e.g. AI recommends "prod_butter_rose" (contains declared tree nuts) for a customer with severe nut allergy
        when(mockOpenRouterClient.generateGiftCardMessage(any(), any(), any()))
                .thenReturn("AI suggests: Add luxurious Rose Butter for extra softness!");

        CreateOrderRequestDTO orderRequest = new CreateOrderRequestDTO(
                "Allergic Customer",
                "allergic@example.com",
                "Koregaon Park, Pune",
                "Classic",
                "Keepsake Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_butter_rose", 1))
        );
        orderRequest.setAllergies(Collections.singletonList("tree nuts"));
        orderRequest.setFulfilmentNotes(mockOpenRouterClient.generateGiftCardMessage("Birthday", "Allergic Customer", List.of("Rose Butter")));

        // The deterministic order engine MUST reject the order despite AI recommendation
        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(orderRequest));
        assertTrue(ex.getMessage().contains("Allergy Safety Violation"));
        assertTrue(ex.getMessage().contains("tree nuts"));
    }

    @Test
    @DisplayName("Safety Invariant 4: AI cannot bypass conservative unverified ingredient exclusion")
    void testAiCannotBypassUnverifiedIngredientSafety() {
        // AI recommends unverified bath dust
        when(mockOpenRouterClient.generateGiftCardMessage(any(), any(), any()))
                .thenReturn("AI suggests: Relax with our trending Mineral Bath Dust!");

        CreateOrderRequestDTO orderRequest = new CreateOrderRequestDTO(
                "Sensitive Customer",
                "sensitive@example.com",
                "Bandra, Mumbai",
                "Classic",
                "Keepsake Box",
                Collections.singletonList(new OrderItemRequestDTO("prod_unverified_bath_dust", 1))
        );
        orderRequest.setAllergies(Collections.singletonList("sulfates"));

        // Deterministic engine rejects unverified product for allergic customer
        ApiException ex = assertThrows(ApiException.class, () -> orderService.createOrder(orderRequest));
        assertTrue(ex.getMessage().contains("Conservative Safety Policy"));
        assertTrue(ex.getMessage().contains("UNVERIFIED"));
    }
}
