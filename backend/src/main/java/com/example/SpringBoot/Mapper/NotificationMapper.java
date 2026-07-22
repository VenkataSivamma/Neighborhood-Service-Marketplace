package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.NotificationDTO;
import com.example.SpringBoot.Model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapper {

    @Mapping(source = "customer.customerId", target = "customerId")
    @Mapping(source = "provider.providerId", target = "providerId")
    NotificationDTO toDTO(Notification notification);

    @Mapping(source = "customerId", target = "customer.customerId")
    @Mapping(source = "providerId", target = "provider.providerId")
    Notification toEntity(NotificationDTO dto);
}
