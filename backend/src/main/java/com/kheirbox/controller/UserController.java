package com.kheirbox.controller;

import com.kheirbox.model.User;
import com.kheirbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        List<User> users = userRepository.findAll();
        users.sort((u1, u2) -> u2.getPoints().compareTo(u1.getPoints()));
        return ResponseEntity.ok(users.stream().limit(100).toList());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userRepository.findByStatus(User.AccountStatus.PENDING));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.AccountStatus.ACTIVE);
        return ResponseEntity.ok(userRepository.save(user));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<User> rejectUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.AccountStatus.REJECTED);
        return ResponseEntity.ok(userRepository.save(user));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> stats = Map.of(
            "points", user.getPoints(),
            "donationsCount", user.getDonations() != null ? user.getDonations().size() : 0,
            "deliveriesCount", user.getDeliveries() != null ? user.getDeliveries().size() : 0
        );
        
        return ResponseEntity.ok(stats);
    }
}
