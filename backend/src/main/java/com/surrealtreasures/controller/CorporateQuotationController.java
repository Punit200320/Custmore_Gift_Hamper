package com.surrealtreasures.controller;

import com.surrealtreasures.dto.CorporateQuotationRequestDTO;
import com.surrealtreasures.dto.CorporateQuotationResponseDTO;
import com.surrealtreasures.service.CorporateQuotationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Corporate Bulk-Order Quotation and Margin Estimation.
 */
@RestController
@RequestMapping("/api/corporate/quotes")
@CrossOrigin(origins = "*")
public class CorporateQuotationController {

    private final CorporateQuotationService quotationService;

    public CorporateQuotationController(CorporateQuotationService quotationService) {
        this.quotationService = quotationService;
    }

    /**
     * Generate and persist a new corporate quotation based on real catalogue costs and inventory.
     */
    @PostMapping
    public ResponseEntity<CorporateQuotationResponseDTO> createQuotation(
            @Valid @RequestBody CorporateQuotationRequestDTO request) {
        CorporateQuotationResponseDTO response = quotationService.generateQuotation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieve an issued corporate quotation snapshot by quoteId.
     */
    @GetMapping("/{quoteId}")
    public ResponseEntity<CorporateQuotationResponseDTO> getQuotationById(
            @PathVariable String quoteId) {
        CorporateQuotationResponseDTO response = quotationService.getQuotationById(quoteId);
        return ResponseEntity.ok(response);
    }

    /**
     * List all corporate quotations, optionally filtered by company name.
     */
    @GetMapping
    public ResponseEntity<List<CorporateQuotationResponseDTO>> getAllQuotations(
            @RequestParam(required = false) String company) {
        List<CorporateQuotationResponseDTO> responses = quotationService.getAllQuotations(company);
        return ResponseEntity.ok(responses);
    }
}
