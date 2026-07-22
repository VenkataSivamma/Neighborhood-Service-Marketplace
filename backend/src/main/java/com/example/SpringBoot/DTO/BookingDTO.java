package com.example.SpringBoot.DTO;

import com.example.SpringBoot.Model.Booking.BookingStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long bookingId;
    private Long customerId;
    private String customerName;
    private Long providerId;
    private String providerName;
    private String serviceDescription;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private String paymentMethod;
}
