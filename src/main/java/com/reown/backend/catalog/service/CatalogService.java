package com.reown.backend.catalog.service;

import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
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

    private static final String STATUS_WAITING = "WAITING";
    private static final String STATUS_ON_SALE = "ON_SALE";
    private static final String STATUS_DELETED = "DELETED";
    private static final String DEFAULT_SALE_TYPE = "NORMAL";
    private static final String SALE_TYPE_DESIGNER_LIMITED = "DESIGNER_LIMITED";

    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public List<ProductListResponse> getProducts() {
        return productRepository.findByStatusOrderByCreatedAtDesc(STATUS_ON_SALE)
                .stream()
                .map(this::toProductListResponse)
                .toList();
    }

    public ProductDetailResponse getProductDetail(Long productId) {
        Product product = getProduct(productId);

        if (!STATUS_ON_SALE.equals(product.getStatus())) {
            throw new IllegalArgumentException("판매 중인 상품만 조회할 수 있습니다. productId=" + productId);
        }

        return toProductDetailResponse(product);
    }

    public List<ProductListResponse> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandIdAndStatusOrderByCreatedAtDesc(brandId, STATUS_ON_SALE)
                .stream()
                .map(this::toProductListResponse)
                .toList();
    }

    public List<ProductListResponse> getAdminProducts(String status) {
        List<Product> products = status == null || status.isBlank()
                ? productRepository.findByStatusNotOrderByCreatedAtDesc(STATUS_DELETED)
                : productRepository.findByStatusOrderByCreatedAtDesc(status);

        return products.stream()
                .map(this::toProductListResponse)
                .toList();
    }

    public ProductDetailResponse getAdminProductDetail(Long productId) {
        return toProductDetailResponse(getProduct(productId));
    }

    public List<ProductListResponse> getSellerProducts(Long brandId, String status) {
        assertBrandExists(brandId);

        List<Product> products = status == null || status.isBlank()
                ? productRepository.findByBrandIdAndStatusNotOrderByCreatedAtDesc(brandId, STATUS_DELETED)
                : productRepository.findByBrandIdAndStatusOrderByCreatedAtDesc(brandId, status);

        return products.stream()
                .map(this::toProductListResponse)
                .toList();
    }

    public ProductDetailResponse getSellerProductDetail(Long brandId, Long productId) {
        Product product = getProduct(productId);
        assertProductBelongsToBrand(product, brandId);
        return toProductDetailResponse(product);
    }

    @Transactional
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        // 관리자용 등록 API입니다. status를 명시하지 않으면 승인 대기 상태로 저장합니다.
        Product savedProduct = saveProduct(request, request.status() != null ? request.status() : STATUS_WAITING);
        saveOptions(savedProduct.getProductId(), request.options());
        return toProductDetailResponse(savedProduct);
    }

    @Transactional
    public ProductDetailResponse createSellerProduct(ProductCreateRequest request) {
        assertBrandExists(request.brandId());

        if (SALE_TYPE_DESIGNER_LIMITED.equalsIgnoreCase(request.saleType())) {
            assertBrandOwnerIsDesigner(request.brandId());
        }

        // 셀러가 등록한 상품은 프론트에서 어떤 status를 보내더라도 반드시 승인 대기 상태로 저장합니다.
        Product savedProduct = saveProduct(request, STATUS_WAITING);
        saveOptions(savedProduct.getProductId(), request.options());
        return toProductDetailResponse(savedProduct);
    }

    @Transactional
    public ProductDetailResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = getProduct(productId);

        product.update(
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.categoryName(),
                request.description(),
                request.weightG(),
                request.maxPurchasePerUser(),
                request.saleType(),
                request.status(),
                request.displaySortOrder()
        );
        updateOptionsIfRequested(product.getProductId(), request.options());

        return toProductDetailResponse(product);
    }

    @Transactional
    public ProductDetailResponse updateSellerProduct(Long brandId, Long productId, ProductUpdateRequest request) {
        Product product = getProduct(productId);
        assertProductBelongsToBrand(product, brandId);

        // 셀러가 상품 내용을 수정하면 관리자 재검수가 필요하므로 다시 승인 대기 상태로 돌립니다.
        // 프론트에서 status를 보내더라도 셀러 수정 API에서는 직접 상태 변경을 허용하지 않습니다.
        product.update(
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.categoryName(),
                request.description(),
                request.weightG(),
                request.maxPurchasePerUser(),
                request.saleType(),
                STATUS_WAITING,
                request.displaySortOrder()
        );
        updateOptionsIfRequested(product.getProductId(), request.options());

        return toProductDetailResponse(product);
    }

    @Transactional
    public ProductDetailResponse approveProduct(Long productId) {
        Product product = getProduct(productId);
        product.approve();
        return toProductDetailResponse(product);
    }

    @Transactional
    public ProductDetailResponse rejectProduct(Long productId) {
        Product product = getProduct(productId);
        product.reject();
        return toProductDetailResponse(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = getProduct(productId);
        product.delete();
    }

    @Transactional
    public void deleteSellerProduct(Long brandId, Long productId) {
        Product product = getProduct(productId);
        assertProductBelongsToBrand(product, brandId);
        product.delete();
    }

    @Transactional
    public ProductOptionResponse addProductOption(Long productId, ProductOptionCreateRequest request) {
        Product product = getProduct(productId);
        ProductOption savedOption = productOptionRepository.save(toProductOption(product.getProductId(), request));
        return ProductOptionResponse.from(savedOption);
    }

    private Product saveProduct(ProductCreateRequest request, String status) {
        String saleType = request.saleType() != null ? request.saleType() : DEFAULT_SALE_TYPE;
        Integer displaySortOrder = request.displaySortOrder() != null ? request.displaySortOrder() : 0;

        Product product = new Product(
                request.brandId(),
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.categoryName(),
                request.description(),
                request.weightG(),
                request.maxPurchasePerUser(),
                saleType,
                status,
                displaySortOrder
        );

        return productRepository.save(product);
    }

    private void saveOptions(Long productId, List<ProductOptionCreateRequest> options) {
        if (options == null || options.isEmpty()) {
            return;
        }

        List<ProductOption> productOptions = options.stream()
                .map(option -> toProductOption(productId, option))
                .toList();

        productOptionRepository.saveAll(productOptions);
    }

    private void updateOptionsIfRequested(Long productId, List<ProductOptionCreateRequest> requestedOptions) {
        if (requestedOptions == null || requestedOptions.isEmpty()) {
            return;
        }

        List<ProductOption> existingOptions = productOptionRepository.findByProductId(productId);

        for (int i = 0; i < requestedOptions.size(); i++) {
            ProductOptionCreateRequest request = requestedOptions.get(i);

            Integer reservedQuantity = request.reservedQuantity() != null
                    ? request.reservedQuantity()
                    : 0;

            if (i < existingOptions.size()) {
                ProductOption option = existingOptions.get(i);
                option.update(
                        request.size(),
                        request.color(),
                        request.colorHex(),
                        request.stockQuantity(),
                        request.safetyStock(),
                        request.reservedQuantity()
                );
            } else {
                productOptionRepository.save(new ProductOption(
                        productId,
                        request.size(),
                        request.color(),
                        request.colorHex(),
                        request.stockQuantity(),
                        request.safetyStock(),
                        reservedQuantity
                ));
            }
        }
    }

    private ProductOption toProductOption(Long productId, ProductOptionCreateRequest request) {
        Integer reservedQuantity = request.reservedQuantity() != null
                ? request.reservedQuantity()
                : 0;

        return new ProductOption(
                productId,
                request.size(),
                request.color(),
                request.colorHex(),
                request.stockQuantity(),
                request.safetyStock(),
                reservedQuantity
        );
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));
    }

    private Brand assertBrandExists(Long brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId));
    }

    private void assertBrandOwnerIsDesigner(Long brandId) {
        Brand brand = assertBrandExists(brandId);

        userRepository.findById(brand.getOwnerUserId())
                .filter(user -> user.getRole() == UserRole.DESIGNER)
                .orElseThrow(() -> new IllegalArgumentException("디자이너로 승인된 셀러만 디자이너 한정판을 등록할 수 있습니다."));
    }

    private void assertProductBelongsToBrand(Product product, Long brandId) {
        if (!product.getBrandId().equals(brandId)) {
            throw new IllegalArgumentException("해당 브랜드의 상품이 아닙니다.");
        }
    }


    private ProductListResponse toProductListResponse(Product product) {
        return ProductListResponse.from(product, getBrandName(product.getBrandId()));
    }

    private ProductDetailResponse toProductDetailResponse(Product product) {
        List<ProductOptionResponse> options = productOptionRepository.findByProductId(product.getProductId())
                .stream()
                .map(ProductOptionResponse::from)
                .toList();

        return ProductDetailResponse.from(product, getBrandName(product.getBrandId()), options);
    }

    private String getBrandName(Long brandId) {
        return brandRepository.findById(brandId)
                .map(Brand::getBrandName)
                .orElse("Brand #" + brandId);
    }
}
