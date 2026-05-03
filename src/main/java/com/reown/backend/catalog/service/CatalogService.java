package com.reown.backend.catalog.service;

import com.reown.backend.catalog.dto.CategoryResponse;
import com.reown.backend.catalog.dto.ProductCreateRequest;
import com.reown.backend.catalog.dto.ProductDetailResponse;
import com.reown.backend.catalog.dto.ProductListResponse;
import com.reown.backend.catalog.dto.ProductOptionCreateRequest;
import com.reown.backend.catalog.dto.ProductOptionResponse;
import com.reown.backend.catalog.dto.ProductUpdateRequest;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.CategoryRepository;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {

    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public List<ProductListResponse> getProducts() {
        return productRepository.findByStatus("ON_SALE")
                .stream()
                .map(ProductListResponse::from)
                .toList();
    }

    public ProductDetailResponse getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));

        List<ProductOptionResponse> options = productOptionRepository.findByProductId(productId)
                .stream()
                .map(ProductOptionResponse::from)
                .toList();

        return ProductDetailResponse.from(product, options);
    }

    public List<ProductListResponse> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandIdAndStatusNot(brandId, "DELETED")
                .stream()
                .map(ProductListResponse::from)
                .toList();
    }

    @Transactional
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        String saleType = request.saleType() != null ? request.saleType() : "NORMAL";
        String status = request.status() != null ? request.status() : "WAITING";
        Integer displaySortOrder = request.displaySortOrder() != null ? request.displaySortOrder() : 0;

        Product product = new Product(
                request.brandId(),
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.weightG(),
                request.maxPurchasePerUser(),
                saleType,
                status,
                displaySortOrder
        );

        Product savedProduct = productRepository.save(product);

        return ProductDetailResponse.from(savedProduct, List.of());
    }

    @Transactional
    public ProductDetailResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));

        product.update(
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.weightG(),
                request.maxPurchasePerUser(),
                request.saleType(),
                request.status(),
                request.displaySortOrder()
        );

        List<ProductOptionResponse> options = productOptionRepository.findByProductId(productId)
                .stream()
                .map(ProductOptionResponse::from)
                .toList();

        return ProductDetailResponse.from(product, options);
    }

    @Transactional
    public ProductDetailResponse approveProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));
        product.approve();

        List<ProductOptionResponse> options = productOptionRepository.findByProductId(productId)
                .stream()
                .map(ProductOptionResponse::from)
                .toList();

        return ProductDetailResponse.from(product, options);
    }

    @Transactional
    public ProductDetailResponse rejectProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));
        product.reject();

        List<ProductOptionResponse> options = productOptionRepository.findByProductId(productId)
                .stream()
                .map(ProductOptionResponse::from)
                .toList();

        return ProductDetailResponse.from(product, options);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));

        product.delete();
    }

    @Transactional
    public ProductOptionResponse addProductOption(Long productId, ProductOptionCreateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));

        Integer reservedQuantity = request.reservedQuantity() != null
                ? request.reservedQuantity()
                : 0;

        ProductOption option = new ProductOption(
                product.getProductId(),
                request.size(),
                request.color(),
                request.colorHex(),
                request.stockQuantity(),
                request.safetyStock(),
                reservedQuantity
        );

        ProductOption savedOption = productOptionRepository.save(option);

        return ProductOptionResponse.from(savedOption);
    }
}