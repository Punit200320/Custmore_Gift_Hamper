package com.surrealtreasures.dto;

import java.math.BigDecimal;

/**
 * Dimensions and weight specification for an item.
 */
public class ItemDimensionsDTO {

    private BigDecimal lengthCm;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal volumeCm3;
    private BigDecimal weightGrams;

    public ItemDimensionsDTO() {
    }

    public ItemDimensionsDTO(BigDecimal lengthCm, BigDecimal widthCm, BigDecimal heightCm,
                             BigDecimal volumeCm3, BigDecimal weightGrams) {
        this.lengthCm = lengthCm;
        this.widthCm = widthCm;
        this.heightCm = heightCm;
        this.volumeCm3 = volumeCm3;
        this.weightGrams = weightGrams;
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
}
