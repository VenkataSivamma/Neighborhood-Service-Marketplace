package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.BookingDTO;
import com.example.SpringBoot.Model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "customer.fullName", target = "customerName")
    @Mapping(source = "provider.providerId", target = "providerId")
    @Mapping(source = "provider.fullName", target = "providerName")
    @Mapping(target = "paymentMethod", ignore = true)
    BookingDTO toDTO(Booking booking);

    @Mapping(source = "customerId", target = "customer.customerId")
    @Mapping(source = "providerId", target = "provider.providerId")
    @Mapping(target = "customer.fullName", ignore = true)
    @Mapping(target = "provider.fullName", ignore = true)
    Booking toEntity(BookingDTO dto);
}
