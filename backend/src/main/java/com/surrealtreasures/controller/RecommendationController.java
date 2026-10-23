package com.surrealtreasures.controller;

import com.surrealtreasures.dto.CustomerRequirementsDTO;
import com.surrealtreasures.dto.HamperRecommendationResponse;
import com.surrealtreasures.service.HamperRecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Budget-Based Hamper Recommendation Engine.
 */
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*") // Permissive CORS for dev; production managed by CorsConfig
public class RecommendationController {

    private final HamperRecommendationService recommendationService;

    public RecommendationController(HamperRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Generate 3-tiered hamper recommendations (LOW, MEDIUM, HIGH)
     * based on budget, occasion, skin type, and strict allergy constraints.
     */
    @PostMapping
    public ResponseEntity<HamperRecommendationResponse> getRecommendations(
            @Valid @RequestBody CustomerRequirementsDTO request) {
        HamperRecommendationResponse response = recommendationService.generateRecommendations(request);
        return ResponseEntity.ok(response);
    }
}
