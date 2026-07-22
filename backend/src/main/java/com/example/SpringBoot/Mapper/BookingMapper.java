package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.BookingDTO;
import com.example.SpringBoot.Model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "provider.providerId", target = "providerId")
    BookingDTO toDTO(Booking booking);

    @Mapping(source = "customerId", target = "customer.customerId")
    @Mapping(source = "providerId", target = "provider.providerId")
    Booking toEntity(BookingDTO dto);
}
