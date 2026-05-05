package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.WishItemAddRequest;
import com.reown.backend.trade.dto.WishItemResponse;
import com.reown.backend.trade.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    @PostMapping("/items")
    public WishItemResponse addWishItem(
            @RequestBody WishItemAddRequest request
    ) {
        return wishService.addWishItem(request);
    }

    @GetMapping
    public List<WishItemResponse> getWishItems(
            @RequestParam Long userId
    ) {
        return wishService.getWishItems(userId);
    }

    @GetMapping("/products/{productId}")
    public Map<String, Boolean> isWished(
            @RequestParam Long userId,
            @PathVariable Long productId
    ) {
        return Map.of("wished", wishService.isWished(userId, productId));
    }

    @DeleteMapping("/items/{wishId}")
    public Map<String, String> deleteWishItem(
            @PathVariable Long wishId
    ) {
        wishService.deleteWishItem(wishId);

        return Map.of(
                "message", "찜 상품이 삭제되었습니다.",
                "wishId", String.valueOf(wishId)
        );
    }

    @DeleteMapping("/products/{productId}")
    public Map<String, String> deleteWishItemByProduct(
            @RequestParam Long userId,
            @PathVariable Long productId
    ) {
        wishService.deleteWishItemByProduct(userId, productId);

        return Map.of(
                "message", "찜 상품이 삭제되었습니다.",
                "productId", String.valueOf(productId)
        );
    }
}