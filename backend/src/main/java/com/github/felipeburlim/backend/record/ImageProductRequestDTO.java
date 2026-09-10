package com.github.felipeburlim.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ImageProductRequestDTO (
        @NotBlank(message = "Caminho da imagem é obrigatorio")
        String uri,

        @NotNull(message = "O Id do produto é obrigatorio")
        Long productId
) {
}
