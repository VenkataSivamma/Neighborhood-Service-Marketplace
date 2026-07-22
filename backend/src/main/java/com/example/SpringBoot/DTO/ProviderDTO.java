package com.example.SpringBoot.DTO;

import com.example.SpringBoot.Model.Provider.ProviderStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDTO {
    private long providerId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private String category;
    private ProviderStatus status;
}
