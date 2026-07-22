package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Notification;
import com.example.SpringBoot.Model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCustomer(Customer customer);
    List<Notification> findByProvider(Provider provider);
}
