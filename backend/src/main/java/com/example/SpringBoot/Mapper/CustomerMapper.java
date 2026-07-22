package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.CustomerDTO;
import com.example.SpringBoot.Model.Customer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerDTO toDTO(Customer customer);
    Customer toEntity(CustomerDTO dto);
}
