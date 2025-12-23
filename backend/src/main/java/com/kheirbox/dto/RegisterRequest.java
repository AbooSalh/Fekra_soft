package com.kheirbox.dto;

import com.kheirbox.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String fullName;
    
    private String phoneNumber;
    
    private String address;
    
    private Double latitude;
    
    private Double longitude;
    
    @NotNull
    private User.UserRole role;
    
    private String organizationName;
    
    private String organizationLicense;
    
    private String preferredLanguage;
}
