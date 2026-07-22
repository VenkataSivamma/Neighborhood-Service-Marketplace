package com.example.SpringBoot.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long customerId;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private String password;
    private boolean active;
}
