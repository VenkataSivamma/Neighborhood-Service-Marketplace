package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByCity(String city);
    Optional<Customer> findByEmail(String email);
}
