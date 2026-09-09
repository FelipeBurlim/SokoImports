package com.github.felipeburlim.backend.record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;
import java.util.UUID;

public record ProductRequestDTO(

        @NotBlank(message = "Informe um nome válido")
        String name,

        String description,
        String color,
        String mark,

        @PositiveOrZero(message = "Informe um valor válido")
        double price,

        @NotNull(message = "O Id da categoria é obrigatorio")
        UUID categoryId,

        List<String> imagesUris
) {
}
