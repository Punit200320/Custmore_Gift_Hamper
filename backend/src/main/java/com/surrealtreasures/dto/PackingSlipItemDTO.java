package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Line item on a warehouse packing slip.
 * Includes sequence number, product details, quantity, dimensions,
 * grounded packing instructions, allergen warnings, and cost breakdown.
 */
public class PackingSlipItemDTO {

    private Integer sequenceNumber;
    private String productId;
    private String productName;
    private String category;
    private Integer quantity;
    private ItemDimensionsDTO dimensions;
    private String recordedPackagingInfo;
    private String packingInstructions;
    private List<String> declaredAllergens = new ArrayList<>();
    private String allergenWarnings;
    private BigDecimal unitRetailPrice;
    private BigDecimal totalRetailPrice;
    private BigDecimal unitCost;
    private BigDecimal totalCost;
    private String ingredientVerificationStatus;

    public PackingSlipItemDTO() {
    }

    public PackingSlipItemDTO(Integer sequenceNumber, String productId, String productName,
                              String category, Integer quantity, ItemDimensionsDTO dimensions,
                              String recordedPackagingInfo, String packingInstructions,
                              List<String> declaredAllergens, String allergenWarnings,
                              BigDecimal unitRetailPrice, BigDecimal totalRetailPrice,
                              BigDecimal unitCost, BigDecimal totalCost,
                              String ingredientVerificationStatus) {
        this.sequenceNumber = sequenceNumber;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.quantity = quantity;
        this.dimensions = dimensions;
        this.recordedPackagingInfo = recordedPackagingInfo;
        this.packingInstructions = packingInstructions;
        this.declaredAllergens = declaredAllergens != null ? declaredAllergens : new ArrayList<>();
        this.allergenWarnings = allergenWarnings;
        this.unitRetailPrice = unitRetailPrice;
        this.totalRetailPrice = totalRetailPrice;
        this.unitCost = unitCost;
        this.totalCost = totalCost;
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }

    // Getters and Setters

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
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

    public ItemDimensionsDTO getDimensions() {
        return dimensions;
    }

    public void setDimensions(ItemDimensionsDTO dimensions) {
        this.dimensions = dimensions;
    }

    public String getRecordedPackagingInfo() {
        return recordedPackagingInfo;
    }

    public void setRecordedPackagingInfo(String recordedPackagingInfo) {
        this.recordedPackagingInfo = recordedPackagingInfo;
    }

    public String getPackingInstructions() {
        return packingInstructions;
    }

    public void setPackingInstructions(String packingInstructions) {
        this.packingInstructions = packingInstructions;
    }

    public List<String> getDeclaredAllergens() {
        return declaredAllergens;
    }

    public void setDeclaredAllergens(List<String> declaredAllergens) {
        this.declaredAllergens = declaredAllergens;
    }

    public String getAllergenWarnings() {
        return allergenWarnings;
    }

    public void setAllergenWarnings(String allergenWarnings) {
        this.allergenWarnings = allergenWarnings;
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

    public String getIngredientVerificationStatus() {
        return ingredientVerificationStatus;
    }

    public void setIngredientVerificationStatus(String ingredientVerificationStatus) {
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }
}
