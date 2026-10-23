package com.surrealtreasures.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Warehouse-Ready Structured JSON Packing Slip Payload.
 * Designed with a stable schema suitable for frontend rendering, warehouse handheld terminals,
 * and future warehouse management system (WMS) integrations.
 */
public class WarehousePackingSlipDTO {

    private String orderId;
    private String orderReference;
    private String orderStatus;
    private LocalDateTime createdAt;

    private String customerName;
    private String recipientName;
    private String deliveryAddress;
    private String fulfilmentNotes;

    private BoxPackingDetailsDTO boxDetails;
    private List<PackingSlipItemDTO> items = new ArrayList<>();
    private AllergenSafetySlipDTO allergenSummary;
    private PackingSlipCostBreakdownDTO costBreakdown;

    public WarehousePackingSlipDTO() {
    }

    public WarehousePackingSlipDTO(String orderId, String orderReference, String orderStatus,
                                  LocalDateTime createdAt, String customerName, String recipientName,
                                  String deliveryAddress, String fulfilmentNotes,
                                  BoxPackingDetailsDTO boxDetails, List<PackingSlipItemDTO> items,
                                  AllergenSafetySlipDTO allergenSummary,
                                  PackingSlipCostBreakdownDTO costBreakdown) {
        this.orderId = orderId;
        this.orderReference = orderReference;
        this.orderStatus = orderStatus;
        this.createdAt = createdAt;
        this.customerName = customerName;
        this.recipientName = recipientName;
        this.deliveryAddress = deliveryAddress;
        this.fulfilmentNotes = fulfilmentNotes;
        this.boxDetails = boxDetails;
        this.items = items != null ? items : new ArrayList<>();
        this.allergenSummary = allergenSummary;
        this.costBreakdown = costBreakdown;
    }

    // Getters and Setters

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderReference() {
        return orderReference;
    }

    public void setOrderReference(String orderReference) {
        this.orderReference = orderReference;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getFulfilmentNotes() {
        return fulfilmentNotes;
    }

    public void setFulfilmentNotes(String fulfilmentNotes) {
        this.fulfilmentNotes = fulfilmentNotes;
    }

    public BoxPackingDetailsDTO getBoxDetails() {
        return boxDetails;
    }

    public void setBoxDetails(BoxPackingDetailsDTO boxDetails) {
        this.boxDetails = boxDetails;
    }

    public List<PackingSlipItemDTO> getItems() {
        return items;
    }

    public void setItems(List<PackingSlipItemDTO> items) {
        this.items = items;
    }

    public AllergenSafetySlipDTO getAllergenSummary() {
        return allergenSummary;
    }

    public void setAllergenSummary(AllergenSafetySlipDTO allergenSummary) {
        this.allergenSummary = allergenSummary;
    }

    public PackingSlipCostBreakdownDTO getCostBreakdown() {
        return costBreakdown;
    }

    public void setCostBreakdown(PackingSlipCostBreakdownDTO costBreakdown) {
        this.costBreakdown = costBreakdown;
    }
}
