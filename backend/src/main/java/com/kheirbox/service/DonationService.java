package com.kheirbox.service;

import com.kheirbox.dto.DonationRequest;
import com.kheirbox.model.Delivery;
import com.kheirbox.model.Donation;
import com.kheirbox.model.User;
import com.kheirbox.repository.DeliveryRepository;
import com.kheirbox.repository.DonationRepository;
import com.kheirbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {
    
    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private DeliveryRepository deliveryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public Donation createDonation(DonationRequest request, String email) {
        User donor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setFoodType(request.getFoodType());
        donation.setDescription(request.getDescription());
        donation.setQuantity(request.getQuantity());
        donation.setUnit(request.getUnit());
        donation.setExpiryDate(request.getExpiryDate());
        donation.setPickupAddress(request.getPickupAddress() != null ? request.getPickupAddress() : donor.getAddress());
        donation.setPickupLatitude(request.getPickupLatitude() != null ? request.getPickupLatitude() : donor.getLatitude());
        donation.setPickupLongitude(request.getPickupLongitude() != null ? request.getPickupLongitude() : donor.getLongitude());
        donation.setIsRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false);
        donation.setRecurringSchedule(request.getRecurringSchedule());
        donation.setSpecialInstructions(request.getSpecialInstructions());
        donation.setStatus(Donation.DonationStatus.PENDING);
        
        donation = donationRepository.save(donation);
        
        // Create delivery record
        Delivery delivery = new Delivery();
        delivery.setDonation(donation);
        delivery.setStatus(Delivery.DeliveryStatus.PENDING);
        deliveryRepository.save(delivery);
        
        // Award points to donor
        donor.setPoints(donor.getPoints() + 10);
        userRepository.save(donor);
        
        // Notify nearby receivers and volunteers
        notificationService.notifyAboutNewDonation(donation);
        
        return donation;
    }
    
    public List<Donation> getDonationsByDonor(String email) {
        User donor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        return donationRepository.findByDonorOrderByCreatedAtDesc(donor);
    }
    
    public List<Donation> getAvailableDonations() {
        return donationRepository.findAvailableDonations(LocalDateTime.now());
    }
    
    public Donation getDonationById(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }
    
    @Transactional
    public Donation updateDonation(Long id, DonationRequest request, String email) {
        Donation donation = getDonationById(id);
        
        if (!donation.getDonor().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to update this donation");
        }
        
        if (donation.getStatus() != Donation.DonationStatus.PENDING) {
            throw new RuntimeException("Cannot update donation in current status");
        }
        
        donation.setFoodType(request.getFoodType());
        donation.setDescription(request.getDescription());
        donation.setQuantity(request.getQuantity());
        donation.setUnit(request.getUnit());
        donation.setExpiryDate(request.getExpiryDate());
        donation.setSpecialInstructions(request.getSpecialInstructions());
        
        return donationRepository.save(donation);
    }
    
    @Transactional
    public void cancelDonation(Long id, String email) {
        Donation donation = getDonationById(id);
        
        if (!donation.getDonor().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized to cancel this donation");
        }
        
        if (donation.getStatus() == Donation.DonationStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed donation");
        }
        
        donation.setStatus(Donation.DonationStatus.CANCELLED);
        donationRepository.save(donation);
        
        // Cancel associated delivery
        if (donation.getDelivery() != null) {
            donation.getDelivery().setStatus(Delivery.DeliveryStatus.CANCELLED);
            deliveryRepository.save(donation.getDelivery());
        }
    }
}
