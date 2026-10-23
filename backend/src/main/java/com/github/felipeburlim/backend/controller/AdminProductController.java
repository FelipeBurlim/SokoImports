package com.github.felipeburlim.backend.controller;

import com.github.felipeburlim.backend.model.Product;
import com.github.felipeburlim.backend.record.AdminProductDTO;
import com.github.felipeburlim.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<AdminProductDTO>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size){
        Pageable pageable = PageRequest.of(Math.max(page,0),Math.min(Math.max(size,1),100));
        return ResponseEntity.ok(productService.getAllProductsForAdmin(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductDTO> getById(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProductForAdmin(id));
    }
}
