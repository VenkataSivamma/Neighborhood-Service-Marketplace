package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.BookingDTO;
import com.example.SpringBoot.Exception.BookingNotFoundException;
import com.example.SpringBoot.Exception.CustomerNotFoundException;
import com.example.SpringBoot.Exception.ProviderNotFoundException;
import com.example.SpringBoot.Model.Booking;
import com.example.SpringBoot.Model.Booking.BookingStatus;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Repository.BookingRepository;
import com.example.SpringBoot.Repository.CustomerRepository;
import com.example.SpringBoot.Repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;

    public BookingService(BookingRepository bookingRepository, CustomerRepository customerRepository,
                          ProviderRepository providerRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
    }

    public BookingDTO createBooking(BookingDTO dto) {
        if (dto.getCustomerId() == null || dto.getCustomerId() == 0)
            throw new CustomerNotFoundException("Customer ID is missing in booking request");
        if (dto.getProviderId() == null || dto.getProviderId() == 0)
            throw new ProviderNotFoundException("Provider ID is missing in booking request");
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + dto.getCustomerId()));
        Provider provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + dto.getProviderId()));
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setServiceDescription(dto.getServiceDescription());
        booking.setBookingDate(dto.getBookingDate());
        booking.setStatus(BookingStatus.PENDING);
        return toDTO(bookingRepository.save(booking));
    }

    public BookingDTO getBookingById(long id) {
        return toDTO(findById(id));
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookingDTO updateBooking(long id, BookingDTO dto) {
        Booking booking = findById(id);
        booking.setServiceDescription(dto.getServiceDescription());
        booking.setBookingDate(dto.getBookingDate());
        return toDTO(bookingRepository.save(booking));
    }

    public void deleteBooking(long id) {
        bookingRepository.delete(findById(id));
    }

    public List<BookingDTO> getBookingsByCustomer(long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + customerId));
        return bookingRepository.findByCustomer(customer).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByProvider(long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + providerId));
        return bookingRepository.findByProvider(provider).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookingDTO acceptBooking(long id) { return updateStatus(id, BookingStatus.ACCEPTED); }
    public BookingDTO rejectBooking(long id) { return updateStatus(id, BookingStatus.REJECTED); }
    public BookingDTO markInProgress(long id) { return updateStatus(id, BookingStatus.IN_PROGRESS); }
    public BookingDTO completeBooking(long id) { return updateStatus(id, BookingStatus.COMPLETED); }
    public BookingDTO cancelBooking(long id) { return updateStatus(id, BookingStatus.CANCELLED); }

    private BookingDTO updateStatus(long id, BookingStatus status) {
        Booking booking = findById(id);
        booking.setStatus(status);
        return toDTO(bookingRepository.save(booking));
    }

    private BookingDTO toDTO(Booking b) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(b.getBookingId());
        dto.setCustomerId(b.getCustomer() != null ? b.getCustomer().getCustomerId() : null);
        dto.setCustomerName(b.getCustomer() != null ? b.getCustomer().getFullName() : null);
        dto.setProviderId(b.getProvider() != null ? b.getProvider().getProviderId() : null);
        dto.setProviderName(b.getProvider() != null ? b.getProvider().getFullName() : null);
        dto.setServiceDescription(b.getServiceDescription());
        dto.setBookingDate(b.getBookingDate());
        dto.setStatus(b.getStatus());
        return dto;
    }

    private Booking findById(long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
    }
}
