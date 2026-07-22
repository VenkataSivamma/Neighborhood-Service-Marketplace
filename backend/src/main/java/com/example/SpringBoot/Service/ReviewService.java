package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.ReviewDTO;
import com.example.SpringBoot.Exception.CustomerNotFoundException;
import com.example.SpringBoot.Exception.ProviderNotFoundException;
import com.example.SpringBoot.Exception.ReviewNotFoundException;
import com.example.SpringBoot.Mapper.ReviewMapper;
import com.example.SpringBoot.Model.Customer;
import com.example.SpringBoot.Model.Provider;
import com.example.SpringBoot.Model.Review;
import com.example.SpringBoot.Repository.CustomerRepository;
import com.example.SpringBoot.Repository.ProviderRepository;
import com.example.SpringBoot.Repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository, CustomerRepository customerRepository,
                         ProviderRepository providerRepository, ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.reviewMapper = reviewMapper;
    }

    public ReviewDTO createReview(ReviewDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + dto.getCustomerId()));
        Provider provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + dto.getProviderId()));
        Review review = new Review();
        review.setCustomer(customer);
        review.setProvider(provider);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return reviewMapper.toDTO(reviewRepository.save(review));
    }

    public ReviewDTO getReviewById(long id) {
        return reviewMapper.toDTO(findById(id));
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }

    public ReviewDTO updateReview(long id, ReviewDTO dto) {
        Review review = findById(id);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        return reviewMapper.toDTO(reviewRepository.save(review));
    }

    public void deleteReview(long id) {
        reviewRepository.delete(findById(id));
    }

    public List<ReviewDTO> getReviewsByProvider(long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider not found with id: " + providerId));
        return reviewRepository.findByProvider(provider).stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByCustomer(long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + customerId));
        return reviewRepository.findByCustomer(customer).stream().map(reviewMapper::toDTO).collect(Collectors.toList());
    }

    private Review findById(long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));
    }
}
