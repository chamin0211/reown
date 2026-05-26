package com.reown.backend.catalog.controller;

import com.reown.backend.catalog.dto.CategoryAdminRequest;
import com.reown.backend.catalog.dto.CategoryResponse;
import com.reown.backend.catalog.service.CategoryAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/categories")
public class CategoryAdminController {

    private final CategoryAdminService categoryAdminService;

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryAdminService.getCategories();
    }

    @PostMapping
    public CategoryResponse createCategory(@RequestBody CategoryAdminRequest request) {
        return categoryAdminService.createCategory(request);
    }

    @PatchMapping("/{categoryId}")
    public CategoryResponse updateCategory(@PathVariable Long categoryId, @RequestBody CategoryAdminRequest request) {
        return categoryAdminService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public Map<String, Object> deleteCategory(@PathVariable Long categoryId) {
        return categoryAdminService.deleteCategory(categoryId);
    }
}
