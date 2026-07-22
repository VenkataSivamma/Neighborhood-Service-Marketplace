package com.example.SpringBoot.Service;

import com.example.SpringBoot.DTO.CategoryDTO;
import com.example.SpringBoot.Exception.CategoryNotFoundException;
import com.example.SpringBoot.Mapper.CategoryMapper;
import com.example.SpringBoot.Model.Category;
import com.example.SpringBoot.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        return categoryMapper.toDTO(categoryRepository.save(categoryMapper.toEntity(dto)));
    }

    public CategoryDTO getCategoryById(long id) {
        return categoryMapper.toDTO(findById(id));
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO updateCategory(long id, CategoryDTO dto) {
        Category category = findById(id);
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        category.setActive(dto.isActive());
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    public void deleteCategory(long id) {
        categoryRepository.delete(findById(id));
    }

    public CategoryDTO enableCategory(long id) {
        Category category = findById(id);
        category.setActive(true);
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    public CategoryDTO disableCategory(long id) {
        Category category = findById(id);
        category.setActive(false);
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    private Category findById(long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
    }
}
