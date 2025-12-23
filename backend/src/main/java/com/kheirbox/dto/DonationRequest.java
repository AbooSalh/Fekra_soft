package com.kheirbox.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequest {
    
    @NotBlank
    private String foodType;
    
    @NotBlank
    private String description;
    
    @NotNull
    private Integer quantity;
    
    @NotBlank
    private String unit;
    
    @NotNull
    private LocalDateTime expiryDate;
    
    private String pickupAddress;
    
    private Double pickupLatitude;
    
    private Double pickupLongitude;
    
    private Boolean isRecurring;
    
    private String recurringSchedule;
    
    private String specialInstructions;
}
