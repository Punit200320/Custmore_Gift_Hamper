package com.surrealtreasures.dto;

import com.surrealtreasures.entity.IngredientVerificationStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductRecommendationDTO {

    private String id;
    private String name;
    private String category;
    private BigDecimal retailPrice;
    private Integer quantity;
    private BigDecimal lineTotal;
    private Boolean handmade;
    private IngredientVerificationStatus ingredientVerificationStatus;
    private List<String> declaredAllergens;
    private String imageUrl;

    public ProductRecommendationDTO() {
    }

    public ProductRecommendationDTO(String id, String name, String category, BigDecimal retailPrice,
                                  Integer quantity, BigDecimal lineTotal, Boolean handmade,
                                  IngredientVerificationStatus ingredientVerificationStatus,
                                  List<String> declaredAllergens, String imageUrl) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.retailPrice = retailPrice;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
        this.handmade = handmade;
        this.ingredientVerificationStatus = ingredientVerificationStatus;
        this.declaredAllergens = declaredAllergens;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getRetailPrice() {
        return retailPrice;
    }

    public void setRetailPrice(BigDecimal retailPrice) {
        this.retailPrice = retailPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }

    public Boolean getHandmade() {
        return handmade;
    }

    public void setHandmade(Boolean handmade) {
        this.handmade = handmade;
    }

    public IngredientVerificationStatus getIngredientVerificationStatus() {
        return ingredientVerificationStatus;
    }

    public void setIngredientVerificationStatus(IngredientVerificationStatus ingredientVerificationStatus) {
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }

    public List<String> getDeclaredAllergens() {
        return declaredAllergens;
    }

    public void setDeclaredAllergens(List<String> declaredAllergens) {
        this.declaredAllergens = declaredAllergens;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
