package com.surrealtreasures.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Order Entity representing a confirmed hamper order or accepted corporate quotation order.
 * Persists order details, box configuration, financial totals, customer allergy restrictions,
 * and associated line items in PostgreSQL.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(length = 50)
    private String id;

    @NotBlank
    @Column(name = "order_reference", nullable = false, unique = true, length = 100)
    private String orderReference;

    @Column(name = "quotation_id", length = 50)
    private String quotationId;

    @NotBlank
    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @NotBlank
    @Column(name = "customer_email", nullable = false, length = 255)
    private String customerEmail;

    @Column(name = "recipient_name", length = 200)
    private String recipientName;

    @NotBlank
    @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "box_size", length = 50)
    private String boxSize;

    @Column(name = "packaging_option", length = 200)
    private String packagingOption;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String status; // e.g. WAREHOUSE_READY, CONFIRMED, CANCELLED

    @Column(name = "status_message", columnDefinition = "TEXT")
    private String statusMessage;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "total_product_retail", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalProductRetail = BigDecimal.ZERO;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "packaging_retail_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal packagingRetailPrice = BigDecimal.ZERO;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "total_order_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalOrderAmount = BigDecimal.ZERO;

    @Column(name = "total_product_cost", precision = 12, scale = 2)
    private BigDecimal totalProductCost;

    @Column(name = "packaging_cost", precision = 10, scale = 2)
    private BigDecimal packagingCost;

    @Column(name = "total_order_cost", precision = 12, scale = 2)
    private BigDecimal totalOrderCost;

    @Column(name = "customer_budget", precision = 12, scale = 2)
    private BigDecimal customerBudget;

    @Column(name = "fulfilment_notes", columnDefinition = "TEXT")
    private String fulfilmentNotes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_allergens", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "allergen")
    private Set<String> allergens = new HashSet<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("itemSequence ASC")
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Order() {
    }

    public Order(String id, String orderReference, String quotationId, String customerName,
                 String customerEmail, String recipientName, String deliveryAddress,
                 String boxSize, String packagingOption, String status, String statusMessage,
                 BigDecimal totalProductRetail, BigDecimal packagingRetailPrice, BigDecimal totalOrderAmount,
                 BigDecimal totalProductCost, BigDecimal packagingCost, BigDecimal totalOrderCost,
                 BigDecimal customerBudget, String fulfilmentNotes, Set<String> allergens,
                 LocalDateTime createdAt) {
        this.id = id;
        this.orderReference = orderReference;
        this.quotationId = quotationId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.recipientName = recipientName;
        this.deliveryAddress = deliveryAddress;
        this.boxSize = boxSize;
        this.packagingOption = packagingOption;
        this.status = status;
        this.statusMessage = statusMessage;
        this.totalProductRetail = totalProductRetail != null ? totalProductRetail : BigDecimal.ZERO;
        this.packagingRetailPrice = packagingRetailPrice != null ? packagingRetailPrice : BigDecimal.ZERO;
        this.totalOrderAmount = totalOrderAmount != null ? totalOrderAmount : BigDecimal.ZERO;
        this.totalProductCost = totalProductCost;
        this.packagingCost = packagingCost;
        this.totalOrderCost = totalOrderCost;
        this.customerBudget = customerBudget;
        this.fulfilmentNotes = fulfilmentNotes;
        this.allergens = allergens != null ? allergens : new HashSet<>();
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
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

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
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
