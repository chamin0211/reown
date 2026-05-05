package com.reown.backend.trade.service;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.trade.dto.WishItemAddRequest;
import com.reown.backend.trade.dto.WishItemResponse;
import com.reown.backend.trade.entity.TradeWishItem;
import com.reown.backend.trade.repository.TradeWishItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishService {

    private final TradeWishItemRepository wishItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public WishItemResponse addWishItem(WishItemAddRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + request.productId()));

        TradeWishItem wishItem = wishItemRepository
                .findByUserIdAndProductId(request.userId(), request.productId())
                .orElseGet(() -> wishItemRepository.save(new TradeWishItem(
                        request.userId(),
                        request.productId()
                )));

        return WishItemResponse.from(wishItem, product);
    }

    public List<WishItemResponse> getWishItems(Long userId) {
        return wishItemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(wishItem -> {
                    Product product = productRepository.findById(wishItem.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + wishItem.getProductId()));

                    return WishItemResponse.from(wishItem, product);
                })
                .toList();
    }

    public boolean isWished(Long userId, Long productId) {
        return wishItemRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void deleteWishItem(Long wishId) {
        if (!wishItemRepository.existsById(wishId)) {
            throw new IllegalArgumentException("찜 상품을 찾을 수 없습니다. wishId=" + wishId);
        }

        wishItemRepository.deleteById(wishId);
    }

    @Transactional
    public void deleteWishItemByProduct(Long userId, Long productId) {
        if (!wishItemRepository.existsByUserIdAndProductId(userId, productId)) {
            return;
        }

        wishItemRepository.deleteByUserIdAndProductId(userId, productId);
    }
}