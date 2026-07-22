package com.example.SpringBoot.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private long customerId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private boolean active;
}
