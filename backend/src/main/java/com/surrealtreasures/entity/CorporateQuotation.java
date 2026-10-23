package com.surrealtreasures.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity storing immutable corporate quotation snapshots.
 * Guarantees that future product price or cost updates in the master catalogue
 * never mutate an already issued business quotation.
 */
@Entity
@Table(name = "corporate_quotations")
public class CorporateQuotation {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    @Column(length = 100)
    private String occasion;

    @Column(name = "recipient_profile", length = 100)
    private String recipientProfile;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "status_message", columnDefinition = "TEXT")
    private String statusMessage;

    @Column(nullable = false)
    private Boolean fulfillable = true;

    @Column(name = "budget_per_hamper", precision = 12, scale = 2)
    private BigDecimal budgetPerHamper;

    @Column(name = "total_budget", precision = 14, scale = 2)
    private BigDecimal totalBudget;

    @Column(name = "selling_price_per_hamper", precision = 12, scale = 2)
    private BigDecimal sellingPricePerHamper;

    @Column(name = "product_cost_per_hamper", precision = 12, scale = 2)
    private BigDecimal productCostPerHamper;

    @Column(name = "packaging_cost_per_hamper", precision = 12, scale = 2)
    private BigDecimal packagingCostPerHamper;

    @Column(name = "other_costs_per_hamper", precision = 12, scale = 2)
    private BigDecimal otherCostsPerHamper;

    @Column(name = "estimated_cost_per_hamper", precision = 12, scale = 2)
    private BigDecimal estimatedCostPerHamper;

    @Column(name = "gross_profit_per_hamper", precision = 12, scale = 2)
    private BigDecimal grossProfitPerHamper;

    @Column(name = "total_quote", precision = 14, scale = 2)
    private BigDecimal totalQuote;

    @Column(name = "estimated_total_cost", precision = 14, scale = 2)
    private BigDecimal estimatedTotalCost;

    @Column(name = "estimated_total_gross_profit", precision = 14, scale = 2)
    private BigDecimal estimatedTotalGrossProfit;

    @Column(name = "gross_margin_percentage", precision = 6, scale = 2)
    private BigDecimal grossMarginPercentage;

    @Column(name = "snapshot_json", columnDefinition = "TEXT", nullable = false)
    private String snapshotJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CorporateQuotation() {
    }

    public CorporateQuotation(String id, String companyName, Integer requestedQuantity,
                              String occasion, String recipientProfile, String status,
                              String statusMessage, Boolean fulfillable,
                              BigDecimal budgetPerHamper, BigDecimal totalBudget,
                              BigDecimal sellingPricePerHamper, BigDecimal productCostPerHamper,
                              BigDecimal packagingCostPerHamper, BigDecimal otherCostsPerHamper,
                              BigDecimal estimatedCostPerHamper, BigDecimal grossProfitPerHamper,
                              BigDecimal totalQuote, BigDecimal estimatedTotalCost,
                              BigDecimal estimatedTotalGrossProfit, BigDecimal grossMarginPercentage,
                              String snapshotJson, LocalDateTime createdAt) {
        this.id = id;
        this.companyName = companyName;
        this.requestedQuantity = requestedQuantity;
        this.occasion = occasion;
        this.recipientProfile = recipientProfile;
        this.status = status;
        this.statusMessage = statusMessage;
        this.fulfillable = fulfillable;
        this.budgetPerHamper = budgetPerHamper;
        this.totalBudget = totalBudget;
        this.sellingPricePerHamper = sellingPricePerHamper;
        this.productCostPerHamper = productCostPerHamper;
        this.packagingCostPerHamper = packagingCostPerHamper;
        this.otherCostsPerHamper = otherCostsPerHamper;
        this.estimatedCostPerHamper = estimatedCostPerHamper;
        this.grossProfitPerHamper = grossProfitPerHamper;
        this.totalQuote = totalQuote;
        this.estimatedTotalCost = estimatedTotalCost;
        this.estimatedTotalGrossProfit = estimatedTotalGrossProfit;
        this.grossMarginPercentage = grossMarginPercentage;
        this.snapshotJson = snapshotJson;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public String getRecipientProfile() {
        return recipientProfile;
    }

    public void setRecipientProfile(String recipientProfile) {
        this.recipientProfile = recipientProfile;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public Boolean getFulfillable() {
        return fulfillable;
    }

    public void setFulfillable(Boolean fulfillable) {
        this.fulfillable = fulfillable;
    }

    public BigDecimal getBudgetPerHamper() {
        return budgetPerHamper;
    }

    public void setBudgetPerHamper(BigDecimal budgetPerHamper) {
        this.budgetPerHamper = budgetPerHamper;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
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

    public BigDecimal getOtherCostsPerHamper() {
        return otherCostsPerHamper;
    }

    public void setOtherCostsPerHamper(BigDecimal otherCostsPerHamper) {
        this.otherCostsPerHamper = otherCostsPerHamper;
    }

    public BigDecimal getEstimatedCostPerHamper() {
        return estimatedCostPerHamper;
    }

    public void setEstimatedCostPerHamper(BigDecimal estimatedCostPerHamper) {
        this.estimatedCostPerHamper = estimatedCostPerHamper;
    }

    public BigDecimal getGrossProfitPerHamper() {
        return grossProfitPerHamper;
    }

    public void setGrossProfitPerHamper(BigDecimal grossProfitPerHamper) {
        this.grossProfitPerHamper = grossProfitPerHamper;
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

    public BigDecimal getGrossMarginPercentage() {
        return grossMarginPercentage;
    }

    public void setGrossMarginPercentage(BigDecimal grossMarginPercentage) {
        this.grossMarginPercentage = grossMarginPercentage;
    }

    public String getSnapshotJson() {
        return snapshotJson;
    }

    public void setSnapshotJson(String snapshotJson) {
        this.snapshotJson = snapshotJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
