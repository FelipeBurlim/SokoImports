package com.github.felipeburlim.backend.record;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
        @NotBlank(message = "Informe um nome valido:")
        String name
) {
}
