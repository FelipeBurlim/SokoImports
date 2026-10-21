package com.github.felipeburlim.backend.service;

import com.github.felipeburlim.backend.model.Product;
import com.github.felipeburlim.backend.model.ProductImage;
import com.github.felipeburlim.backend.record.ProductImageDTO;
import com.github.felipeburlim.backend.repository.ProductImageRepository;
import com.github.felipeburlim.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final StorageService storageService;

    @Value("${storage.base_url}")
    private String baseStorageUrl;

    @Transactional
    public ProductImageDTO saveImageDTO(Long productId, MultipartFile file, Integer sortOrder) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String extension = "webp";
        String objectKey = "products/" + productId + "/" + UUID.randomUUID() + "." + extension;

        storageService.uploadFile(file, objectKey);

        String formattedBaseUrl = baseStorageUrl.endsWith("/") ? baseStorageUrl : baseStorageUrl + "/";
        String publicUrl = formattedBaseUrl + objectKey;

        ProductImage productImage = ProductImage.builder()
                .url(publicUrl)
                .objectKey(objectKey)
                .sortOrder(sortOrder != null ? sortOrder : 0)
                .product(product)
                .build();

        ProductImage savedImage = productImageRepository.save(productImage);

        return new ProductImageDTO(
                savedImage.getId(),
                savedImage.getUrl(),
                savedImage.getSortOrder()
        );
    }

    @Transactional
    public void deleteImage(Long imageId) {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));

        storageService.deleteFile(productImage.getObjectKey());
        productImageRepository.delete(productImage);
    }
}