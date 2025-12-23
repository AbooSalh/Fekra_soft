package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    private Boolean isRead = false;
    
    private Long relatedEntityId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum NotificationType {
        DONATION_CREATED, DONATION_MATCHED, PICKUP_ASSIGNED, 
        DELIVERY_IN_PROGRESS, DELIVERY_COMPLETED, 
        SAFETY_REPORT, SYSTEM_ANNOUNCEMENT
    }
}
