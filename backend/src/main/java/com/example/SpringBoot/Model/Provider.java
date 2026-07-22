package com.example.SpringBoot.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long providerId;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private String password;
    private String category;

    @Enumerated(EnumType.STRING)
    private ProviderStatus status = ProviderStatus.PENDING;

    public enum ProviderStatus {
        PENDING, APPROVED, REJECTED, SUSPENDED
    }
}
