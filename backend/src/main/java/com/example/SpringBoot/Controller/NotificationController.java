package com.example.SpringBoot.Controller;

import com.example.SpringBoot.DTO.NotificationDTO;
import com.example.SpringBoot.Service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(dto));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByCustomer(@PathVariable long customerId) {
        return ResponseEntity.ok(notificationService.getNotificationsByCustomer(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByProvider(@PathVariable long providerId) {
        return ResponseEntity.ok(notificationService.getNotificationsByProvider(providerId));
    }
}
