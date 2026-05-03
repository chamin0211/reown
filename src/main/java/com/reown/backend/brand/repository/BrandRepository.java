package com.reown.backend.brand.repository;

import com.reown.backend.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}