package com.surrealtreasures.dto;

import com.surrealtreasures.entity.IngredientVerificationStatus;
import com.surrealtreasures.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Structured DTO exposing complete Product Transparency information.
 * Discloses verified facts, explicit unverified/unknown fields, and safety boundaries.
 */
public class ProductTransparencyDTO {

    private String id;
    private String name;
    private String description;
    private String category;
    private BigDecimal retailPrice;
    private Integer availableStock;
    private Boolean handmade;

    // Formulation & Safety Disclosures
    private List<String> ingredients = new ArrayList<>();
    private List<String> declaredAllergens = new ArrayList<>();
    private Set<String> skinTypeSuitability = new HashSet<>();
    private IngredientVerificationStatus ingredientVerificationStatus;
    private LocalDate lastVerificationDate;
    private String packagingInfo;
    private String crossContaminationWarning;
    private String imageUrl;

    // Transparency Breakdown (Requirement 3: verified vs unknown/unverified)
    private List<String> verifiedFields = new ArrayList<>();
    private List<String> unverifiedOrUnknownFields = new ArrayList<>();
    private String allergenSafetyStatement;
    private Boolean safeForCustomerAllergies; // When evaluated in context of customer restrictions

    public ProductTransparencyDTO() {
    }

    public static ProductTransparencyDTO fromEntity(Product product) {
        ProductTransparencyDTO dto = new ProductTransparencyDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setRetailPrice(product.getRetailPrice());
        dto.setAvailableStock(product.getStockQuantity());
        dto.setHandmade(product.getHandmade());
        dto.setImageUrl(product.getImageUrl());

        dto.setIngredients(product.getIngredients() != null ? product.getIngredients() : new ArrayList<>());
        dto.setDeclaredAllergens(product.getDeclaredAllergens() != null ? product.getDeclaredAllergens() : new ArrayList<>());
        dto.setSkinTypeSuitability(product.getSkinTypes() != null ? product.getSkinTypes() : new HashSet<>());
        dto.setIngredientVerificationStatus(product.getIngredientVerificationStatus());
        dto.setLastVerificationDate(product.getLastVerificationDate());
        dto.setPackagingInfo(product.getPackagingInfo());
        dto.setCrossContaminationWarning(product.getCrossContaminationWarning());

        // Build verified vs unknown fields
        List<String> verified = new ArrayList<>();
        List<String> unknown = new ArrayList<>();

        if (product.getName() != null) verified.add("name");
        if (product.getRetailPrice() != null) verified.add("retailPrice");
        if (product.getStockQuantity() != null) verified.add("availableStock");
        if (product.getHandmade() != null) verified.add("handmade");

        if (product.getIngredientVerificationStatus() == IngredientVerificationStatus.VERIFIED) {
            verified.add("ingredients");
            verified.add("declaredAllergens");
            if (product.getLastVerificationDate() != null) {
                verified.add("lastVerificationDate");
            } else {
                unknown.add("lastVerificationDate");
            }
        } else {
            unknown.add("ingredients");
            unknown.add("declaredAllergens");
            unknown.add("lastVerificationDate");
        }

        if (product.getSkinTypes() != null && !product.getSkinTypes().isEmpty()) {
            verified.add("skinTypeSuitability");
        } else {
            unknown.add("skinTypeSuitability");
        }

        if (product.getPackagingInfo() != null && !product.getPackagingInfo().trim().isEmpty()) {
            verified.add("packagingInfo");
        } else {
            unknown.add("packagingInfo");
        }

        if (product.getCrossContaminationWarning() != null && !product.getCrossContaminationWarning().trim().isEmpty()) {
            verified.add("crossContaminationWarning");
        } else {
            unknown.add("crossContaminationWarning");
        }

        dto.setVerifiedFields(verified);
        dto.setUnverifiedOrUnknownFields(unknown);

        // Safety statement
        if (product.getIngredientVerificationStatus() == IngredientVerificationStatus.VERIFIED) {
            dto.setAllergenSafetyStatement("Catalogue ingredients and declared allergens are verified against small-batch artisan batch records.");
        } else {
            dto.setAllergenSafetyStatement("Ingredients have not completed laboratory verification. Under conservative policy, this product cannot be guaranteed allergen-safe.");
        }

        return dto;
    }

    // Getters and Setters

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    public Boolean getHandmade() {
        return handmade;
    }

    public void setHandmade(Boolean handmade) {
        this.handmade = handmade;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getDeclaredAllergens() {
        return declaredAllergens;
    }

    public void setDeclaredAllergens(List<String> declaredAllergens) {
        this.declaredAllergens = declaredAllergens;
    }

    public Set<String> getSkinTypeSuitability() {
        return skinTypeSuitability;
    }

    public void setSkinTypeSuitability(Set<String> skinTypeSuitability) {
        this.skinTypeSuitability = skinTypeSuitability;
    }

    public IngredientVerificationStatus getIngredientVerificationStatus() {
        return ingredientVerificationStatus;
    }

    public void setIngredientVerificationStatus(IngredientVerificationStatus ingredientVerificationStatus) {
        this.ingredientVerificationStatus = ingredientVerificationStatus;
    }

    public LocalDate getLastVerificationDate() {
        return lastVerificationDate;
    }

    public void setLastVerificationDate(LocalDate lastVerificationDate) {
        this.lastVerificationDate = lastVerificationDate;
    }

    public String getPackagingInfo() {
        return packagingInfo;
    }

    public void setPackagingInfo(String packagingInfo) {
        this.packagingInfo = packagingInfo;
    }

    public String getCrossContaminationWarning() {
        return crossContaminationWarning;
    }

    public void setCrossContaminationWarning(String crossContaminationWarning) {
        this.crossContaminationWarning = crossContaminationWarning;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getVerifiedFields() {
        return verifiedFields;
    }

    public void setVerifiedFields(List<String> verifiedFields) {
        this.verifiedFields = verifiedFields;
    }

    public List<String> getUnverifiedOrUnknownFields() {
        return unverifiedOrUnknownFields;
    }

    public void setUnverifiedOrUnknownFields(List<String> unverifiedOrUnknownFields) {
        this.unverifiedOrUnknownFields = unverifiedOrUnknownFields;
    }

    public String getAllergenSafetyStatement() {
        return allergenSafetyStatement;
    }

    public void setAllergenSafetyStatement(String allergenSafetyStatement) {
        this.allergenSafetyStatement = allergenSafetyStatement;
    }

    public Boolean getSafeForCustomerAllergies() {
        return safeForCustomerAllergies;
    }

    public void setSafeForCustomerAllergies(Boolean safeForCustomerAllergies) {
        this.safeForCustomerAllergies = safeForCustomerAllergies;
    }
}
