package com.surrealtreasures.dto;

import java.math.BigDecimal;

public class UpsellSuggestionDTO {

    private Boolean available = false;
    private ProductRecommendationDTO suggestedProduct;
    private BigDecimal currentTotal;
    private BigDecimal newTotal;
    private BigDecimal additionalSpend;
    private String message;

    public UpsellSuggestionDTO() {
    }

    public UpsellSuggestionDTO(Boolean available, ProductRecommendationDTO suggestedProduct,
                              BigDecimal currentTotal, BigDecimal newTotal,
                              BigDecimal additionalSpend, String message) {
        this.available = available;
        this.suggestedProduct = suggestedProduct;
        this.currentTotal = currentTotal;
        this.newTotal = newTotal;
        this.additionalSpend = additionalSpend;
        this.message = message;
    }

    public static UpsellSuggestionDTO notAvailable(String reason) {
        UpsellSuggestionDTO dto = new UpsellSuggestionDTO();
        dto.setAvailable(false);
        dto.setMessage(reason);
        return dto;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public ProductRecommendationDTO getSuggestedProduct() {
        return suggestedProduct;
    }

    public void setSuggestedProduct(ProductRecommendationDTO suggestedProduct) {
        this.suggestedProduct = suggestedProduct;
    }

    public BigDecimal getCurrentTotal() {
        return currentTotal;
    }

    public void setCurrentTotal(BigDecimal currentTotal) {
        this.currentTotal = currentTotal;
    }

    public BigDecimal getNewTotal() {
        return newTotal;
    }

    public void setNewTotal(BigDecimal newTotal) {
        this.newTotal = newTotal;
    }

    public BigDecimal getAdditionalSpend() {
        return additionalSpend;
    }

    public void setAdditionalSpend(BigDecimal additionalSpend) {
        this.additionalSpend = additionalSpend;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
