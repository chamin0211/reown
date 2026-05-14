package com.reown.backend.catalog.repository;

import com.reown.backend.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByBrandId(Long brandId);

    List<Product> findByStatus(String status);

    List<Product> findByStatusNot(String status);

    List<Product> findByBrandIdAndStatusNot(Long brandId, String status);

    List<Product> findByStatusOrderByCreatedAtDesc(String status);

    List<Product> findByStatusNotOrderByCreatedAtDesc(String status);

    List<Product> findByBrandIdAndStatusNotOrderByCreatedAtDesc(Long brandId, String status);

    List<Product> findByBrandIdAndStatusOrderByCreatedAtDesc(Long brandId, String status);
}
