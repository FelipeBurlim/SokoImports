package com.github.felipeburlim.backend.service;

import com.github.felipeburlim.backend.record.ProductRequestDTO;
import com.github.felipeburlim.backend.record.ProductResponseDTO;
import com.github.felipeburlim.backend.repository.CategoryRepository;
import com.github.felipeburlim.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductResponseDTO create(ProductRequestDTO productRequestDTO) {
        return null;
    }
}
