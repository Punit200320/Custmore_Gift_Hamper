package com.surrealtreasures.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Full Response DTO for a Corporate Bulk-Order Quotation.
 * Provides complete per-hamper and total pricing, recorded costs, margin estimate,
 * bulk inventory validation, warnings, and quotation fulfillment status.
 */
public class CorporateQuotationResponseDTO {

    private String quoteId;
    private String companyName;
    private String status;               // CONFIRMED, INCOMPLETE_ESTIMATE, REJECTED_INSUFFICIENT_STOCK, REJECTED_BUDGET_EXCEEDED, REJECTED_ALLERGEN_RESTRICTION
    private String statusMessage;
    private Boolean fulfillable;
    private Integer requestedQuantity;
    private String occasion;
    private String recipientProfile;

    private CorporatePricingBreakdownDTO pricingBreakdown;
    private CorporateBudgetEvaluationDTO budgetEvaluation;

    private List<CorporateQuotationItemDTO> items = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private List<String> missingCosts = new ArrayList<>();
    private List<ProductExclusionDTO> exclusions = new ArrayList<>();

    private String packagingOption;
    private LocalDateTime createdAt;
    private String disclaimer = "Estimated margin is calculated strictly from recorded master catalogue unit costs. Laboratory and batch audit verifications apply. Not a guaranteed retail margin.";

    public CorporateQuotationResponseDTO() {
    }

    public String getQuoteId() {
        return quoteId;
    }

    public void setQuoteId(String quoteId) {
        this.quoteId = quoteId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public CorporatePricingBreakdownDTO getPricingBreakdown() {
        return pricingBreakdown;
    }

    public void setPricingBreakdown(CorporatePricingBreakdownDTO pricingBreakdown) {
        this.pricingBreakdown = pricingBreakdown;
    }

    public CorporateBudgetEvaluationDTO getBudgetEvaluation() {
        return budgetEvaluation;
    }

    public void setBudgetEvaluation(CorporateBudgetEvaluationDTO budgetEvaluation) {
        this.budgetEvaluation = budgetEvaluation;
    }

    public List<CorporateQuotationItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CorporateQuotationItemDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings != null ? warnings : new ArrayList<>();
    }

    public List<String> getMissingCosts() {
        return missingCosts;
    }

    public void setMissingCosts(List<String> missingCosts) {
        this.missingCosts = missingCosts != null ? missingCosts : new ArrayList<>();
    }

    public List<ProductExclusionDTO> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<ProductExclusionDTO> exclusions) {
        this.exclusions = exclusions != null ? exclusions : new ArrayList<>();
    }

    public String getPackagingOption() {
        return packagingOption;
    }

    public void setPackagingOption(String packagingOption) {
        this.packagingOption = packagingOption;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
