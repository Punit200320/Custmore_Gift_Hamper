package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * DTO representing an order response.
 */
public class OrderResponseDTO {

    private String id;
    private String orderReference;
    private String quotationId;
    private String customerName;
    private String customerEmail;
    private String recipientName;
    private String deliveryAddress;
    private String boxSize;
    private String packagingOption;
    private String status;
    private String statusMessage;
    private BigDecimal totalProductRetail;
    private BigDecimal packagingRetailPrice;
    private BigDecimal totalOrderAmount;
    private BigDecimal totalProductCost;
    private BigDecimal packagingCost;
    private BigDecimal totalOrderCost;
    private BigDecimal customerBudget;
    private String fulfilmentNotes;
    private Set<String> allergens = new HashSet<>();
    private List<OrderItemResponseDTO> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponseDTO() {
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderReference() {
        return orderReference;
    }

    public void setOrderReference(String orderReference) {
        this.orderReference = orderReference;
    }

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
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

    public String getBoxSize() {
        return boxSize;
    }

    public void setBoxSize(String boxSize) {
        this.boxSize = boxSize;
    }

    public String getPackagingOption() {
        return packagingOption;
    }

    public void setPackagingOption(String packagingOption) {
        this.packagingOption = packagingOption;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public BigDecimal getTotalProductRetail() {
        return totalProductRetail;
    }

    public void setTotalProductRetail(BigDecimal totalProductRetail) {
        this.totalProductRetail = totalProductRetail;
    }

    public BigDecimal getPackagingRetailPrice() {
        return packagingRetailPrice;
    }

    public void setPackagingRetailPrice(BigDecimal packagingRetailPrice) {
        this.packagingRetailPrice = packagingRetailPrice;
    }

    public BigDecimal getTotalOrderAmount() {
        return totalOrderAmount;
    }

    public void setTotalOrderAmount(BigDecimal totalOrderAmount) {
        this.totalOrderAmount = totalOrderAmount;
    }

    public BigDecimal getTotalProductCost() {
        return totalProductCost;
    }

    public void setTotalProductCost(BigDecimal totalProductCost) {
        this.totalProductCost = totalProductCost;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost;
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }

    public BigDecimal getTotalOrderCost() {
        return totalOrderCost;
    }

    public void setTotalOrderCost(BigDecimal totalOrderCost) {
        this.totalOrderCost = totalOrderCost;
    }

    public BigDecimal getCustomerBudget() {
        return customerBudget;
    }

    public void setCustomerBudget(BigDecimal customerBudget) {
        this.customerBudget = customerBudget;
    }

    public String getFulfilmentNotes() {
        return fulfilmentNotes;
    }

    public void setFulfilmentNotes(String fulfilmentNotes) {
        this.fulfilmentNotes = fulfilmentNotes;
    }

    public Set<String> getAllergens() {
        return allergens;
    }

    public void setAllergens(Set<String> allergens) {
        this.allergens = allergens;
    }

    public List<OrderItemResponseDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponseDTO> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
