package com.surrealtreasures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.HamperRecommendationResponse;
import com.surrealtreasures.dto.HamperTierDTO;
import com.surrealtreasures.service.HamperRecommendationService;
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
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RecommendationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HamperRecommendationService recommendationService;

    @InjectMocks
    private RecommendationController recommendationController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(recommendationController).build();
    }

    @Test
    @DisplayName("POST /api/recommendations returns 200 with structured JSON response")
    void testGetRecommendationsSuccess() throws Exception {
        CustomerRequirementsDTO request = new CustomerRequirementsDTO();
        request.setMaxBudget(new BigDecimal("2000.00"));
        request.setOccasion("Birthday");
        request.setSkinType("Sensitive");
        request.setAllergies(Collections.singletonList("nuts"));

        Map<String, HamperTierDTO> tiers = new HashMap<>();
        tiers.put("HIGH", new HamperTierDTO("HIGH", "Opulent Hamper", Collections.emptyList(), 3,
                new BigDecimal("1700.00"), new BigDecimal("150.00"), new BigDecimal("1850.00"),
                new BigDecimal("150.00"), new BigDecimal("92.5"), "Luxury selection"));

        HamperRecommendationResponse mockResponse = new HamperRecommendationResponse(
                "SUCCESS",
                "Generated 3 distinct tiers",
                new BigDecimal("2000.00"),
                tiers,
                null,
                Collections.emptyList(),
                5,
                2
        );

        when(recommendationService.generateRecommendations(any(CustomerRequirementsDTO.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.maxBudget").value(2000.00))
                .andExpect(jsonPath("$.tiers.HIGH").exists())
                .andExpect(jsonPath("$.tiers.HIGH.finalTotal").value(1850.00));
    }

    @Test
    @DisplayName("POST /api/recommendations validates budget constraints and rejects missing budget")
    void testGetRecommendationsValidationFailure() throws Exception {
        CustomerRequirementsDTO invalidRequest = new CustomerRequirementsDTO();
        // maxBudget is null!

        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
