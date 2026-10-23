package com.surrealtreasures.dto;

/**
 * Details of the selected box, packaging option, box dimensions and physical fit verification.
 */
public class BoxPackingDetailsDTO {

    private String selectedBoxSize;
    private String packagingOption;
    private BoxDimensionsDTO boxDimensions;
    private DimensionFitValidationDTO dimensionFitValidation;

    public BoxPackingDetailsDTO() {
    }

    public BoxPackingDetailsDTO(String selectedBoxSize, String packagingOption,
                                BoxDimensionsDTO boxDimensions, DimensionFitValidationDTO dimensionFitValidation) {
        this.selectedBoxSize = selectedBoxSize;
        this.packagingOption = packagingOption;
        this.boxDimensions = boxDimensions;
        this.dimensionFitValidation = dimensionFitValidation;
    }

    public String getSelectedBoxSize() {
        return selectedBoxSize;
    }

    public void setSelectedBoxSize(String selectedBoxSize) {
        this.selectedBoxSize = selectedBoxSize;
    }

    public String getPackagingOption() {
        return packagingOption;
    }

    public void setPackagingOption(String packagingOption) {
        this.packagingOption = packagingOption;
    }

    public BoxDimensionsDTO getBoxDimensions() {
        return boxDimensions;
    }

    public void setBoxDimensions(BoxDimensionsDTO boxDimensions) {
        this.boxDimensions = boxDimensions;
    }

    public DimensionFitValidationDTO getDimensionFitValidation() {
        return dimensionFitValidation;
    }

    public void setDimensionFitValidation(DimensionFitValidationDTO dimensionFitValidation) {
        this.dimensionFitValidation = dimensionFitValidation;
    }
}
