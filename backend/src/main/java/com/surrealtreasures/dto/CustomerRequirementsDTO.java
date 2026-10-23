package com.surrealtreasures.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Customer Requirements DTO for Hamper Recommendation Engine.
 */
public class CustomerRequirementsDTO {

    @NotNull(message = "Maximum budget in INR is required")
    @DecimalMin(value = "100.00", message = "Maximum budget must be at least ₹100")
    private BigDecimal maxBudget;

    private String recipientRelationship; // e.g. "Best Friend", "Partner", "Mother", "Corporate"
    private String occasion;              // e.g. "Birthday", "Wedding", "Festive", "Self-Care"
    private String skinType;              // e.g. "Sensitive", "Oily", "Dry", "Combination", "Normal"

    private List<String> allergies = new ArrayList<>();
    private List<String> excludedIngredients = new ArrayList<>();
    private List<String> preferences = new ArrayList<>();

    private Integer requestedQuantity = 1;

    private BigDecimal packagingCost = new BigDecimal("150.00"); // Standard keepsake box/basket cost

    public CustomerRequirementsDTO() {
    }

    public CustomerRequirementsDTO(BigDecimal maxBudget, String recipientRelationship, String occasion,
                                   String skinType, List<String> allergies, List<String> excludedIngredients,
                                   List<String> preferences, Integer requestedQuantity) {
        this.maxBudget = maxBudget;
        this.recipientRelationship = recipientRelationship;
        this.occasion = occasion;
        this.skinType = skinType;
        this.allergies = allergies != null ? allergies : new ArrayList<>();
        this.excludedIngredients = excludedIngredients != null ? excludedIngredients : new ArrayList<>();
        this.preferences = preferences != null ? preferences : new ArrayList<>();
        this.requestedQuantity = (requestedQuantity != null && requestedQuantity > 0) ? requestedQuantity : 1;
        this.packagingCost = new BigDecimal("150.00");
    }

    public BigDecimal getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(BigDecimal maxBudget) {
        this.maxBudget = maxBudget;
    }

    public String getRecipientRelationship() {
        return recipientRelationship;
    }

    public void setRecipientRelationship(String recipientRelationship) {
        this.recipientRelationship = recipientRelationship;
    }

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    public List<String> getAllergies() {
        return allergies != null ? allergies : new ArrayList<>();
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getExcludedIngredients() {
        return excludedIngredients != null ? excludedIngredients : new ArrayList<>();
    }

    public void setExcludedIngredients(List<String> excludedIngredients) {
        this.excludedIngredients = excludedIngredients;
    }

    public List<String> getPreferences() {
        return preferences != null ? preferences : new ArrayList<>();
    }

    public void setPreferences(List<String> preferences) {
        this.preferences = preferences;
    }

    public Integer getRequestedQuantity() {
        return (requestedQuantity != null && requestedQuantity > 0) ? requestedQuantity : 1;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost != null ? packagingCost : new BigDecimal("150.00");
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }
}
