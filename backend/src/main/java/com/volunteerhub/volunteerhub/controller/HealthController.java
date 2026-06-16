package com.volunteerhub.volunteerhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "Volunteer Hub Backend Running";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Backend Healthy";
    }
}