package com.surrealtreasures.dto;

public class ProductExclusionExplanationDTO {

    private String productId;
    private String productName;
    private boolean eligible;
    private String exclusionCategory;          // e.g. "ALLERGEN_CONFLICT", "UNVERIFIED_INGREDIENTS", "SKIN_TYPE_INCOMPATIBLE", "OUT_OF_STOCK", "INACTIVE", "BUDGET_EXCEEDED"
    private String reason;
    private String conflictingRestriction;    // Specific recorded allergen or ingredient that caused conflict
    private ProductTransparencyDTO transparency;

    public ProductExclusionExplanationDTO() {
    }

    public ProductExclusionExplanationDTO(String productId, String productName, boolean eligible,
                                         String exclusionCategory, String reason,
                                         String conflictingRestriction, ProductTransparencyDTO transparency) {
        this.productId = productId;
        this.productName = productName;
        this.eligible = eligible;
        this.exclusionCategory = exclusionCategory;
        this.reason = reason;
        this.conflictingRestriction = conflictingRestriction;
        this.transparency = transparency;
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

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public String getExclusionCategory() {
        return exclusionCategory;
    }

    public void setExclusionCategory(String exclusionCategory) {
        this.exclusionCategory = exclusionCategory;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getConflictingRestriction() {
        return conflictingRestriction;
    }

    public void setConflictingRestriction(String conflictingRestriction) {
        this.conflictingRestriction = conflictingRestriction;
    }

    public ProductTransparencyDTO getTransparency() {
        return transparency;
    }

    public void setTransparency(ProductTransparencyDTO transparency) {
        this.transparency = transparency;
    }
}
