package com.github.felipeburlim.backend.record;

import java.util.UUID;

public record ImageProductResponseDTO(
        UUID id,
        String uri,
        UUID productId
) {
}
