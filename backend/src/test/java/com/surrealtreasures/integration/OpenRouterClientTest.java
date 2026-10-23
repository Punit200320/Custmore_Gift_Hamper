package com.surrealtreasures.integration;

import com.surrealtreasures.config.OpenRouterProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class OpenRouterClientTest {

    @Test
    @DisplayName("OpenRouter: returns deterministic artisan gift card message when API key is missing")
    void testOpenRouter_FallbackWithoutApiKey() {
        OpenRouterProperties props = new OpenRouterProperties();
        props.setApiKey(null);
        props.setModel("google/gemini-2.0-flash-exp:free");

        OpenRouterClient client = new OpenRouterClient(props);
        String message = client.generateGiftCardMessage("Diwali", "Rajesh", Arrays.asList("Lavender Soap", "Rose Butter"));

        assertNotNull(message);
        assertTrue(message.contains("Rajesh"));
        assertTrue(message.contains("Diwali"));
        assertTrue(message.contains("Lavender Soap"));
    }

    @Test
    @DisplayName("OpenRouter: automated tests use mock/test key without calling external network")
    void testOpenRouter_TestKeyUsesSafeDeterministicMode() {
        OpenRouterProperties props = new OpenRouterProperties();
        props.setApiKey("test-api-key");
        props.setModel("test-model");

        OpenRouterClient client = new OpenRouterClient(props);
        String message = client.generateGiftCardMessage("Wedding", "Aarti", Collections.singletonList("Body Oil"));

        assertNotNull(message);
        assertTrue(message.contains("Aarti"));
        assertTrue(message.contains("Wedding"));
    }

    @Test
    @DisplayName("OpenRouter: handles null or empty inputs gracefully")
    void testOpenRouter_HandlesNullInputsGracefully() {
        OpenRouterProperties props = new OpenRouterProperties();
        OpenRouterClient client = new OpenRouterClient(props);

        String message = client.generateGiftCardMessage(null, null, null);

        assertNotNull(message);
        assertTrue(message.contains("Valued Recipient"));
        assertTrue(message.contains("Special Celebration"));
    }
}
