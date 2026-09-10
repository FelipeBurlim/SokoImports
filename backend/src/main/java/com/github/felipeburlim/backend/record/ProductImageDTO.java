package com.github.felipeburlim.backend.record;

public record ProductImageDTO(
        Long id,
        String url,
        Integer sortOrder
) {}