package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Booking;
import com.example.SpringBoot.Model.Booking.BookingStatus;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(Customer customer);
    List<Booking> findByProvider(Provider provider);
    long countByStatus(BookingStatus status);
}
