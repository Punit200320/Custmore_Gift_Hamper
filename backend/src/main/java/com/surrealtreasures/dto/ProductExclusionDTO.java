package com.surrealtreasures.dto;

public class ProductExclusionDTO {

    private String productId;
    private String productName;
    private String exclusionCategory;
    private String reason;

    public ProductExclusionDTO() {
    }

    public ProductExclusionDTO(String productId, String productName, String exclusionCategory, String reason) {
        this.productId = productId;
        this.productName = productName;
        this.exclusionCategory = exclusionCategory;
        this.reason = reason;
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
}
