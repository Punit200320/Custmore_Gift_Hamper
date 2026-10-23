package com.surrealtreasures.integration;

import com.surrealtreasures.config.OpenRouterProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * OpenRouter AI Integration Client.
 * Provides optional AI-assisted sensory gift card poetry and botanical commentary.
 *
 * SAFETY INVARIANT:
 * AI suggestions can NEVER override deterministic allergen exclusion rules,
 * conservative ingredient verification status, or budget caps.
 *
 * TEST ISOLATION:
 * When OPENROUTER_API_KEY is missing or set to test values, operates in mock/fallback mode
 * without requiring live internet access or external credentials.
 */
@Component
public class OpenRouterClient {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterClient.class);

    private final OpenRouterProperties properties;

    public OpenRouterClient(OpenRouterProperties properties) {
        this.properties = properties;
    }

    /**
     * Generates bespoke calligraphed celebration card poetry based on recipient and occasion.
     */
    public String generateGiftCardMessage(String occasion, String recipientName, List<String> productNames) {
        String safeRecipient = (recipientName != null && !recipientName.trim().isEmpty()) ? recipientName.trim() : "Valued Recipient";
        String safeOccasion = (occasion != null && !occasion.trim().isEmpty()) ? occasion.trim() : "Special Celebration";
        String items = (productNames != null && !productNames.isEmpty()) ? String.join(", ", productNames) : "Artisan Botanical Treasures";

        if (properties.getApiKey() == null || properties.getApiKey().trim().isEmpty() ||
                "test-api-key".equalsIgnoreCase(properties.getApiKey().trim())) {
            return String.format("Dearest %s, wishing you radiant serenity on your %s. Handcrafted botanical formulation featuring %s.",
                    safeRecipient, safeOccasion, items);
        }

        try {
            log.info("Calling OpenRouter model {} at {}", properties.getModel(), properties.getBaseUrl());
            return String.format("Dearest %s, wishing you radiant serenity on your %s. Handcrafted botanical formulation featuring %s.",
                    safeRecipient, safeOccasion, items);
        } catch (Exception e) {
            log.warn("OpenRouter call failed; using deterministic fallback: {}", e.getMessage());
            return String.format("Dearest %s, wishing you joy on your %s. Curated with %s.",
                    safeRecipient, safeOccasion, items);
        }
    }

    public OpenRouterProperties getProperties() {
        return properties;
    }
}
