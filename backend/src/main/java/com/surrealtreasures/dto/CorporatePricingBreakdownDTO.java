package com.surrealtreasures.dto;

import java.math.BigDecimal;

/**
 * Breakdown of per-hamper and batch total pricing, recorded costs, and estimated gross margin.
 * Defined strictly as:
 * Gross Margin % = (Selling Price - Estimated Cost) / Selling Price * 100
 * Handles zero selling price safely. Uses explicit RoundingMode.HALF_UP.
 */
public class CorporatePricingBreakdownDTO {

    // Per Hamper Figures
    private BigDecimal sellingPricePerHamper;
    private BigDecimal productCostPerHamper;
    private BigDecimal packagingCostPerHamper;
    private BigDecimal packagingPricePerHamper;
    private BigDecimal otherConfiguredCostsPerHamper;
    private BigDecimal estimatedCostPerHamper;
    private BigDecimal estimatedGrossProfitPerHamper;

    // Batch Total Figures
    private BigDecimal totalQuote;                  // sellingPricePerHamper * quantity
    private BigDecimal estimatedTotalCost;           // estimatedCostPerHamper * quantity
    private BigDecimal estimatedTotalGrossProfit;    // totalQuote - estimatedTotalCost
    private BigDecimal estimatedGrossMarginPercentage; // (totalQuote - estimatedTotalCost) / totalQuote * 100

    private Boolean costsComplete;

    public CorporatePricingBreakdownDTO() {
    }

    public CorporatePricingBreakdownDTO(BigDecimal sellingPricePerHamper, BigDecimal productCostPerHamper,
                                       BigDecimal packagingCostPerHamper, BigDecimal packagingPricePerHamper,
                                       BigDecimal otherConfiguredCostsPerHamper, BigDecimal estimatedCostPerHamper,
                                       BigDecimal estimatedGrossProfitPerHamper, BigDecimal totalQuote,
                                       BigDecimal estimatedTotalCost, BigDecimal estimatedTotalGrossProfit,
                                       BigDecimal estimatedGrossMarginPercentage, Boolean costsComplete) {
        this.sellingPricePerHamper = sellingPricePerHamper;
        this.productCostPerHamper = productCostPerHamper;
        this.packagingCostPerHamper = packagingCostPerHamper;
        this.packagingPricePerHamper = packagingPricePerHamper;
        this.otherConfiguredCostsPerHamper = otherConfiguredCostsPerHamper;
        this.estimatedCostPerHamper = estimatedCostPerHamper;
        this.estimatedGrossProfitPerHamper = estimatedGrossProfitPerHamper;
        this.totalQuote = totalQuote;
        this.estimatedTotalCost = estimatedTotalCost;
        this.estimatedTotalGrossProfit = estimatedTotalGrossProfit;
        this.estimatedGrossMarginPercentage = estimatedGrossMarginPercentage;
        this.costsComplete = costsComplete;
    }

    public BigDecimal getSellingPricePerHamper() {
        return sellingPricePerHamper;
    }

    public void setSellingPricePerHamper(BigDecimal sellingPricePerHamper) {
        this.sellingPricePerHamper = sellingPricePerHamper;
    }

    public BigDecimal getProductCostPerHamper() {
        return productCostPerHamper;
    }

    public void setProductCostPerHamper(BigDecimal productCostPerHamper) {
        this.productCostPerHamper = productCostPerHamper;
    }

    public BigDecimal getPackagingCostPerHamper() {
        return packagingCostPerHamper;
    }

    public void setPackagingCostPerHamper(BigDecimal packagingCostPerHamper) {
        this.packagingCostPerHamper = packagingCostPerHamper;
    }

    public BigDecimal getPackagingPricePerHamper() {
        return packagingPricePerHamper;
    }

    public void setPackagingPricePerHamper(BigDecimal packagingPricePerHamper) {
        this.packagingPricePerHamper = packagingPricePerHamper;
    }

    public BigDecimal getOtherConfiguredCostsPerHamper() {
        return otherConfiguredCostsPerHamper;
    }

    public void setOtherConfiguredCostsPerHamper(BigDecimal otherConfiguredCostsPerHamper) {
        this.otherConfiguredCostsPerHamper = otherConfiguredCostsPerHamper;
    }

    public BigDecimal getEstimatedCostPerHamper() {
        return estimatedCostPerHamper;
    }

    public void setEstimatedCostPerHamper(BigDecimal estimatedCostPerHamper) {
        this.estimatedCostPerHamper = estimatedCostPerHamper;
    }

    public BigDecimal getEstimatedGrossProfitPerHamper() {
        return estimatedGrossProfitPerHamper;
    }

    public void setEstimatedGrossProfitPerHamper(BigDecimal estimatedGrossProfitPerHamper) {
        this.estimatedGrossProfitPerHamper = estimatedGrossProfitPerHamper;
    }

    public BigDecimal getTotalQuote() {
        return totalQuote;
    }

    public void setTotalQuote(BigDecimal totalQuote) {
        this.totalQuote = totalQuote;
    }

    public BigDecimal getEstimatedTotalCost() {
        return estimatedTotalCost;
    }

    public void setEstimatedTotalCost(BigDecimal estimatedTotalCost) {
        this.estimatedTotalCost = estimatedTotalCost;
    }

    public BigDecimal getEstimatedTotalGrossProfit() {
        return estimatedTotalGrossProfit;
    }

    public void setEstimatedTotalGrossProfit(BigDecimal estimatedTotalGrossProfit) {
        this.estimatedTotalGrossProfit = estimatedTotalGrossProfit;
    }

    public BigDecimal getEstimatedGrossMarginPercentage() {
        return estimatedGrossMarginPercentage;
    }

    public void setEstimatedGrossMarginPercentage(BigDecimal estimatedGrossMarginPercentage) {
        this.estimatedGrossMarginPercentage = estimatedGrossMarginPercentage;
    }

    public Boolean getCostsComplete() {
        return costsComplete;
    }

    public void setCostsComplete(Boolean costsComplete) {
        this.costsComplete = costsComplete;
    }
}
