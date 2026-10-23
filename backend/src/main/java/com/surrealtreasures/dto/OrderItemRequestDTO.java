package com.surrealtreasures.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequestDTO {

    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private java.math.BigDecimal lengthCm;
    private java.math.BigDecimal widthCm;
    private java.math.BigDecimal heightCm;
    private java.math.BigDecimal volumeCm3;
    private java.math.BigDecimal weightGrams;

    public OrderItemRequestDTO() {
    }

    public OrderItemRequestDTO(String productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public OrderItemRequestDTO(String productId, Integer quantity,
                               java.math.BigDecimal lengthCm, java.math.BigDecimal widthCm,
                               java.math.BigDecimal heightCm, java.math.BigDecimal volumeCm3,
                               java.math.BigDecimal weightGrams) {
        this.productId = productId;
        this.quantity = quantity;
        this.lengthCm = lengthCm;
        this.widthCm = widthCm;
        this.heightCm = heightCm;
        this.volumeCm3 = volumeCm3;
        this.weightGrams = weightGrams;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public java.math.BigDecimal getLengthCm() {
        return lengthCm;
    }

    public void setLengthCm(java.math.BigDecimal lengthCm) {
        this.lengthCm = lengthCm;
    }

    public java.math.BigDecimal getWidthCm() {
        return widthCm;
    }

    public void setWidthCm(java.math.BigDecimal widthCm) {
        this.widthCm = widthCm;
    }

    public java.math.BigDecimal getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(java.math.BigDecimal heightCm) {
        this.heightCm = heightCm;
    }

    public java.math.BigDecimal getVolumeCm3() {
        return volumeCm3;
    }

    public void setVolumeCm3(java.math.BigDecimal volumeCm3) {
        this.volumeCm3 = volumeCm3;
    }

    public java.math.BigDecimal getWeightGrams() {
        return weightGrams;
    }

    public void setWeightGrams(java.math.BigDecimal weightGrams) {
        this.weightGrams = weightGrams;
    }
}

