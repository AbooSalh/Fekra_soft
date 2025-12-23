package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;
    
    @Column(nullable = false)
    private String foodType;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private String unit;
    
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    
    private String pickupAddress;
    
    private Double pickupLatitude;
    
    private Double pickupLongitude;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.PENDING;
    
    private Boolean isRecurring = false;
    
    private String recurringSchedule;
    
    @Column(length = 1000)
    private String specialInstructions;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "donation", cascade = CascadeType.ALL)
    private Delivery delivery;
    
    public enum DonationStatus {
        PENDING, MATCHED, IN_TRANSIT, COMPLETED, CANCELLED
    }
}
