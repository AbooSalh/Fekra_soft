package com.kheirbox.service;

import com.kheirbox.model.Notification;
import com.kheirbox.model.Donation;
import com.kheirbox.model.User;
import com.kheirbox.repository.NotificationRepository;
import com.kheirbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void notifyAboutNewDonation(Donation donation) {
        // Find nearby receivers and volunteers
        List<User> receivers = userRepository.findByRoleAndStatus(User.UserRole.RECEIVER, User.AccountStatus.ACTIVE);
        List<User> volunteers = userRepository.findByRoleAndStatus(User.UserRole.VOLUNTEER, User.AccountStatus.ACTIVE);
        
        // Create notifications for receivers
        for (User receiver : receivers) {
            createNotification(
                receiver,
                "New Donation Available",
                "A new food donation is available: " + donation.getFoodType(),
                Notification.NotificationType.DONATION_CREATED,
                donation.getId()
            );
        }
        
        // Create notifications for volunteers
        for (User volunteer : volunteers) {
            createNotification(
                volunteer,
                "New Pickup Available",
                "A new donation needs pickup: " + donation.getFoodType(),
                Notification.NotificationType.DONATION_CREATED,
                donation.getId()
            );
        }
    }
    
    public void createNotification(User user, String title, String message, 
                                   Notification.NotificationType type, Long relatedEntityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public Long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsRead(user, false);
    }
    
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> notifications = notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}
