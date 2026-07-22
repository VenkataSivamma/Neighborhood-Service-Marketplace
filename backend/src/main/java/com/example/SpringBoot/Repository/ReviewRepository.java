package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProvider(Provider provider);
    List<Review> findByCustomer(Customer customer);
}
