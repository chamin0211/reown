package com.reown.backend.brand.repository;

import com.reown.backend.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByStatus(String status);
    List<Brand> findByOwnerUserId(Long ownerUserId);
}
