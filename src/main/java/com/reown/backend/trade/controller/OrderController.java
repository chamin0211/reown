package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.OrderCreateRequest;
import com.reown.backend.trade.dto.OrderResponse;
import com.reown.backend.trade.dto.PurchasedOrderItemResponse;
import com.reown.backend.trade.dto.ShippingRequest;
import com.reown.backend.trade.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final TradeService tradeService;

    @PostMapping
    public OrderResponse createOrder(
            @Valid @RequestBody OrderCreateRequest request
    ) {
        return tradeService.createOrder(request);
    }

    @GetMapping("/admin")
    public List<OrderResponse> getAllOrders() {
        return tradeService.getAllOrders();
    }

    @PatchMapping("/admin/{orderId}/prepare-shipping")
    public OrderResponse prepareShipping(
            @PathVariable Long orderId
    ) {
        return tradeService.prepareShipping(orderId);
    }

    @PatchMapping("/admin/{orderId}/ship")
    public OrderResponse shipOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) ShippingRequest request
    ) {
        String trackingNumber = request != null ? request.trackingNumber() : null;
        return tradeService.shipOrder(orderId, trackingNumber);
    }

    @PatchMapping("/admin/{orderId}/deliver")
    public OrderResponse deliverOrder(
            @PathVariable Long orderId
    ) {
        return tradeService.deliverOrder(orderId);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(
            @PathVariable Long orderId
    ) {
        return tradeService.getOrder(orderId);
    }

    @GetMapping("/users/{userId}")
    public List<OrderResponse> getOrdersByUserId(
            @PathVariable Long userId
    ) {
        return tradeService.getOrdersByUserId(userId);
    }

    @GetMapping("/users/{userId}/items")
    public List<PurchasedOrderItemResponse> getPurchasedOrderItems(
            @PathVariable Long userId
    ) {
        return tradeService.getPurchasedOrderItems(userId);
    }
}