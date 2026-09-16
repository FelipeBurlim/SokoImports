package com.github.felipeburlim.backend.service;

import com.github.felipeburlim.backend.model.Category;
import com.github.felipeburlim.backend.model.Product;
import com.github.felipeburlim.backend.record.ProductDTO;
import com.github.felipeburlim.backend.record.ProductImageDTO;
import com.github.felipeburlim.backend.repository.CategoryRepository;
import com.github.felipeburlim.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ProductDTO getProductById(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToDTO(product);
    }

    private ProductDTO mapToDTO(Product product) {
        List<ProductImageDTO> imagesDto = Optional.ofNullable(product.getImages())
                .orElse(Collections.emptyList())
                .stream()
                .map(img -> new ProductImageDTO(
                        img.getId(),
                        img.getUrl(),
                        img.getSortOrder()))
                .toList();

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getColor(),
                product.getMark(),
                product.getCategory().getName(),
                imagesDto
        );
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        Product product = Product.builder()
                .name(productDTO.name())
                .description(productDTO.description())
                .price(productDTO.price())
                .color(productDTO.color())
                .mark(productDTO.mark())
                .category(category)
                .isActive(true)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }
}
