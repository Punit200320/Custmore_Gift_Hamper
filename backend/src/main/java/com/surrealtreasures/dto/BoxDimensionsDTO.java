package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Dimensions and capacity specification for a hamper gift box.
 */
public class BoxDimensionsDTO {

    private String boxSize;
    private BigDecimal lengthCm;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal volumeCapacityCm3;
    private BigDecimal maxWeightGrams;

    public BoxDimensionsDTO() {
    }

    public BoxDimensionsDTO(String boxSize, BigDecimal lengthCm, BigDecimal widthCm,
                            BigDecimal heightCm, BigDecimal volumeCapacityCm3, BigDecimal maxWeightGrams) {
        this.boxSize = boxSize;
        this.lengthCm = lengthCm;
        this.widthCm = widthCm;
        this.heightCm = heightCm;
        this.volumeCapacityCm3 = volumeCapacityCm3;
        this.maxWeightGrams = maxWeightGrams;
    }

    /**
     * Resolves standard configured box dimensions for standard hamper tiers.
     * Returns null if the box size is unconfigured/custom and no dimensions are known.
     */
    public static BoxDimensionsDTO getStandardBoxDimensions(String boxSize) {
        if (boxSize == null) {
            return null;
        }
        String normalized = boxSize.trim().toLowerCase();

        if (normalized.contains("petite")) {
            // Petite Keepsake Box: 20cm x 15cm x 8cm, Volume = 2,400 cm3
            return new BoxDimensionsDTO(
                    "Petite",
                    new BigDecimal("20.00"),
                    new BigDecimal("15.00"),
                    new BigDecimal("8.00"),
                    new BigDecimal("2400.00"),
                    new BigDecimal("1500.00")
            );
        } else if (normalized.contains("classic")) {
            // Classic Keepsake Box: 25cm x 20cm x 10cm, Volume = 5,000 cm3
            return new BoxDimensionsDTO(
                    "Classic",
                    new BigDecimal("25.00"),
                    new BigDecimal("20.00"),
                    new BigDecimal("10.00"),
                    new BigDecimal("5000.00"),
                    new BigDecimal("2500.00")
            );
        } else if (normalized.contains("deluxe")) {
            // Deluxe Keepsake Box: 32cm x 25cm x 12cm, Volume = 9,600 cm3
            return new BoxDimensionsDTO(
                    "Deluxe",
                    new BigDecimal("32.00"),
                    new BigDecimal("25.00"),
                    new BigDecimal("12.00"),
                    new BigDecimal("9600.00"),
                    new BigDecimal("4000.00")
            );
        } else if (normalized.contains("grand") || normalized.contains("bespoke")) {
            // Grand Luxury Keepsake Trunk: 40cm x 30cm x 15cm, Volume = 18,000 cm3
            return new BoxDimensionsDTO(
                    "Grand",
                    new BigDecimal("40.00"),
                    new BigDecimal("30.00"),
                    new BigDecimal("15.00"),
                    new BigDecimal("18000.00"),
                    new BigDecimal("6000.00")
            );
        }

        return null;
    }

    public String getBoxSize() {
        return boxSize;
    }

    public void setBoxSize(String boxSize) {
        this.boxSize = boxSize;
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

    public BigDecimal getVolumeCapacityCm3() {
        return volumeCapacityCm3;
    }

    public void setVolumeCapacityCm3(BigDecimal volumeCapacityCm3) {
        this.volumeCapacityCm3 = volumeCapacityCm3;
    }

    public BigDecimal getMaxWeightGrams() {
        return maxWeightGrams;
    }

    public void setMaxWeightGrams(BigDecimal maxWeightGrams) {
        this.maxWeightGrams = maxWeightGrams;
    }
}
