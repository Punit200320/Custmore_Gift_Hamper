package com.surrealtreasures.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Item specification for a Corporate Quotation Hamper combination.
 */
public class CorporateQuoteItemRequestDTO {

    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotNull(message = "Quantity per hamper is required")
    @Min(value = 1, message = "Quantity per hamper must be at least 1")
    private Integer quantityPerHamper = 1;

    public CorporateQuoteItemRequestDTO() {
    }

    public CorporateQuoteItemRequestDTO(String productId, Integer quantityPerHamper) {
        this.productId = productId;
        this.quantityPerHamper = quantityPerHamper != null && quantityPerHamper > 0 ? quantityPerHamper : 1;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Integer getQuantityPerHamper() {
        return quantityPerHamper;
    }

    public void setQuantityPerHamper(Integer quantityPerHamper) {
        this.quantityPerHamper = quantityPerHamper;
    }
}
