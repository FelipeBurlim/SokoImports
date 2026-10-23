package com.github.felipeburlim.backend.record;

import java.math.BigDecimal;
import java.util.List;

public record AdminProductDTO (
        Long id,
        String name,
        String description,
        BigDecimal price,
        String color,
        String mark,
        Long categoryId,
        String categoryName,
        boolean active,
        List<ProductImageDTO> images
){
}
