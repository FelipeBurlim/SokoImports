package com.github.felipeburlim.backend.repository;

import com.github.felipeburlim.backend.model.ImageProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageProductRepository extends JpaRepository<ImageProduct, UUID> {
}
