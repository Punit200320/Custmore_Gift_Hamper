package com.surrealtreasures.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Product Entity for Surreal Treasures Gifting & Skincare Catalogue.
 * Uses BigDecimal for all monetary values as per financial standards.
 * Stores comprehensive product transparency and allergen audit trail data.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 50)
    private String id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = true)
    @Column(name = "retail_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal retailPrice;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = true)
    @Column(name = "unit_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitCost;

    @Column(name = "packaging_cost_contribution", precision = 10, scale = 2)
    private BigDecimal packagingCostContribution = BigDecimal.ZERO;

    @NotNull
    @Min(0)
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_skin_types", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "skin_type")
    private Set<String> skinTypes = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_ingredients", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "ingredient")
    private List<String> ingredients = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_declared_allergens", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "declared_allergen")
    private List<String> declaredAllergens = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "ingredient_verification_status", nullable = false)
    private IngredientVerificationStatus ingredientVerificationStatus = IngredientVerificationStatus.UNVERIFIED;

    @Column(name = "last_verification_date")
    private LocalDate lastVerificationDate;

    @Column(name = "packaging_info")
    private String packagingInfo;

    @Column(name = "cross_contamination_warning", columnDefinition = "TEXT")
    private String crossContaminationWarning;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean handmade = true;

    @Column(name = "image_url")
    private String imageUrl;

    public Product() {
    }

    public Product(String id, String name, String description, String category,
                   BigDecimal retailPrice, BigDecimal unitCost, BigDecimal packagingCostContribution,
                   Integer stockQuantity, Set<String> skinTypes, List<String> ingredients,
                   List<String> declaredAllergens, IngredientVerificationStatus ingredientVerificationStatus,
                   Boolean active, Boolean handmade, String imageUrl) {
        this(id, name, description, category, retailPrice, unitCost, packagingCostContribution,
             stockQuantity, skinTypes, ingredients, declaredAllergens, ingredientVerificationStatus,
             null, null, null, active, handmade, imageUrl);
    }

    public Product(String id, String name, String description, String category,
                   BigDecimal retailPrice, BigDecimal unitCost, BigDecimal packagingCostContribution,
                   Integer stockQuantity, Set<String> skinTypes, List<String> ingredients,
                   List<String> declaredAllergens, IngredientVerificationStatus ingredientVerificationStatus,
                   LocalDate lastVerificationDate, String packagingInfo, String crossContaminationWarning,
                   Boolean active, Boolean handmade, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.retailPrice = retailPrice;
        this.unitCost = unitCost;
        this.packagingCostContribution = packagingCostContribution != null ? packagingCostContribution : BigDecimal.ZERO;
        this.stockQuantity = stockQuantity != null ? stockQuantity : 0;
        this.skinTypes = skinTypes != null ? skinTypes : new HashSet<>();
        this.ingredients = ingredients != null ? ingredients : new ArrayList<>();
        this.declaredAllergens = declaredAllergens != null ? declaredAllergens : new ArrayList<>();
        this.ingredientVerificationStatus = ingredientVerificationStatus != null ? ingredientVerificationStatus : IngredientVerificationStatus.UNVERIFIED;
        this.lastVerificationDate = lastVerificationDate;
        this.packagingInfo = packagingInfo;
        this.crossContaminationWarning = crossContaminationWarning;
        this.active = active != null ? active : true;
        this.handmade = handmade != null ? handmade : true;
        this.imageUrl = imageUrl;
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

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getPackagingCostContribution() {
        return packagingCostContribution != null ? packagingCostContribution : BigDecimal.ZERO;
    }

    public void setPackagingCostContribution(BigDecimal packagingCostContribution) {
        this.packagingCostContribution = packagingCostContribution;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Set<String> getSkinTypes() {
        return skinTypes;
    }

    public void setSkinTypes(Set<String> skinTypes) {
        this.skinTypes = skinTypes;
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

    public Boolean getActive() {
        return active != null ? active : true;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getHandmade() {
        return handmade != null ? handmade : true;
    }

    public void setHandmade(Boolean handmade) {
        this.handmade = handmade;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
