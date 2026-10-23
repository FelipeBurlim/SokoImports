package com.github.felipeburlim.backend.repository;

import com.github.felipeburlim.backend.model.Category;
import com.github.felipeburlim.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByCategory(Category category, Pageable pageable);

    @Query("SELECT p FROM product WHERE p.isActive = true")
    Page<Product> findAllActive(Pageable pageable);
}