package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String phoneNumber;
    
    private String address;
    
    private Double latitude;
    
    private Double longitude;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.PENDING;
    
    private String organizationName;
    
    private String organizationLicense;
    
    private Integer points = 0;
    
    @Column(name = "preferred_language")
    private String preferredLanguage = "en";
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL)
    private Set<Donation> donations = new HashSet<>();
    
    @OneToMany(mappedBy = "volunteer", cascade = CascadeType.ALL)
    private Set<Delivery> deliveries = new HashSet<>();
    
    public enum UserRole {
        DONOR, RECEIVER, VOLUNTEER, NGO, ADMIN
    }
    
    public enum AccountStatus {
        PENDING, ACTIVE, REJECTED, DEACTIVATED
    }
}
