package com.example.SpringBoot.DTO;

import com.example.SpringBoot.Model.Booking.BookingStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private long bookingId;
    private long customerId;
    private long providerId;
    private String serviceDescription;
    private LocalDateTime bookingDate;
    private BookingStatus status;
}
