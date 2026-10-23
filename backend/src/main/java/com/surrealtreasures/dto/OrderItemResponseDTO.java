package com.surrealtreasures.dto;

import java.math.BigDecimal;

/**
 * DTO representing an order item in order details response.
 */
public class OrderItemResponseDTO {

    private Long id;
    private Integer itemSequence;
    private String productId;
    private String productName;
    private String category;
    private Integer quantity;
    private BigDecimal unitRetailPrice;
    private BigDecimal totalRetailPrice;
    private BigDecimal unitCost;
    private BigDecimal totalCost;
    private BigDecimal lengthCm;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal volumeCm3;
    private BigDecimal weightGrams;
    private String packagingInfo;
    private String crossContaminationWarning;
    private String ingredientVerificationStatus;

    public OrderItemResponseDTO() {
    }

    public OrderItemResponseDTO(Long id, Integer itemSequence, String productId, String productName,
                                String category, Integer quantity, BigDecimal unitRetailPrice,
                                BigDecimal totalRetailPrice, BigDecimal unitCost, BigDecimal totalCost,
                                BigDecimal lengthCm, BigDecimal widthCm, BigDecimal heightCm,
                                BigDecimal volumeCm3, BigDecimal weightGrams,
                                String packagingInfo, String crossContaminationWarning,
                                String ingredientVerificationStatus) {
        this.id = id;
        this.itemSequence = itemSequence;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.quantity = quantity;
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
