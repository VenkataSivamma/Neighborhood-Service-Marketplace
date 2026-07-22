package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
