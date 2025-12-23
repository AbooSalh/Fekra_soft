package com.kheirbox.controller;

import com.kheirbox.model.Delivery;
import com.kheirbox.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {
    
    @Autowired
    private DeliveryService deliveryService;
    
    @GetMapping("/available")
    public ResponseEntity<List<Delivery>> getAvailableDeliveries() {
        return ResponseEntity.ok(deliveryService.getAvailableDeliveries());
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Delivery>> getMyDeliveries(Authentication authentication) {
        return ResponseEntity.ok(deliveryService.getVolunteerDeliveries(authentication.getName()));
    }
    
    @PostMapping("/{id}/accept")
    public ResponseEntity<Delivery> acceptDelivery(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(deliveryService.acceptDelivery(id, authentication.getName()));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(@PathVariable Long id,
                                                          @RequestBody Map<String, String> request,
                                                          Authentication authentication) {
        Delivery.DeliveryStatus status = Delivery.DeliveryStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, status, authentication.getName()));
    }
    
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Delivery> confirmReceipt(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(deliveryService.confirmReceipt(id, authentication.getName()));
    }
    
    @PutMapping("/{id}/location")
    public ResponseEntity<Delivery> updateLocation(@PathVariable Long id,
                                                    @RequestBody Map<String, Double> location,
                                                    Authentication authentication) {
        return ResponseEntity.ok(deliveryService.updateLocation(
                id, location.get("latitude"), location.get("longitude"), authentication.getName()));
    }
}
