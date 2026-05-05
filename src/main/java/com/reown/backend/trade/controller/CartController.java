package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.CartItemAddRequest;
import com.reown.backend.trade.dto.CartItemResponse;
import com.reown.backend.trade.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.reown.backend.trade.dto.CartItemQuantityUpdateRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final TradeService tradeService;

    @PostMapping("/items")
    public CartItemResponse addCartItem(
            @Valid @RequestBody CartItemAddRequest request
    ) {
        return tradeService.addCartItem(request);
    }

    @GetMapping
    public List<CartItemResponse> getCartItems(
            @RequestParam Long userId
    ) {
        return tradeService.getCartItems(userId);
    }

    @PatchMapping("/items/{cartItemId}")
    public CartItemResponse updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartItemQuantityUpdateRequest request
    ) {
        return tradeService.updateCartItemQuantity(cartItemId, request);
    }

    @DeleteMapping("/items/{cartItemId}")
    public Map<String, String> deleteCartItem(
            @PathVariable Long cartItemId
    ) {
        tradeService.deleteCartItem(cartItemId);

        return Map.of(
                "message", "장바구니 상품이 삭제되었습니다.",
                "cartItemId", String.valueOf(cartItemId)
        );
    }
}
