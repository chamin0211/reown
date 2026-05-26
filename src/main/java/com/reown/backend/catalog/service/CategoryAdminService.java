package com.reown.backend.catalog.service;

import com.reown.backend.catalog.dto.CategoryAdminRequest;
import com.reown.backend.catalog.dto.CategoryResponse;
import com.reown.backend.catalog.entity.Category;
import com.reown.backend.catalog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryAdminService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Category::getCategoryId))
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(CategoryAdminRequest request) {
        validateName(request.name());
        Category category = categoryRepository.save(new Category(request.name().trim(), request.parentId()));
        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryAdminRequest request) {
        Category category = getCategory(categoryId);
        validateName(request.name());
        if (request.parentId() != null && request.parentId().equals(categoryId)) {
            throw new IllegalArgumentException("자기 자신을 상위 카테고리로 지정할 수 없습니다.");
        }
        category.update(request.name().trim(), request.parentId());
        return CategoryResponse.from(category);
    }

    @Transactional
    public Map<String, Object> deleteCategory(Long categoryId) {
        Category category = getCategory(categoryId);
        categoryRepository.delete(category);
        return Map.of("deleted", true, "categoryId", categoryId);
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다. categoryId=" + categoryId));
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("카테고리명을 입력해주세요.");
        }
    }
}
