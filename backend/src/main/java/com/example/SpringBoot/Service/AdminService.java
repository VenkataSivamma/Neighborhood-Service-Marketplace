package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.*;
import com.example.SpringBoot.Mapper.BookingMapper;
import com.example.SpringBoot.Mapper.CustomerMapper;
import com.example.SpringBoot.Mapper.ProviderMapper;
import com.example.SpringBoot.Mapper.ReviewMapper;
import com.example.SpringBoot.Model.Booking.BookingStatus;
import com.example.SpringBoot.Model.Provider.ProviderStatus;
import com.example.SpringBoot.Repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final CustomerMapper customerMapper;
    private final ProviderMapper providerMapper;
    private final BookingMapper bookingMapper;
    private final ReviewMapper reviewMapper;

    public AdminService(CustomerRepository customerRepository, ProviderRepository providerRepository,
                        BookingRepository bookingRepository, ReviewRepository reviewRepository,
                        CategoryRepository categoryRepository, CustomerMapper customerMapper,
                        ProviderMapper providerMapper, BookingMapper bookingMapper,
                        ReviewMapper reviewMapper) {
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.customerMapper = customerMapper;
        this.providerMapper = providerMapper;
        this.bookingMapper = bookingMapper;
        this.reviewMapper = reviewMapper;
    }

    public Map<String, Long> getDashboard() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalCustomers", customerRepository.count());
        stats.put("totalProviders", providerRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("pendingProviders", providerRepository.countByStatus(ProviderStatus.PENDING));
        stats.put("completedBookings", bookingRepository.countByStatus(BookingStatus.COMPLETED));
        stats.put("cancelledBookings", bookingRepository.countByStatus(BookingStatus.CANCELLED));
        return stats;
    }

    public Map<String, Object> getReports() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalCustomers", customerRepository.count());
        report.put("totalProviders", providerRepository.count());
        report.put("totalBookings", bookingRepository.count());
        report.put("totalReviews", reviewRepository.count());
        report.put("totalCategories", categoryRepository.count());
        report.put("pendingProviders", providerRepository.countByStatus(ProviderStatus.PENDING));
        report.put("approvedProviders", providerRepository.countByStatus(ProviderStatus.APPROVED));
        report.put("completedBookings", bookingRepository.countByStatus(BookingStatus.COMPLETED));
        report.put("cancelledBookings", bookingRepository.countByStatus(BookingStatus.CANCELLED));
        report.put("pendingBookings", bookingRepository.countByStatus(BookingStatus.PENDING));
        return report;
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
