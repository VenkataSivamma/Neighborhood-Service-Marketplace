package com.example.SpringBoot.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private long reviewId;
    private long customerId;
    private String customerName;
    private long providerId;
    private String providerName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
