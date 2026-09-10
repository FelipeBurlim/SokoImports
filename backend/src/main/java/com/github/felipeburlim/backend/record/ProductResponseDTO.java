package com.github.felipeburlim.backend.record;

import java.util.List;

public record ProductResponseDTO(
        Long id,
        String name,
        String description,
        String color,
        String mark,
        double price,
        String categoryName,
        List<String> imageUris
) {
}
