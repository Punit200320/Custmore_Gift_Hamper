package com.surrealtreasures.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for Corporate Bulk-Order Quotation and Margin Estimation.
 */
public class CorporateQuotationRequestDTO {

    @NotBlank(message = "Company name or reference is required")
    private String companyName;

    @NotNull(message = "Quantity of hampers is required")
    @Min(value = 1, message = "Quantity of hampers must be at least 1")
    private Integer quantity;

    @DecimalMin(value = "0.01", message = "Budget per hamper must be greater than zero")
    private BigDecimal budgetPerHamper;

    @DecimalMin(value = "0.01", message = "Total budget must be greater than zero")
    private BigDecimal totalBudget;

    private String occasion;           // e.g. "Diwali Corporate Gifting", "Annual Leadership Gala"
    private String recipientProfile;   // e.g. "Key Clients", "Executive Team", "Employees"
    private String skinType;           // e.g. "All", "Sensitive", "Dry"

    private List<String> allergies = new ArrayList<>();
    private List<String> ingredientRestrictions = new ArrayList<>();

    private String selectedHamperTier; // e.g. "LOW", "MEDIUM", "HIGH"
    private List<CorporateQuoteItemRequestDTO> items = new ArrayList<>();
    private List<String> selectedProductIds = new ArrayList<>();

    private String packagingOptionId;
    private String packagingOptionName;
    private BigDecimal packagingPrice = new BigDecimal("150.00"); // Customer retail charge for packaging
    private BigDecimal packagingCost = new BigDecimal("60.00");   // Actual business cost for packaging

    private BigDecimal otherConfiguredCosts = BigDecimal.ZERO;    // Optional custom card/branding costs per hamper
    private BigDecimal otherConfiguredSellingPrice = BigDecimal.ZERO; // Optional custom branding charge per hamper

    public CorporateQuotationRequestDTO() {
    }

    public CorporateQuotationRequestDTO(String companyName, Integer quantity, BigDecimal budgetPerHamper) {
        this.companyName = companyName;
        this.quantity = quantity;
        this.budgetPerHamper = budgetPerHamper;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies != null ? allergies : new ArrayList<>();
    }

    public List<String> getIngredientRestrictions() {
        return ingredientRestrictions;
    }

    public void setIngredientRestrictions(List<String> ingredientRestrictions) {
        this.ingredientRestrictions = ingredientRestrictions != null ? ingredientRestrictions : new ArrayList<>();
    }

    public String getSelectedHamperTier() {
        return selectedHamperTier;
    }

    public void setSelectedHamperTier(String selectedHamperTier) {
        this.selectedHamperTier = selectedHamperTier;
    }

    public List<CorporateQuoteItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(List<CorporateQuoteItemRequestDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<String> getSelectedProductIds() {
        return selectedProductIds;
    }

    public void setSelectedProductIds(List<String> selectedProductIds) {
        this.selectedProductIds = selectedProductIds != null ? selectedProductIds : new ArrayList<>();
    }

    public String getPackagingOptionId() {
        return packagingOptionId;
    }

    public void setPackagingOptionId(String packagingOptionId) {
        this.packagingOptionId = packagingOptionId;
    }

    public String getPackagingOptionName() {
        return packagingOptionName;
    }

    public void setPackagingOptionName(String packagingOptionName) {
        this.packagingOptionName = packagingOptionName;
    }

    public BigDecimal getPackagingPrice() {
        return packagingPrice;
    }

    public void setPackagingPrice(BigDecimal packagingPrice) {
        this.packagingPrice = packagingPrice;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost;
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }

    public BigDecimal getOtherConfiguredCosts() {
        return otherConfiguredCosts;
    }

    public void setOtherConfiguredCosts(BigDecimal otherConfiguredCosts) {
        this.otherConfiguredCosts = otherConfiguredCosts;
    }

    public BigDecimal getOtherConfiguredSellingPrice() {
        return otherConfiguredSellingPrice;
    }

    public void setOtherConfiguredSellingPrice(BigDecimal otherConfiguredSellingPrice) {
        this.otherConfiguredSellingPrice = otherConfiguredSellingPrice;
    }
}
