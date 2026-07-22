package com.example.SpringBoot.Controller;

import com.example.SpringBoot.DTO.*;
import com.example.SpringBoot.Service.AdminService;
import com.example.SpringBoot.Service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final NotificationService notificationService;

    public AdminController(AdminService adminService, NotificationService notificationService) {
        this.adminService = adminService;
        this.notificationService = notificationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports() {
        return ResponseEntity.ok(adminService.getReports());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        return ResponseEntity.ok(adminService.getAllProviders());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    @PostMapping("/notifications/customers")
    public ResponseEntity<NotificationDTO> notifyCustomer(@RequestBody NotificationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(dto));
    }

    @PostMapping("/notifications/providers")
    public ResponseEntity<NotificationDTO> notifyProvider(@RequestBody NotificationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(dto));
    }
}
