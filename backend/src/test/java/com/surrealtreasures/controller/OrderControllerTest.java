package com.surrealtreasures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.surrealtreasures.dto.*;
import com.surrealtreasures.exception.ApiException;
import com.surrealtreasures.exception.GlobalExceptionHandler;
import com.surrealtreasures.service.OrderService;
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
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(orderController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/orders creates confirmed order and returns 201 Created")
    void testCreateOrder_Success() throws Exception {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO(
                "Diya Sengupta",
                "diya@example.com",
                "89 Prabhat Road, Pune",
                "Classic",
                "Handcrafted Pine Wood Chest",
                Collections.singletonList(new OrderItemRequestDTO("prod_soap_lavender", 2))
        );

        OrderResponseDTO response = new OrderResponseDTO();
        response.setId("ORD-2026-TEST01");
        response.setOrderReference("ST-REF-1001");
        response.setStatus("WAREHOUSE_READY");
        response.setCustomerName("Diya Sengupta");
        response.setCustomerEmail("diya@example.com");
        response.setDeliveryAddress("89 Prabhat Road, Pune");
        response.setBoxSize("Classic");
        response.setPackagingOption("Handcrafted Pine Wood Chest");
        response.setTotalProductRetail(new BigDecimal("640.00"));
        response.setPackagingRetailPrice(new BigDecimal("150.00"));
        response.setTotalOrderAmount(new BigDecimal("790.00"));
        response.setCreatedAt(LocalDateTime.now());

        when(orderService.createOrder(any(CreateOrderRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ORD-2026-TEST01"))
                .andExpect(jsonPath("$.status").value("WAREHOUSE_READY"))
                .andExpect(jsonPath("$.customerName").value("Diya Sengupta"))
                .andExpect(jsonPath("$.boxSize").value("Classic"))
                .andExpect(jsonPath("$.totalOrderAmount").value(790.00));
    }

    @Test
    @DisplayName("POST /api/orders returns 400 when mandatory fields are missing")
    void testCreateOrder_ValidationFailure() throws Exception {
        CreateOrderRequestDTO invalidRequest = new CreateOrderRequestDTO();
        // Missing name, email, delivery address

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/orders/{id} returns 200 OK with order details")
    void testGetOrderById_Success() throws Exception {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId("ORD-2026-TEST02");
        response.setOrderReference("ST-REF-1002");
        response.setStatus("WAREHOUSE_READY");
        response.setCustomerName("Manish Dave");
        response.setCustomerEmail("manish@example.com");
        response.setDeliveryAddress("Koregaon Park, Pune");

        when(orderService.getOrderById("ORD-2026-TEST02")).thenReturn(response);

        mockMvc.perform(get("/api/orders/ORD-2026-TEST02"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("ORD-2026-TEST02"))
                .andExpect(jsonPath("$.customerName").value("Manish Dave"))
                .andExpect(jsonPath("$.status").value("WAREHOUSE_READY"));
    }

    @Test
    @DisplayName("GET /api/orders/{id} returns 404 when order is not found")
    void testGetOrderById_NotFound() throws Exception {
        when(orderService.getOrderById("ORD-NON-EXISTENT"))
                .thenThrow(new ApiException("Order not found with ID: ORD-NON-EXISTENT", HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/api/orders/ORD-NON-EXISTENT"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/orders/{id}/packing-slip returns structured warehouse payload")
    void testGetPackingSlip_Success() throws Exception {
        BoxDimensionsDTO boxDim = new BoxDimensionsDTO(
                "Deluxe",
                new BigDecimal("32.00"),
                new BigDecimal("25.00"),
                new BigDecimal("12.00"),
                new BigDecimal("9600.00"),
                new BigDecimal("4000.00")
        );
        DimensionFitValidationDTO fit = DimensionFitValidationDTO.verifiedFit(
                new BigDecimal("494.00"),
                new BigDecimal("9600.00"),
                new BigDecimal("5.15"),
                "Physical fit verified."
        );
        BoxPackingDetailsDTO boxDetails = new BoxPackingDetailsDTO(
                "Deluxe",
                "Handcrafted Pine Wood Chest",
                boxDim,
                fit
        );

        PackingSlipItemDTO item1 = new PackingSlipItemDTO(
                1,
                "prod_soap_lavender",
                "Lavender & Roman Chamomile Artisan Soap",
                "Artisan Soaps",
                2,
                new ItemDimensionsDTO(new BigDecimal("8.00"), new BigDecimal("6.00"), new BigDecimal("3.00"), new BigDecimal("144.00"), new BigDecimal("120.00")),
                "Biodegradable banana fiber paper wrap",
                "Container is paper wrap. Place atop dry bedding.",
                Collections.singletonList("lavender"),
                null,
                new BigDecimal("320.00"),
                new BigDecimal("640.00"),
                new BigDecimal("120.00"),
                new BigDecimal("240.00"),
                "VERIFIED"
        );

        AllergenSafetySlipDTO allergenSummary = new AllergenSafetySlipDTO(
                Collections.emptyList(),
                Collections.singletonList("Lavender Soap declared allergens: lavender"),
                Collections.emptyList(),
                "VERIFIED_SAFE"
        );

        PackingSlipCostBreakdownDTO costBreakdown = new PackingSlipCostBreakdownDTO(
                new BigDecimal("640.00"),
                new BigDecimal("250.00"),
                new BigDecimal("890.00"),
                new BigDecimal("240.00"),
                new BigDecimal("90.00"),
                new BigDecimal("330.00"),
                true
        );

        WarehousePackingSlipDTO slip = new WarehousePackingSlipDTO(
                "ORD-2026-TEST03",
                "ST-REF-1003",
                "WAREHOUSE_READY",
                LocalDateTime.now(),
                "Aarav Kapoor",
                "Aarav Kapoor",
                "Aundh, Pune",
                "Fragile handle with extra care",
                boxDetails,
                Collections.singletonList(item1),
                allergenSummary,
                costBreakdown
        );

        when(orderService.generatePackingSlip("ORD-2026-TEST03")).thenReturn(slip);

        mockMvc.perform(get("/api/orders/ORD-2026-TEST03/packing-slip"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value("ORD-2026-TEST03"))
                .andExpect(jsonPath("$.orderStatus").value("WAREHOUSE_READY"))
                .andExpect(jsonPath("$.orderReference").value("ST-REF-1003"))
                .andExpect(jsonPath("$.boxDetails.selectedBoxSize").value("Deluxe"))
                .andExpect(jsonPath("$.boxDetails.dimensionFitValidation.fitVerified").value(true))
                .andExpect(jsonPath("$.items[0].sequenceNumber").value(1))
                .andExpect(jsonPath("$.items[0].productId").value("prod_soap_lavender"))
                .andExpect(jsonPath("$.items[0].productName").value("Lavender & Roman Chamomile Artisan Soap"))
                .andExpect(jsonPath("$.items[0].quantity").value(2))
                .andExpect(jsonPath("$.items[0].packingInstructions").isNotEmpty())
                .andExpect(jsonPath("$.allergenSummary.safetyAuditStatus").value("VERIFIED_SAFE"))
                .andExpect(jsonPath("$.costBreakdown.costBreakdownAvailable").value(true))
                .andExpect(jsonPath("$.fulfilmentNotes").value("Fragile handle with extra care"));
    }
}
