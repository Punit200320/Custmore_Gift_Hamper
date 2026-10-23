package com.surrealtreasures.controller;

import com.surrealtreasures.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> getHealth() {
        return ResponseEntity.ok(HealthResponse.up(activeProfile));
    }
}
