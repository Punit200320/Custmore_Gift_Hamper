package com.surrealtreasures.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HamperRecommendationResponse {

    private String status;                   // SUCCESS, PARTIAL, NO_COMBINATION_POSSIBLE
    private String message;
    private BigDecimal maxBudget;
    private Map<String, HamperTierDTO> tiers = new HashMap<>();
    private UpsellSuggestionDTO upsell;
    private List<ProductExclusionDTO> exclusions = new ArrayList<>();
    private Integer totalEligibleProductsCount = 0;
    private Integer totalExcludedProductsCount = 0;

    public HamperRecommendationResponse() {
    }

    public HamperRecommendationResponse(String status, String message, BigDecimal maxBudget,
                                        Map<String, HamperTierDTO> tiers, UpsellSuggestionDTO upsell,
                                        List<ProductExclusionDTO> exclusions,
                                        Integer totalEligibleProductsCount,
                                        Integer totalExcludedProductsCount) {
        this.status = status;
        this.message = message;
        this.maxBudget = maxBudget;
        this.tiers = tiers != null ? tiers : new HashMap<>();
        this.upsell = upsell;
        this.exclusions = exclusions != null ? exclusions : new ArrayList<>();
        this.totalEligibleProductsCount = totalEligibleProductsCount;
        this.totalExcludedProductsCount = totalExcludedProductsCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(BigDecimal maxBudget) {
        this.maxBudget = maxBudget;
    }

    public Map<String, HamperTierDTO> getTiers() {
        return tiers;
    }

    public void setTiers(Map<String, HamperTierDTO> tiers) {
        this.tiers = tiers;
    }

    public UpsellSuggestionDTO getUpsell() {
        return upsell;
    }

    public void setUpsell(UpsellSuggestionDTO upsell) {
        this.upsell = upsell;
    }

    public List<ProductExclusionDTO> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<ProductExclusionDTO> exclusions) {
        this.exclusions = exclusions;
    }

    public Integer getTotalEligibleProductsCount() {
        return totalEligibleProductsCount;
    }

    public void setTotalEligibleProductsCount(Integer totalEligibleProductsCount) {
        this.totalEligibleProductsCount = totalEligibleProductsCount;
    }

    public Integer getTotalExcludedProductsCount() {
        return totalExcludedProductsCount;
    }

    public void setTotalExcludedProductsCount(Integer totalExcludedProductsCount) {
        this.totalExcludedProductsCount = totalExcludedProductsCount;
    }
}
