package com.kheirbox.service;

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
public class DeliveryService {
    
    @Autowired
    private DeliveryRepository deliveryRepository;
    
    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<Delivery> getAvailableDeliveries() {
        return deliveryRepository.findAvailableDeliveries();
    }
    
    public List<Delivery> getVolunteerDeliveries(String email) {
        User volunteer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        return deliveryRepository.findByVolunteerOrderByCreatedAtDesc(volunteer);
    }
    
    @Transactional
    public Delivery acceptDelivery(Long deliveryId, String email) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        User volunteer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        
        if (delivery.getStatus() != Delivery.DeliveryStatus.PENDING) {
            throw new RuntimeException("Delivery is not available");
        }
        
        delivery.setVolunteer(volunteer);
        delivery.setStatus(Delivery.DeliveryStatus.ACCEPTED);
        delivery = deliveryRepository.save(delivery);
        
        // Update donation status
        Donation donation = delivery.getDonation();
        donation.setStatus(Donation.DonationStatus.MATCHED);
        donationRepository.save(donation);
        
        // Award points to volunteer
        volunteer.setPoints(volunteer.getPoints() + 5);
        userRepository.save(volunteer);
        
        return delivery;
    }
    
    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, Delivery.DeliveryStatus status, String email) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        if (!delivery.getVolunteer().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        
        delivery.setStatus(status);
        
        if (status == Delivery.DeliveryStatus.PICKED_UP) {
            delivery.setPickupTime(LocalDateTime.now());
            delivery.getDonation().setStatus(Donation.DonationStatus.IN_TRANSIT);
        } else if (status == Delivery.DeliveryStatus.DELIVERED) {
            delivery.setDeliveryTime(LocalDateTime.now());
        }
        
        delivery = deliveryRepository.save(delivery);
        donationRepository.save(delivery.getDonation());
        
        return delivery;
    }
    
    @Transactional
    public Delivery confirmReceipt(Long deliveryId, String email) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        User receiver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        if (delivery.getReceiver() == null) {
            delivery.setReceiver(receiver);
        } else if (!delivery.getReceiver().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        
        delivery.setReceiptConfirmed(true);
        delivery.setStatus(Delivery.DeliveryStatus.DELIVERED);
        delivery.getDonation().setStatus(Donation.DonationStatus.COMPLETED);
        
        delivery = deliveryRepository.save(delivery);
        donationRepository.save(delivery.getDonation());
        
        // Award additional points for completion
        User volunteer = delivery.getVolunteer();
        if (volunteer != null) {
            volunteer.setPoints(volunteer.getPoints() + 10);
            userRepository.save(volunteer);
        }
        
        return delivery;
    }
    
    @Transactional
    public Delivery updateLocation(Long deliveryId, Double latitude, Double longitude, String email) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        if (!delivery.getVolunteer().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        
        delivery.setCurrentLatitude(latitude);
        delivery.setCurrentLongitude(longitude);
        
        return deliveryRepository.save(delivery);
    }
}
