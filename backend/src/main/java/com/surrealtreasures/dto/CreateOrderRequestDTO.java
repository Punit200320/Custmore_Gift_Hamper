package com.surrealtreasures.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Request payload for creating an order from a confirmed hamper selection
 * or accepted corporate quotation.
 */
public class CreateOrderRequestDTO {

    private String orderReference;

    private String quotationId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Valid customer email is required")
    private String customerEmail;

    private String recipientName;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String boxSize; // e.g. "Petite", "Classic", "Deluxe", "Grand"

    private String packagingOption; // e.g. "Handcrafted Pine Wood Keepsake Chest"

    private BigDecimal packagingRetailPrice;

    private BigDecimal packagingCost;

    private BigDecimal customerBudget;

    private List<String> allergies = new ArrayList<>();

    private List<String> excludedIngredients = new ArrayList<>();

    private String fulfilmentNotes;

    @Valid
    private List<OrderItemRequestDTO> items = new ArrayList<>();

    public CreateOrderRequestDTO() {
    }

    public CreateOrderRequestDTO(String customerName, String customerEmail, String deliveryAddress,
                                 String boxSize, String packagingOption, List<OrderItemRequestDTO> items) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.deliveryAddress = deliveryAddress;
        this.boxSize = boxSize;
        this.packagingOption = packagingOption;
        this.items = items != null ? items : new ArrayList<>();
    }

    // Getters and Setters

    public String getOrderReference() {
        return orderReference;
    }

    public void setOrderReference(String orderReference) {
        this.orderReference = orderReference;
    }

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getBoxSize() {
        return boxSize;
    }

    public void setBoxSize(String boxSize) {
        this.boxSize = boxSize;
    }

    public String getPackagingOption() {
        return packagingOption;
    }

    public void setPackagingOption(String packagingOption) {
        this.packagingOption = packagingOption;
    }

    public BigDecimal getPackagingRetailPrice() {
        return packagingRetailPrice;
    }

    public void setPackagingRetailPrice(BigDecimal packagingRetailPrice) {
        this.packagingRetailPrice = packagingRetailPrice;
    }

    public BigDecimal getPackagingCost() {
        return packagingCost;
    }

    public void setPackagingCost(BigDecimal packagingCost) {
        this.packagingCost = packagingCost;
    }

    public BigDecimal getCustomerBudget() {
        return customerBudget;
    }

    public void setCustomerBudget(BigDecimal customerBudget) {
        this.customerBudget = customerBudget;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getExcludedIngredients() {
        return excludedIngredients;
    }

    public void setExcludedIngredients(List<String> excludedIngredients) {
        this.excludedIngredients = excludedIngredients;
    }

    public String getFulfilmentNotes() {
        return fulfilmentNotes;
    }

    public void setFulfilmentNotes(String fulfilmentNotes) {
        this.fulfilmentNotes = fulfilmentNotes;
    }

    public List<OrderItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequestDTO> items) {
        this.items = items;
    }
}
