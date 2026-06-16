package com.volunteerhub.volunteerhub.dto;

import com.volunteerhub.volunteerhub.model.Role;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {   // ✅ RETURN Role, NOT String
        return role;
    }
}
