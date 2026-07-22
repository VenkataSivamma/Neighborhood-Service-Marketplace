package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.*;
import com.example.SpringBoot.Mapper.BookingMapper;
import com.example.SpringBoot.Mapper.CustomerMapper;
import com.example.SpringBoot.Mapper.ProviderMapper;
import com.example.SpringBoot.Mapper.ReviewMapper;
import com.example.SpringBoot.Repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final CustomerMapper customerMapper;
    private final ProviderMapper providerMapper;
    private final BookingMapper bookingMapper;
    private final ReviewMapper reviewMapper;

    public AdminService(CustomerRepository customerRepository, ProviderRepository providerRepository,
                        BookingRepository bookingRepository, ReviewRepository reviewRepository,
                        NotificationRepository notificationRepository, CustomerMapper customerMapper,
                        ProviderMapper providerMapper, BookingMapper bookingMapper,
                        ReviewMapper reviewMapper) {
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.customerMapper = customerMapper;
        this.providerMapper = providerMapper;
        this.bookingMapper = bookingMapper;
        this.reviewMapper = reviewMapper;
    }

    public Map<String, Long> getDashboard() {
        return Map.of(
                "totalCustomers", customerRepository.count(),
                "totalProviders", providerRepository.count(),
                "totalBookings", bookingRepository.count(),
                "totalReviews", reviewRepository.count()
        );
    }

    public Map<String, Object> getReports() {
        return Map.of(
                "customers", customerRepository.count(),
                "providers", providerRepository.count(),
                "bookings", bookingRepository.count(),
                "reviews", reviewRepository.count(),
                "notifications", notificationRepository.count()
        );
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream().map(customerMapper::toDTO).collect(Collectors.toList());
    }

    public List<ProviderDTO> getAllProviders() {
        return providerRepository.findAll().stream().map(providerMapper::toDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(bookingMapper::toDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }
}
