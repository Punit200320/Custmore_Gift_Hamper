package com.surrealtreasures.dto;

import java.math.BigDecimal;

/**
 * Breakdown of product and packaging costs and retail prices for the warehouse slip.
 */
public class PackingSlipCostBreakdownDTO {

    private BigDecimal totalProductRetail;
    private BigDecimal packagingRetailPrice;
    private BigDecimal totalOrderRetail;
    private BigDecimal totalProductCost;
    private BigDecimal packagingCost;
    private BigDecimal totalCost;
    private boolean costBreakdownAvailable;

    public PackingSlipCostBreakdownDTO() {
    }

    public PackingSlipCostBreakdownDTO(BigDecimal totalProductRetail, BigDecimal packagingRetailPrice,
                                       BigDecimal totalOrderRetail, BigDecimal totalProductCost,
                                       BigDecimal packagingCost, BigDecimal totalCost,
                                       boolean costBreakdownAvailable) {
        this.totalProductRetail = totalProductRetail;
        this.packagingRetailPrice = packagingRetailPrice;
        this.totalOrderRetail = totalOrderRetail;
        this.totalProductCost = totalProductCost;
        this.packagingCost = packagingCost;
        this.totalCost = totalCost;
        this.costBreakdownAvailable = costBreakdownAvailable;
    }

    public BigDecimal getTotalProductRetail() {
        return totalProductRetail;
    }

    public void setTotalProductRetail(BigDecimal totalProductRetail) {
        this.totalProductRetail = totalProductRetail;
    }

    public BigDecimal getPackagingRetailPrice() {
        return packagingRetailPrice;
    }

    public void setPackagingRetailPrice(BigDecimal packagingRetailPrice) {
        this.packagingRetailPrice = packagingRetailPrice;
    }

    public BigDecimal getTotalOrderRetail() {
        return totalOrderRetail;
    }

    public void setTotalOrderRetail(BigDecimal totalOrderRetail) {
        this.totalOrderRetail = totalOrderRetail;
    }

    public BigDecimal getTotalProductCost() {
        return totalProductCost;
    }

    public void setTotalProductCost(BigDecimal totalProductCost) {
        this.totalProductCost = totalProductCost;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost;
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public boolean isCostBreakdownAvailable() {
        return costBreakdownAvailable;
    }

    public void setCostBreakdownAvailable(boolean costBreakdownAvailable) {
        this.costBreakdownAvailable = costBreakdownAvailable;
    }
}
