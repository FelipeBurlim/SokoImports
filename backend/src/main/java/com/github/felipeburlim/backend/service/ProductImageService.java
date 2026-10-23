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

import java.io.IOException;
import java.io.InputStream;
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

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo de imagem vazio.");
        }
        String extension = detectExtension(file);
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

    private String detectExtension(MultipartFile file) {
        try (InputStream in = file.getInputStream()) {
            byte[] h = in.readNBytes(12);

            if (h.length >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) {
                return "jpg";
            }
            if (h.length >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') {
                return "png";
            }
            if (h.length >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                    && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') {
                return "webp";
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao ler a imagem enviada", e);
        }
        throw new IllegalArgumentException("Formato de imagem não suportado. Envie WebP, JPEG ou PNG.");
    }

    @Transactional
    public void deleteImage(Long imageId) {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));

        storageService.deleteFile(productImage.getObjectKey());
        productImageRepository.delete(productImage);
    }
}