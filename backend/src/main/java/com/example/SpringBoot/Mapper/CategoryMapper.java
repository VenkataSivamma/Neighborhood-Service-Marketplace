package com.example.SpringBoot.Mapper;

import com.example.SpringBoot.DTO.CategoryDTO;
import com.example.SpringBoot.Model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toDTO(Category category);
    Category toEntity(CategoryDTO dto);
}
