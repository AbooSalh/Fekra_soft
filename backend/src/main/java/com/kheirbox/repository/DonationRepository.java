package com.kheirbox.repository;

import com.kheirbox.model.Donation;
import com.kheirbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(User donor);
    List<Donation> findByStatus(Donation.DonationStatus status);
    List<Donation> findByDonorAndStatus(User donor, Donation.DonationStatus status);
    
    @Query("SELECT d FROM Donation d WHERE d.status = 'PENDING' AND d.expiryDate > :now")
    List<Donation> findAvailableDonations(LocalDateTime now);
    
    @Query("SELECT d FROM Donation d WHERE d.donor = :donor ORDER BY d.createdAt DESC")
    List<Donation> findByDonorOrderByCreatedAtDesc(User donor);
}
