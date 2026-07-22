package com.example.SpringBoot.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private long reviewId;
    private long customerId;
    private long providerId;
    private int rating;
    private String comment;
}
