package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.NotificationDTO;
import com.example.SpringBoot.Exception.CustomerNotFoundException;
import com.example.SpringBoot.Exception.NotificationNotFoundException;
import com.example.SpringBoot.Exception.ProviderNotFoundException;
import com.example.SpringBoot.Mapper.NotificationMapper;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Notification;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Repository.CustomerRepository;
import com.example.SpringBoot.Repository.NotificationRepository;
import com.example.SpringBoot.Repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository notificationRepository, CustomerRepository customerRepository,
                                ProviderRepository providerRepository, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.notificationMapper = notificationMapper;
    }

    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification notification = new Notification();
        notification.setMessage(dto.getMessage());
        notification.setRead(dto.isRead());
        notification.setCreatedAt(LocalDateTime.now());
        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + dto.getCustomerId()));
            notification.setCustomer(customer);
        }
        if (dto.getProviderId() != null) {
            Provider provider = providerRepository.findById(dto.getProviderId())
                    .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + dto.getProviderId()));
            notification.setProvider(provider);
        }
        return notificationMapper.toDTO(notificationRepository.save(notification));
    }

    public NotificationDTO getNotificationById(long id) {
        return notificationMapper.toDTO(findById(id));
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll().stream().map(notificationMapper::toDTO).collect(Collectors.toList());
    }

    public void deleteNotification(long id) {
        notificationRepository.delete(findById(id));
    }

    public List<NotificationDTO> getNotificationsByCustomer(long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + customerId));
        return notificationRepository.findByCustomer(customer).stream().map(notificationMapper::toDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByProvider(long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + providerId));
        return notificationRepository.findByProvider(provider).stream().map(notificationMapper::toDTO).collect(Collectors.toList());
    }

    private Notification findById(long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + id));
    }
}
