package com.surrealtreasures.dto;

import java.time.Instant;

public record HealthResponse(
    String status,
    String service,
    String version,
    Instant timestamp,
    String environment
) {
    public static HealthResponse up(String environment) {
        return new HealthResponse(
            "UP",
            "Surreal Treasures Custom Gift Hamper Backend API",
            "1.0.0",
            Instant.now(),
            environment
        );
    }
}
