package com.surrealtreasures.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Order Item Entity representing an immutable line item within a confirmed order.
 * Stores sequence number, snapshot pricing and unit costs, dimensions, packaging info,
 * and allergen warnings.
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @NotNull
    @Column(name = "item_sequence", nullable = false)
    private Integer itemSequence;

    @NotBlank
    @Column(name = "product_id", nullable = false, length = 50)
    private String productId;

    @NotBlank
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String category;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "unit_retail_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitRetailPrice;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "total_retail_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalRetailPrice;

    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "total_cost", precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "length_cm", precision = 8, scale = 2)
    private BigDecimal lengthCm;

    @Column(name = "width_cm", precision = 8, scale = 2)
    private BigDecimal widthCm;

    @Column(name = "height_cm", precision = 8, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "volume_cm3", precision = 10, scale = 2)
    private BigDecimal volumeCm3;

    @Column(name = "weight_grams", precision = 8, scale = 2)
    private BigDecimal weightGrams;

    @Column(name = "packaging_info")
    private String packagingInfo;

    @Column(name = "cross_contamination_warning", columnDefinition = "TEXT")
    private String crossContaminationWarning;

    @Column(name = "ingredient_verification_status", length = 50)
    private String ingredientVerificationStatus;

    public OrderItem() {
    }

    public OrderItem(Integer itemSequence, String productId, String productName, String category,
                     Integer quantity, BigDecimal unitRetailPrice, BigDecimal totalRetailPrice,
                     BigDecimal unitCost, BigDecimal totalCost,
                     BigDecimal lengthCm, BigDecimal widthCm, BigDecimal heightCm,
                     BigDecimal volumeCm3, BigDecimal weightGrams,
                     String packagingInfo, String crossContaminationWarning,
                     String ingredientVerificationStatus) {
        this.itemSequence = itemSequence;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.quantity = quantity != null && quantity > 0 ? quantity : 1;
        this.unitRetailPrice = unitRetailPrice;
        this.totalRetailPrice = totalRetailPrice;
        this.unitCost = unitCost;
        this.totalCost = totalCost;
        this.lengthCm = lengthCm;
        this.widthCm = widthCm;
        this.heightCm = heightCm;
        this.volumeCm3 = volumeCm3;
        this.weightGrams = weightGrams;
        this.packagingInfo = packagingInfo;
        this.crossContaminationWarning = crossContaminationWarning;
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Integer getItemSequence() {
        return itemSequence;
    }

    public void setItemSequence(Integer itemSequence) {
        this.itemSequence = itemSequence;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitRetailPrice() {
        return unitRetailPrice;
    }

    public void setUnitRetailPrice(BigDecimal unitRetailPrice) {
        this.unitRetailPrice = unitRetailPrice;
    }

    public BigDecimal getTotalRetailPrice() {
        return totalRetailPrice;
    }

    public void setTotalRetailPrice(BigDecimal totalRetailPrice) {
        this.totalRetailPrice = totalRetailPrice;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getLengthCm() {
        return lengthCm;
    }

    public void setLengthCm(BigDecimal lengthCm) {
        this.lengthCm = lengthCm;
    }

    public BigDecimal getWidthCm() {
        return widthCm;
    }

    public void setWidthCm(BigDecimal widthCm) {
        this.widthCm = widthCm;
    }

    public BigDecimal getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(BigDecimal heightCm) {
        this.heightCm = heightCm;
    }

    public BigDecimal getVolumeCm3() {
        return volumeCm3;
    }

    public void setVolumeCm3(BigDecimal volumeCm3) {
        this.volumeCm3 = volumeCm3;
    }

    public BigDecimal getWeightGrams() {
        return weightGrams;
    }

    public void setWeightGrams(BigDecimal weightGrams) {
        this.weightGrams = weightGrams;
    }

    public String getPackagingInfo() {
        return packagingInfo;
    }

    public void setPackagingInfo(String packagingInfo) {
        this.packagingInfo = packagingInfo;
    }

    public String getCrossContaminationWarning() {
        return crossContaminationWarning;
    }

    public void setCrossContaminationWarning(String crossContaminationWarning) {
        this.crossContaminationWarning = crossContaminationWarning;
    }

    public String getIngredientVerificationStatus() {
        return ingredientVerificationStatus;
    }

    public void setIngredientVerificationStatus(String ingredientVerificationStatus) {
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }
}
