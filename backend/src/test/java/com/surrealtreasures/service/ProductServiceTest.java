package com.surrealtreasures.service;

import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.ProductExclusionExplanationDTO;
import com.surrealtreasures.dto.ProductTransparencyDTO;
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
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product verifiedProduct;
    private Product unverifiedProduct;
    private Product missingIngredientsProduct;

    @BeforeEach
    void setUp() {
        verifiedProduct = new Product(
                "p_verified",
                "Lavender Artisan Soap",
                "Handcrafted gentle soap",
                "Artisan Soaps",
                new BigDecimal("320.00"),
                new BigDecimal("120.00"),
                BigDecimal.ZERO,
                40,
                new HashSet<>(Arrays.asList("Sensitive", "All")),
                Arrays.asList("saponified olive oil", "lavender oil"),
                Arrays.asList("lavender"),
                IngredientVerificationStatus.VERIFIED,
                LocalDate.of(2026, 7, 10),
                "Biodegradable paper wrap",
                "Crafted on dedicated nut-free line",
                true,
                true,
                "https://example.com/soap.jpg"
        );

        unverifiedProduct = new Product(
                "p_unverified",
                "Artisan Bath Dust",
                "Unverified experimental blend",
                "Bath and Body",
                new BigDecimal("280.00"),
                new BigDecimal("90.00"),
                BigDecimal.ZERO,
                20,
                new HashSet<>(Arrays.asList("All")),
                Arrays.asList("mineral salts", "fragrance blend"),
                Collections.emptyList(),
                IngredientVerificationStatus.UNVERIFIED,
                null, // No verification date recorded
                "Kraft paper pouch",
                null, // No cross contamination warning recorded
                true,
                true,
                "https://example.com/bath.jpg"
        );

        missingIngredientsProduct = new Product(
                "p_missing",
                "Mystery Herbal Salve",
                "Incomplete formulation records",
                "Handmade Skincare",
                new BigDecimal("350.00"),
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                15,
                new HashSet<>(),
                Collections.emptyList(), // Missing ingredients
                Collections.emptyList(),
                IngredientVerificationStatus.UNVERIFIED,
                null,
                null,
                null,
                true,
                true,
                null
        );
    }

    @Test
    @DisplayName("Verified Product Transparency: exposes verified ingredients, allergens, and safety statement")
    void testVerifiedProductTransparency() {
        when(productRepository.findById("p_verified")).thenReturn(Optional.of(verifiedProduct));

        Optional<ProductTransparencyDTO> result = productService.getProductTransparencyById("p_verified");

        assertTrue(result.isPresent());
        ProductTransparencyDTO dto = result.get();
        assertEquals("p_verified", dto.getId());
        assertEquals(IngredientVerificationStatus.VERIFIED, dto.getIngredientVerificationStatus());
        assertEquals(LocalDate.of(2026, 7, 10), dto.getLastVerificationDate());
        assertEquals("Biodegradable paper wrap", dto.getPackagingInfo());
        assertEquals("Crafted on dedicated nut-free line", dto.getCrossContaminationWarning());

        // Verified fields check
        assertTrue(dto.getVerifiedFields().contains("ingredients"));
        assertTrue(dto.getVerifiedFields().contains("declaredAllergens"));
        assertTrue(dto.getVerifiedFields().contains("lastVerificationDate"));
        assertTrue(dto.getVerifiedFields().contains("packagingInfo"));
        assertTrue(dto.getVerifiedFields().contains("crossContaminationWarning"));
        assertTrue(dto.getAllergenSafetyStatement().contains("verified against small-batch"));
    }

    @Test
    @DisplayName("Unverified Product Transparency: explicitly marks ingredients & verification date as unknown/unverified")
    void testUnverifiedProductTransparency() {
        when(productRepository.findById("p_unverified")).thenReturn(Optional.of(unverifiedProduct));

        Optional<ProductTransparencyDTO> result = productService.getProductTransparencyById("p_unverified");

        assertTrue(result.isPresent());
        ProductTransparencyDTO dto = result.get();
        assertEquals(IngredientVerificationStatus.UNVERIFIED, dto.getIngredientVerificationStatus());
        assertNull(dto.getLastVerificationDate(), "Unrecorded verification date must remain null");
        assertNull(dto.getCrossContaminationWarning(), "Unrecorded cross-contamination warning must remain null");

        // Unverified fields check
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("ingredients"));
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("declaredAllergens"));
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("lastVerificationDate"));
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("crossContaminationWarning"));
        assertTrue(dto.getAllergenSafetyStatement().contains("cannot be guaranteed allergen-safe"));
    }

    @Test
    @DisplayName("Missing Ingredients Product: unknown fields are represented explicitly without inventing data")
    void testMissingIngredientData() {
        when(productRepository.findById("p_missing")).thenReturn(Optional.of(missingIngredientsProduct));

        Optional<ProductTransparencyDTO> result = productService.getProductTransparencyById("p_missing");

        assertTrue(result.isPresent());
        ProductTransparencyDTO dto = result.get();
        assertTrue(dto.getIngredients().isEmpty());
        assertTrue(dto.getSkinTypeSuitability().isEmpty());
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("ingredients"));
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("skinTypeSuitability"));
        assertTrue(dto.getUnverifiedOrUnknownFields().contains("packagingInfo"));
    }

    @Test
    @DisplayName("getAllProductTransparency: returns list of all products with transparency disclosures")
    void testGetAllProductTransparency() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(verifiedProduct, unverifiedProduct));

        List<ProductTransparencyDTO> list = productService.getAllProductTransparency();

        assertEquals(2, list.size());
        assertEquals("p_verified", list.get(0).getId());
        assertEquals("p_unverified", list.get(1).getId());
    }
}
