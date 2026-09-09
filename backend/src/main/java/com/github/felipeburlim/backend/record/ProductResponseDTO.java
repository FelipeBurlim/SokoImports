package com.github.felipeburlim.backend.record;

import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String name,
        String description,
        String color,
        String mark,
        double price,
        String categoryName,
        List<String> imageUris
) {
}
