package com.surrealtreasures.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Allergen restrictions and safety warnings summary for warehouse packing slip.
 */
public class AllergenSafetySlipDTO {

    private List<String> recordedCustomerAllergens = new ArrayList<>();
    private List<String> productAllergenWarnings = new ArrayList<>();
    private List<String> crossContaminationWarnings = new ArrayList<>();
    private String safetyAuditStatus; // e.g. "VERIFIED_SAFE", "ALLERGEN_RESTRICTIONS_ACTIVE"

    public AllergenSafetySlipDTO() {
    }

    public AllergenSafetySlipDTO(List<String> recordedCustomerAllergens, List<String> productAllergenWarnings,
                                 List<String> crossContaminationWarnings, String safetyAuditStatus) {
        this.recordedCustomerAllergens = recordedCustomerAllergens != null ? recordedCustomerAllergens : new ArrayList<>();
        this.productAllergenWarnings = productAllergenWarnings != null ? productAllergenWarnings : new ArrayList<>();
        this.crossContaminationWarnings = crossContaminationWarnings != null ? crossContaminationWarnings : new ArrayList<>();
        this.safetyAuditStatus = safetyAuditStatus;
    }

    public List<String> getRecordedCustomerAllergens() {
        return recordedCustomerAllergens;
    }

    public void setRecordedCustomerAllergens(List<String> recordedCustomerAllergens) {
        this.recordedCustomerAllergens = recordedCustomerAllergens;
    }

    public List<String> getProductAllergenWarnings() {
        return productAllergenWarnings;
    }

    public void setProductAllergenWarnings(List<String> productAllergenWarnings) {
        this.productAllergenWarnings = productAllergenWarnings;
    }

    public List<String> getCrossContaminationWarnings() {
        return crossContaminationWarnings;
    }

    public void setCrossContaminationWarnings(List<String> crossContaminationWarnings) {
        this.crossContaminationWarnings = crossContaminationWarnings;
    }

    public String getSafetyAuditStatus() {
        return safetyAuditStatus;
    }

    public void setSafetyAuditStatus(String safetyAuditStatus) {
        this.safetyAuditStatus = safetyAuditStatus;
    }
}
