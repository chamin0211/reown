package com.reown.backend.catalog.repository;

import com.reown.backend.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByBrandId(Long brandId);

    List<Product> findByStatus(String status);

    List<Product> findByStatusNot(String status);

    List<Product> findByBrandIdAndStatusNot(Long brandId, String status);
}