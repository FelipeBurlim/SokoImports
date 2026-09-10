package com.github.felipeburlim.backend.record;

import java.math.BigDecimal;
import java.util.List;

public record ProductDTO(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String categoryName,
        List<ProductImageDTO> images
) {}