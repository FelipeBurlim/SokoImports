package com.github.felipeburlim.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ImageProductRequestDTO (
        @NotBlank(message = "Caminho da imagem é obrigatorio")
        String uri,

        @NotNull(message = "O Id do produto é obrigatorio")
        UUID productId
) {
}
