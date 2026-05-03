package com.reown.backend.catalog.repository;

import com.reown.backend.catalog.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {

    List<ProductOption> findByProductId(Long productId);
}