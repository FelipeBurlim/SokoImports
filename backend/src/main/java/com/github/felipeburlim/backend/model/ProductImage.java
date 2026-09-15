package com.github.felipeburlim.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_image")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "object_key",nullable = false, length = 255)
    private String objectKey; //salva o caminho unico no bucket

    private Integer sortOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
