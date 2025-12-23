package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;
    
    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private User volunteer;
    
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;
    
    private LocalDateTime pickupTime;
    
    private LocalDateTime deliveryTime;
    
    private Double currentLatitude;
    
    private Double currentLongitude;
    
    private Boolean safetyCheckPassed = false;
    
    @Column(length = 1000)
    private String safetyNotes;
    
    private Boolean receiptConfirmed = false;
    
    @Column(length = 1000)
    private String deliveryNotes;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum DeliveryStatus {
        PENDING, ACCEPTED, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED
    }
}
