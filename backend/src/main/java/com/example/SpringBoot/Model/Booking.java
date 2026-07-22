package com.example.SpringBoot.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;

    private String serviceDescription;
    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    public enum BookingStatus {
        PENDING, ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
