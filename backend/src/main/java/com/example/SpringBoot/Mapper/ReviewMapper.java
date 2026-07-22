package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.ReviewDTO;
import com.example.SpringBoot.Model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "provider.providerId", target = "providerId")
    ReviewDTO toDTO(Review review);

    @Mapping(source = "customerId", target = "customer.customerId")
    @Mapping(source = "providerId", target = "provider.providerId")
    Review toEntity(ReviewDTO dto);
}
