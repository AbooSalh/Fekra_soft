package com.kheirbox.controller;

import com.kheirbox.dto.DonationRequest;
import com.kheirbox.model.Donation;
import com.kheirbox.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @PostMapping
    public ResponseEntity<Donation> createDonation(@Valid @RequestBody DonationRequest request,
                                                    Authentication authentication) {
        return ResponseEntity.ok(donationService.createDonation(request, authentication.getName()));
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations(Authentication authentication) {
        return ResponseEntity.ok(donationService.getDonationsByDonor(authentication.getName()));
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Donation>> getAvailableDonations() {
        return ResponseEntity.ok(donationService.getAvailableDonations());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(@PathVariable Long id,
                                                    @Valid @RequestBody DonationRequest request,
                                                    Authentication authentication) {
        return ResponseEntity.ok(donationService.updateDonation(id, request, authentication.getName()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelDonation(@PathVariable Long id, Authentication authentication) {
        donationService.cancelDonation(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
