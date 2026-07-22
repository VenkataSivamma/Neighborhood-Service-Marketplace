package com.example.SpringBoot.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private long notificationId;
    private Long customerId;
    private Long providerId;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
}
