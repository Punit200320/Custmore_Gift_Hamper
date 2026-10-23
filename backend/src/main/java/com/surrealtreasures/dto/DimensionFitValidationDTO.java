package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Result of physical dimensions and volume capacity validation for warehouse packing.
 * Grounded strictly in recorded dimensions; returns explicit unverified status
 * if any product or box dimension data is missing.
 */
public class DimensionFitValidationDTO {

    private String status; // DIMENSION_FIT_VERIFIED, NOT_VALIDATED_MISSING_DIMENSIONS, DIMENSION_FIT_EXCEEDED, VOLUME_CAPACITY_EXCEEDED
    private boolean fitVerified;
    private String validationMessage;
    private BigDecimal totalItemsVolumeCm3;
    private BigDecimal boxVolumeCapacityCm3;
    private BigDecimal volumeUtilizationPercentage;
    private List<String> missingDimensionItems = new ArrayList<>();
    private List<String> fitConstraintViolations = new ArrayList<>();

    public DimensionFitValidationDTO() {
    }

    public static DimensionFitValidationDTO missingDimensions(List<String> missingItems, String message) {
        DimensionFitValidationDTO dto = new DimensionFitValidationDTO();
        dto.setStatus("NOT_VALIDATED_MISSING_DIMENSIONS");
        dto.setFitVerified(false);
        dto.setValidationMessage(message);
        dto.setMissingDimensionItems(missingItems != null ? missingItems : new ArrayList<>());
        return dto;
    }

    public static DimensionFitValidationDTO fitExceeded(String status, String message, List<String> violations,
                                                        BigDecimal totalVolume, BigDecimal boxCapacity, BigDecimal utilization) {
        DimensionFitValidationDTO dto = new DimensionFitValidationDTO();
        dto.setStatus(status);
        dto.setFitVerified(false);
        dto.setValidationMessage(message);
        dto.setFitConstraintViolations(violations != null ? violations : new ArrayList<>());
        dto.setTotalItemsVolumeCm3(totalVolume);
        dto.setBoxVolumeCapacityCm3(boxCapacity);
        dto.setVolumeUtilizationPercentage(utilization);
        return dto;
    }

    public static DimensionFitValidationDTO verifiedFit(BigDecimal totalVolume, BigDecimal boxCapacity,
                                                        BigDecimal utilization, String message) {
        DimensionFitValidationDTO dto = new DimensionFitValidationDTO();
        dto.setStatus("DIMENSION_FIT_VERIFIED");
        dto.setFitVerified(true);
        dto.setValidationMessage(message);
        dto.setTotalItemsVolumeCm3(totalVolume);
        dto.setBoxVolumeCapacityCm3(boxCapacity);
        dto.setVolumeUtilizationPercentage(utilization);
        return dto;
    }

    // Getters and Setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isFitVerified() {
        return fitVerified;
    }

    public void setFitVerified(boolean fitVerified) {
        this.fitVerified = fitVerified;
    }

    public String getValidationMessage() {
        return validationMessage;
    }

    public void setValidationMessage(String validationMessage) {
        this.validationMessage = validationMessage;
    }

    public BigDecimal getTotalItemsVolumeCm3() {
        return totalItemsVolumeCm3;
    }

    public void setTotalItemsVolumeCm3(BigDecimal totalItemsVolumeCm3) {
        this.totalItemsVolumeCm3 = totalItemsVolumeCm3;
    }

    public BigDecimal getBoxVolumeCapacityCm3() {
        return boxVolumeCapacityCm3;
    }

    public void setBoxVolumeCapacityCm3(BigDecimal boxVolumeCapacityCm3) {
        this.boxVolumeCapacityCm3 = boxVolumeCapacityCm3;
    }

    public BigDecimal getVolumeUtilizationPercentage() {
        return volumeUtilizationPercentage;
    }

    public void setVolumeUtilizationPercentage(BigDecimal volumeUtilizationPercentage) {
        this.volumeUtilizationPercentage = volumeUtilizationPercentage;
    }

    public List<String> getMissingDimensionItems() {
        return missingDimensionItems;
    }

    public void setMissingDimensionItems(List<String> missingDimensionItems) {
        this.missingDimensionItems = missingDimensionItems;
    }

    public List<String> getFitConstraintViolations() {
        return fitConstraintViolations;
    }

    public void setFitConstraintViolations(List<String> fitConstraintViolations) {
        this.fitConstraintViolations = fitConstraintViolations;
    }
}
