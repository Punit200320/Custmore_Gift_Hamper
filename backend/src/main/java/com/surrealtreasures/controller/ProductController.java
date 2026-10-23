package com.surrealtreasures.controller;

import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.ProductExclusionExplanationDTO;
import com.surrealtreasures.dto.ProductTransparencyDTO;
import com.surrealtreasures.service.HamperRecommendationService;
import com.surrealtreasures.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller exposing Product Transparency and Verification Details.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final HamperRecommendationService recommendationService;

    public ProductController(ProductService productService, HamperRecommendationService recommendationService) {
        this.productService = productService;
        this.recommendationService = recommendationService;
    }

    /**
     * GET /api/products: Lists all products with complete transparency breakdown.
     * Optional filter by category or skinType.
     */
    @GetMapping
    public ResponseEntity<List<ProductTransparencyDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String skinType) {
        List<ProductTransparencyDTO> products;
        if (category != null && !category.trim().isEmpty()) {
            products = productService.getProductTransparencyByCategory(category);
        } else {
            products = productService.getAllProductTransparency();
        }

        if (skinType != null && !skinType.trim().isEmpty()) {
            String normSkin = skinType.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> p.getSkinTypeSuitability().stream()
                            .anyMatch(s -> s.equalsIgnoreCase("All") || s.equalsIgnoreCase(normSkin)))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}: Returns complete transparency details for a specific product.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductTransparencyDTO> getProductById(@PathVariable String id) {
        return productService.getProductTransparencyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/products/{id}/explain-eligibility: Diagnostic endpoint explaining why
     * a specific product is eligible or excluded under customer constraints.
     */
    @PostMapping("/{id}/explain-eligibility")
    public ResponseEntity<ProductExclusionExplanationDTO> explainProductEligibility(
            @PathVariable String id,
            @RequestBody CustomerRequirementsDTO request) {
        return recommendationService.explainProductEligibility(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
