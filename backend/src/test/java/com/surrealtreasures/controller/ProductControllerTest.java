package com.surrealtreasures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.ProductExclusionExplanationDTO;
import com.surrealtreasures.dto.ProductTransparencyDTO;
import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.service.HamperRecommendationService;
import com.surrealtreasures.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Mock
    private HamperRecommendationService recommendationService;

    @InjectMocks
    private ProductController productController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private ProductTransparencyDTO sampleTransparencyDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();

        sampleTransparencyDTO = new ProductTransparencyDTO();
        sampleTransparencyDTO.setId("p_soap_1");
        sampleTransparencyDTO.setName("Lavender Soap");
        sampleTransparencyDTO.setCategory("Artisan Soaps");
        sampleTransparencyDTO.setRetailPrice(new BigDecimal("320.00"));
        sampleTransparencyDTO.setAvailableStock(30);
        sampleTransparencyDTO.setHandmade(true);
        sampleTransparencyDTO.setIngredients(Arrays.asList("olive oil", "lavender oil"));
        sampleTransparencyDTO.setDeclaredAllergens(Collections.singletonList("lavender"));
        sampleTransparencyDTO.setIngredientVerificationStatus(IngredientVerificationStatus.VERIFIED);
        sampleTransparencyDTO.setLastVerificationDate(LocalDate.of(2026, 7, 10));
        sampleTransparencyDTO.setPackagingInfo("Biodegradable paper wrap");
        sampleTransparencyDTO.setCrossContaminationWarning("Nut-free line");
        sampleTransparencyDTO.setVerifiedFields(Arrays.asList("ingredients", "declaredAllergens", "lastVerificationDate"));
        sampleTransparencyDTO.setUnverifiedOrUnknownFields(Collections.emptyList());
    }

    @Test
    @DisplayName("GET /api/products returns 200 with list of product transparency disclosures")
    void testGetAllProducts() throws Exception {
        when(productService.getAllProductTransparency()).thenReturn(Collections.singletonList(sampleTransparencyDTO));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("p_soap_1"))
                .andExpect(jsonPath("$[0].name").value("Lavender Soap"))
                .andExpect(jsonPath("$[0].ingredientVerificationStatus").value("VERIFIED"))
                .andExpect(jsonPath("$[0].packagingInfo").value("Biodegradable paper wrap"))
                .andExpect(jsonPath("$[0].crossContaminationWarning").value("Nut-free line"));
    }

    @Test
    @DisplayName("GET /api/products/{id} returns 200 when product exists")
    void testGetProductByIdSuccess() throws Exception {
        when(productService.getProductTransparencyById("p_soap_1")).thenReturn(Optional.of(sampleTransparencyDTO));

        mockMvc.perform(get("/api/products/p_soap_1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("p_soap_1"))
                .andExpect(jsonPath("$.retailPrice").value(320.00))
                .andExpect(jsonPath("$.verifiedFields[0]").value("ingredients"));
    }

    @Test
    @DisplayName("GET /api/products/{id} returns 404 when product does not exist")
    void testGetProductByIdNotFound() throws Exception {
        when(productService.getProductTransparencyById("non_existent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/non_existent"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/products/{id}/explain-eligibility returns diagnostic exclusion explanation")
    void testExplainProductEligibility() throws Exception {
        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("1500.00"));
        request.setAllergies(Collections.singletonList("lavender"));

        ProductExclusionExplanationDTO explanation = new ProductExclusionExplanationDTO(
                "p_soap_1",
                "Lavender Soap",
                false,
                "ALLERGEN_CONFLICT",
                "Product contains declared allergen: 'lavender'",
                "Declared allergen: lavender",
                sampleTransparencyDTO
        );

        when(recommendationService.explainProductEligibility(eq("p_soap_1"), any(CustomerRequirementsDTO.class)))
                .thenReturn(Optional.of(explanation));

        mockMvc.perform(post("/api/products/p_soap_1/explain-eligibility")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eligible").value(false))
                .andExpect(jsonPath("$.exclusionCategory").value("ALLERGEN_CONFLICT"))
                .andExpect(jsonPath("$.conflictingRestriction").value("Declared allergen: lavender"))
                .andExpect(jsonPath("$.transparency.id").value("p_soap_1"));
    }
}
