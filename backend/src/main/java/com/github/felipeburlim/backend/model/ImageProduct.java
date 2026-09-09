package com.github.felipeburlim.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@Entity
public class ImageProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String URI;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public ImageProduct(String URI, Product product) {
        this.URI = URI;
        this.product = product;
    }

    public ImageProduct() {
    }

}
