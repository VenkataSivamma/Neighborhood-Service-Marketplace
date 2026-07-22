package com.example.SpringBoot.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private long categoryId;
    private String categoryName;
    private String description;
    private boolean active;
}
