package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.ReviewDTO;
import com.example.SpringBoot.Model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "customer.fullName", target = "customerName")
    @Mapping(source = "provider.providerId", target = "providerId")
    @Mapping(source = "provider.fullName", target = "providerName")
    ReviewDTO toDTO(Review review);

    @Mapping(source = "customerId", target = "customer.customerId")
    @Mapping(source = "providerId", target = "provider.providerId")
    @Mapping(target = "customer.fullName", ignore = true)
    @Mapping(target = "provider.fullName", ignore = true)
    Review toEntity(ReviewDTO dto);
}
