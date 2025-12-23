package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;
    
    @Column(nullable = false, length = 2000)
    private String description;
    
    private Long relatedDonationId;
    
    private Long relatedUserId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(length = 1000)
    private String adminNotes;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime resolvedAt;
    
    public enum ReportType {
        UNSAFE_FOOD, MISCONDUCT, TECHNICAL_ISSUE, OTHER
    }
    
    public enum ReportStatus {
        PENDING, UNDER_REVIEW, RESOLVED, DISMISSED
    }
}
