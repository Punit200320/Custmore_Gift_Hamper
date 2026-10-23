package com.surrealtreasures.controller;

import com.surrealtreasures.dto.CreateOrderRequestDTO;
import com.surrealtreasures.dto.OrderResponseDTO;
import com.surrealtreasures.dto.WarehousePackingSlipDTO;
import com.surrealtreasures.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Order Processing, Confirmation, and Warehouse Packing Slip Export.
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * POST /api/orders
     * Create and confirm an order from a confirmed hamper selection or accepted corporate quotation.
     * Revalidates inventory stock, allergy restrictions, and budget constraints before confirmation.
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/orders/{id}
     * Retrieve an order by its unique ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable String id) {
        OrderResponseDTO response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/orders/{id}/packing-slip
     * Return warehouse-ready structured JSON payload with item sequence,
     * box fit validation, grounded packing instructions, allergen warnings, and cost breakdown.
     */
    @GetMapping("/{id}/packing-slip")
    public ResponseEntity<WarehousePackingSlipDTO> getPackingSlip(@PathVariable String id) {
        WarehousePackingSlipDTO slip = orderService.generatePackingSlip(id);
        return ResponseEntity.ok(slip);
    }
}
