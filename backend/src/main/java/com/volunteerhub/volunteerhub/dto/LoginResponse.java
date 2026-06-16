package com.volunteerhub.volunteerhub.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String role;
    private boolean profileCompleted;

    public LoginResponse(Long id, String name, String role, boolean profileCompleted) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.profileCompleted = profileCompleted;
    }

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public boolean isProfileCompleted() { return profileCompleted; }
}
