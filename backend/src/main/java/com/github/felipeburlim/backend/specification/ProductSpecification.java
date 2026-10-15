package com.github.felipeburlim.backend.specification;

import com.github.felipeburlim.backend.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> filterBy(String name,
                                                  BigDecimal minPrice,
                                                  BigDecimal maxPrice,
                                                  Long categoryId) {
        return (root, query, criteriaBuilder) -> {
            Specification<Product> spec = Specification.where((Specification<Product>) null);

            if (name != null && !name.isEmpty()) {
                spec = spec.and((r, q, cb) -> cb.like(cb.lower(r.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (minPrice != null) {
                spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("price"), minPrice));
            }
            if (maxPrice != null) {
                spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("price"), maxPrice));
            }
            if (categoryId != null) {
                spec = spec.and((r, q, cb) -> cb.equal(r.get("category").get("id"), categoryId));
            }
            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }
}
