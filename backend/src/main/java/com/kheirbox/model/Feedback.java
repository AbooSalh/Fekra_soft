package com.kheirbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false, length = 2000)
    private String message;
    
    private Integer rating;
    
    @Enumerated(EnumType.STRING)
    private FeedbackStatus status = FeedbackStatus.NEW;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum FeedbackStatus {
        NEW, REVIEWED, IMPLEMENTED, ARCHIVED
    }
}
