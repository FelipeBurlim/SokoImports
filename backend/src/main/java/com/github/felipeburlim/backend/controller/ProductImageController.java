package com.github.felipeburlim.backend.controller;

import com.github.felipeburlim.backend.record.ProductImageDTO;
import com.github.felipeburlim.backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images}")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductImageController {
    private final ProductImageService productImageService;

    @PostMapping("/{productId}")
    public ResponseEntity<ProductImageDTO> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile imageFile,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder
    ) {
        ProductImageDTO savedImage = productImageService.saveImageDTO(productId,imageFile,sortOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedImage);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
