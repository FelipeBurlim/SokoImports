package com.github.felipeburlim.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image_product")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "object_key",nullable = false, length = 255)
    private String objectKey; //salva o caminho unico no bucket

    private Integer sortOrder;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Long productId;
}
