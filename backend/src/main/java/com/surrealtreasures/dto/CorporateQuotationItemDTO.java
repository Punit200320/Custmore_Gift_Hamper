package com.surrealtreasures.dto;

import com.surrealtreasures.entity.IngredientVerificationStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Item breakdown within a Corporate Quotation.
 * Stores both retail selling price and recorded unit cost snapshots.
 */
public class CorporateQuotationItemDTO {

    private String productId;
    private String productName;
    private String category;
    private BigDecimal unitRetailPrice;
    private BigDecimal unitCost;
    private Integer quantityPerHamper;
    private Integer totalQuantityRequired;
    private BigDecimal totalRetailSubtotal;
    private BigDecimal totalCostSubtotal;
    private Integer availableStock;
    private Boolean stockSufficient;
    private IngredientVerificationStatus ingredientVerificationStatus;
    private List<String> declaredAllergens = new ArrayList<>();
    private Boolean costRecorded;

    public CorporateQuotationItemDTO() {
    }

    public CorporateQuotationItemDTO(String productId, String productName, String category,
                                     BigDecimal unitRetailPrice, BigDecimal unitCost,
                                     Integer quantityPerHamper, Integer totalQuantityRequired,
                                     BigDecimal totalRetailSubtotal, BigDecimal totalCostSubtotal,
                                     Integer availableStock, Boolean stockSufficient,
                                     IngredientVerificationStatus ingredientVerificationStatus,
                                     List<String> declaredAllergens, Boolean costRecorded) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.unitRetailPrice = unitRetailPrice;
        this.unitCost = unitCost;
        this.quantityPerHamper = quantityPerHamper;
        this.totalQuantityRequired = totalQuantityRequired;
        this.totalRetailSubtotal = totalRetailSubtotal;
        this.totalCostSubtotal = totalCostSubtotal;
        this.availableStock = availableStock;
        this.stockSufficient = stockSufficient;
        this.ingredientVerificationStatus = ingredientVerificationStatus;
        this.declaredAllergens = declaredAllergens != null ? declaredAllergens : new ArrayList<>();
        this.costRecorded = costRecorded;
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

    public BigDecimal getUnitRetailPrice() {
        return unitRetailPrice;
    }

    public void setUnitRetailPrice(BigDecimal unitRetailPrice) {
        this.unitRetailPrice = unitRetailPrice;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public Integer getQuantityPerHamper() {
        return quantityPerHamper;
    }

    public void setQuantityPerHamper(Integer quantityPerHamper) {
        this.quantityPerHamper = quantityPerHamper;
    }

    public Integer getTotalQuantityRequired() {
        return totalQuantityRequired;
    }

    public void setTotalQuantityRequired(Integer totalQuantityRequired) {
        this.totalQuantityRequired = totalQuantityRequired;
    }

    public BigDecimal getTotalRetailSubtotal() {
        return totalRetailSubtotal;
    }

    public void setTotalRetailSubtotal(BigDecimal totalRetailSubtotal) {
        this.totalRetailSubtotal = totalRetailSubtotal;
    }

    public BigDecimal getTotalCostSubtotal() {
        return totalCostSubtotal;
    }

    public void setTotalCostSubtotal(BigDecimal totalCostSubtotal) {
        this.totalCostSubtotal = totalCostSubtotal;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    public Boolean getStockSufficient() {
        return stockSufficient;
    }

    public void setStockSufficient(Boolean stockSufficient) {
        this.stockSufficient = stockSufficient;
    }

    public IngredientVerificationStatus getIngredientVerificationStatus() {
        return ingredientVerificationStatus;
    }

    public void setIngredientVerificationStatus(IngredientVerificationStatus ingredientVerificationStatus) {
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }

    public List<String> getDeclaredAllergens() {
        return declaredAllergens;
    }

    public void setDeclaredAllergens(List<String> declaredAllergens) {
        this.declaredAllergens = declaredAllergens;
    }

    public Boolean getCostRecorded() {
        return costRecorded;
    }

    public void setCostRecorded(Boolean costRecorded) {
        this.costRecorded = costRecorded;
    }
}
