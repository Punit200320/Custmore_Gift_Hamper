package com.surrealtreasures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.surrealtreasures.dto.CorporatePricingBreakdownDTO;
import com.surrealtreasures.dto.CorporateQuotationRequestDTO;
import com.surrealtreasures.dto.CorporateQuotationResponseDTO;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.exception.GlobalExceptionHandler;
import com.surrealtreasures.service.CorporateQuotationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class CorporateQuotationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CorporateQuotationService quotationService;

    @InjectMocks
    private CorporateQuotationController quotationController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(quotationController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/corporate/quotes creates quotation and returns 201 Created")
    void testCreateQuotationSuccess() throws Exception {
        CorporateQuotationRequestDTO request = new CorporateQuotationRequestDTO();
        request.setCompanyName("Infosys Leadership");
        request.setQuantity(25);
        request.setBudgetPerHamper(new BigDecimal("2500.00"));
        request.setSelectedProductIds(Collections.singletonList("prod_saffron"));

        CorporateQuotationResponseDTO mockResponse = new CorporateQuotationResponseDTO();
        mockResponse.setQuoteId("CQ-2026-TEST01");
        mockResponse.setCompanyName("Infosys Leadership");
        mockResponse.setStatus("CONFIRMED");
        mockResponse.setFulfillable(true);
        mockResponse.setRequestedQuantity(25);
        mockResponse.setCreatedAt(LocalDateTime.now());

        CorporatePricingBreakdownDTO pb = new CorporatePricingBreakdownDTO();
        pb.setSellingPricePerHamper(new BigDecimal("1049.00"));
        pb.setEstimatedCostPerHamper(new BigDecimal("410.00"));
        pb.setTotalQuote(new BigDecimal("26225.00"));
        pb.setEstimatedTotalCost(new BigDecimal("10250.00"));
        pb.setEstimatedTotalGrossProfit(new BigDecimal("15975.00"));
        pb.setEstimatedGrossMarginPercentage(new BigDecimal("60.92"));
        mockResponse.setPricingBreakdown(pb);

        when(quotationService.generateQuotation(any(CorporateQuotationRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/corporate/quotes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quoteId").value("CQ-2026-TEST01"))
                .andExpect(jsonPath("$.companyName").value("Infosys Leadership"))
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.fulfillable").value(true))
                .andExpect(jsonPath("$.pricingBreakdown.totalQuote").value(26225.00))
                .andExpect(jsonPath("$.pricingBreakdown.estimatedGrossMarginPercentage").value(60.92));
    }

    @Test
    @DisplayName("GET /api/corporate/quotes/{quoteId} returns 200 OK with quote snapshot")
    void testGetQuotationByIdSuccess() throws Exception {
        CorporateQuotationResponseDTO mockResponse = new CorporateQuotationResponseDTO();
        mockResponse.setQuoteId("CQ-2026-TEST01");
        mockResponse.setCompanyName("Infosys Leadership");
        mockResponse.setStatus("CONFIRMED");
        mockResponse.setFulfillable(true);
        mockResponse.setRequestedQuantity(25);

        when(quotationService.getQuotationById("CQ-2026-TEST01")).thenReturn(mockResponse);

        mockMvc.perform(get("/api/corporate/quotes/CQ-2026-TEST01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quoteId").value("CQ-2026-TEST01"))
                .andExpect(jsonPath("$.companyName").value("Infosys Leadership"));
    }

    @Test
    @DisplayName("GET /api/corporate/quotes/{quoteId} returns 404 Not Found when ID does not exist")
    void testGetQuotationNotFound() throws Exception {
        when(quotationService.getQuotationById("CQ-INVALID"))
                .thenThrow(new ApiException("Corporate quotation not found with ID: CQ-INVALID", HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/api/corporate/quotes/CQ-INVALID"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Corporate quotation not found with ID: CQ-INVALID"));
    }

    @Test
    @DisplayName("POST /api/corporate/quotes with blank company name returns 400 Bad Request")
    void testValidationFailureBlankCompany() throws Exception {
        CorporateQuotationRequestDTO invalidReq = new CorporateQuotationRequestDTO();
        invalidReq.setCompanyName(""); // blank!
        invalidReq.setQuantity(10);
        invalidReq.setBudgetPerHamper(new BigDecimal("1500.00"));

        mockMvc.perform(post("/api/corporate/quotes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    @DisplayName("POST /api/corporate/quotes with negative quantity returns 400 Bad Request")
    void testValidationFailureNegativeQuantity() throws Exception {
        CorporateQuotationRequestDTO invalidReq = new CorporateQuotationRequestDTO();
        invalidReq.setCompanyName("Acme Corp");
        invalidReq.setQuantity(-10); // negative quantity!
        invalidReq.setBudgetPerHamper(new BigDecimal("1500.00"));

        mockMvc.perform(post("/api/corporate/quotes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    @DisplayName("POST /api/corporate/quotes with negative budget returns 400 Bad Request")
    void testValidationFailureNegativeBudget() throws Exception {
        CorporateQuotationRequestDTO invalidReq = new CorporateQuotationRequestDTO();
        invalidReq.setCompanyName("Acme Corp");
        invalidReq.setQuantity(10);
        invalidReq.setBudgetPerHamper(new BigDecimal("-500.00")); // negative budget!

        mockMvc.perform(post("/api/corporate/quotes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }
}

