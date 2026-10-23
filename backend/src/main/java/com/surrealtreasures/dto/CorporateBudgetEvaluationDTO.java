package com.surrealtreasures.dto;

import java.math.BigDecimal;

/**
 * Budget evaluation comparison for Corporate Bulk Quotations.
 */
public class CorporateBudgetEvaluationDTO {

    private BigDecimal budgetPerHamper;
    private BigDecimal totalBudget;
    private BigDecimal sellingPricePerHamper;
    private BigDecimal totalQuote;
    private BigDecimal budgetVariancePerHamper;   // budgetPerHamper - sellingPricePerHamper (positive = surplus, negative = deficit)
    private BigDecimal totalBudgetVariance;       // totalBudget - totalQuote
    private Boolean withinBudget;

    public CorporateBudgetEvaluationDTO() {
    }

    public CorporateBudgetEvaluationDTO(BigDecimal budgetPerHamper, BigDecimal totalBudget,
                                       BigDecimal sellingPricePerHamper, BigDecimal totalQuote,
                                       BigDecimal budgetVariancePerHamper, BigDecimal totalBudgetVariance,
                                       Boolean withinBudget) {
        this.budgetPerHamper = budgetPerHamper;
        this.totalBudget = totalBudget;
        this.sellingPricePerHamper = sellingPricePerHamper;
        this.totalQuote = totalQuote;
        this.budgetVariancePerHamper = budgetVariancePerHamper;
        this.totalBudgetVariance = totalBudgetVariance;
        this.withinBudget = withinBudget;
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

    public BigDecimal getTotalQuote() {
        return totalQuote;
    }

    public void setTotalQuote(BigDecimal totalQuote) {
        this.totalQuote = totalQuote;
    }

    public BigDecimal getBudgetVariancePerHamper() {
        return budgetVariancePerHamper;
    }

    public void setBudgetVariancePerHamper(BigDecimal budgetVariancePerHamper) {
        this.budgetVariancePerHamper = budgetVariancePerHamper;
    }

    public BigDecimal getTotalBudgetVariance() {
        return totalBudgetVariance;
    }

    public void setTotalBudgetVariance(BigDecimal totalBudgetVariance) {
        this.totalBudgetVariance = totalBudgetVariance;
    }

    public Boolean getWithinBudget() {
        return withinBudget;
    }

    public void setWithinBudget(Boolean withinBudget) {
        this.withinBudget = withinBudget;
    }
}
