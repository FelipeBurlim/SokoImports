package com.github.felipeburlim.backend.service;

import com.github.felipeburlim.backend.model.Category;
import com.github.felipeburlim.backend.record.CategoryDTO;
import com.github.felipeburlim.backend.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

        private final CategoryRepository categoryRepository;

        @Transactional
        public CategoryDTO createCategory(CategoryDTO categoryDTO){
            Category category = Category.builder()
                    .name(categoryDTO.name())
                    .slug(categoryDTO.slug())
                    .build();

            Category savedCategory = categoryRepository.save(category);

            return mapToDTO(savedCategory);
        }

        public List<CategoryDTO> getAllCategories(){
            return categoryRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        public CategoryDTO getCategoryById(Long id){
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            return mapToDTO(category);
        }

        public CategoryDTO getCategoryBySlug(String slug){
            Category category = categoryRepository.findBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            return  mapToDTO(category);
        }

        @Transactional
        public void deleteCategory(Long id){
            categoryRepository.deleteById(id);
        }

        private CategoryDTO mapToDTO(Category category){
            return new  CategoryDTO(
                    category.getId(),
                    category.getName(),
                    category.getSlug()
            );
        }
}
