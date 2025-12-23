package com.kheirbox.repository;

import com.kheirbox.model.Delivery;
import com.kheirbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByVolunteer(User volunteer);
    List<Delivery> findByReceiver(User receiver);
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    
    @Query("SELECT d FROM Delivery d WHERE d.status = 'PENDING' ORDER BY d.createdAt DESC")
    List<Delivery> findAvailableDeliveries();
    
    @Query("SELECT d FROM Delivery d WHERE d.volunteer = :volunteer ORDER BY d.createdAt DESC")
    List<Delivery> findByVolunteerOrderByCreatedAtDesc(User volunteer);
}
