package com.surrealtreasures.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "openrouter")
public class OpenRouterProperties {

    /**
     * OpenRouter API key injected via environment variable OPENROUTER_API_KEY.
     */
    private String apiKey;

    /**
     * OpenRouter API Base URL (default: https://openrouter.ai/api/v1).
     */
    private String baseUrl = "https://openrouter.ai/api/v1";

    /**
     * Configurable model identifier, defaults to a free tier model.
     */
    private String model = "google/gemini-2.0-flash-exp:free";

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
