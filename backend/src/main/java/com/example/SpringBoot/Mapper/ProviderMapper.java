package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.ProviderDTO;
import com.example.SpringBoot.Model.Provider;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProviderMapper {
    ProviderDTO toDTO(Provider provider);
    Provider toEntity(ProviderDTO dto);
}
