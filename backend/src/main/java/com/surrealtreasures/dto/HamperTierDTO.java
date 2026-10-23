package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class HamperTierDTO {

    private String tier;                     // LOW, MEDIUM, HIGH
    private String tierName;                 // User-friendly label
    private List<ProductRecommendationDTO> products = new ArrayList<>();
    private Integer itemCount;
    private BigDecimal productSubtotal;
    private BigDecimal packagingCost;
    private BigDecimal finalTotal;
    private BigDecimal remainingBudget;
    private BigDecimal budgetUtilizationPercent;
    private String distinctReason;

    public HamperTierDTO() {
    }

    public HamperTierDTO(String tier, String tierName, List<ProductRecommendationDTO> products,
                         Integer itemCount, BigDecimal productSubtotal, BigDecimal packagingCost,
                         BigDecimal finalTotal, BigDecimal remainingBudget,
                         BigDecimal budgetUtilizationPercent, String distinctReason) {
        this.tier = tier;
        this.tierName = tierName;
        this.products = products != null ? products : new ArrayList<>();
        this.itemCount = itemCount;
        this.productSubtotal = productSubtotal;
        this.packagingCost = packagingCost;
        this.finalTotal = finalTotal;
        this.remainingBudget = remainingBudget;
        this.budgetUtilizationPercent = budgetUtilizationPercent;
        this.distinctReason = distinctReason;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getTierName() {
        return tierName;
    }

    public void setTierName(String tierName) {
        this.tierName = tierName;
    }

    public List<ProductRecommendationDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductRecommendationDTO> products) {
        this.products = products;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    public BigDecimal getProductSubtotal() {
        return productSubtotal;
    }

    public void setProductSubtotal(BigDecimal productSubtotal) {
        this.productSubtotal = productSubtotal;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost;
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }

    public BigDecimal getFinalTotal() {
        return finalTotal;
    }

    public void setFinalTotal(BigDecimal finalTotal) {
        this.finalTotal = finalTotal;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public BigDecimal getBudgetUtilizationPercent() {
        return budgetUtilizationPercent;
    }

    public void setBudgetUtilizationPercent(BigDecimal budgetUtilizationPercent) {
        this.budgetUtilizationPercent = budgetUtilizationPercent;
    }

    public String getDistinctReason() {
        return distinctReason;
    }

    public void setDistinctReason(String distinctReason) {
        this.distinctReason = distinctReason;
    }
}
