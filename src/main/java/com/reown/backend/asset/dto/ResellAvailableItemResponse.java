package com.reown.backend.asset.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;

import java.time.LocalDateTime;

/**
 * 구버전 구매기반 리셀 등록 호환용 DTO.
 * 신규 프리미엄 리셀 MVP에서는 일반 구매내역에서 리셀 등록하지 않습니다.
 */
public record ResellAvailableItemResponse(
        Long orderId,
        String orderNo,
        Long orderItemId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        Integer quantity,
        Integer unitPrice,
        Integer totalPrice,
        String orderStatus,
        String shippingStatus,
        LocalDateTime orderedAt,
        LocalDateTime deliveredAt
) {
    public static ResellAvailableItemResponse from(TradeOrder order, TradeOrderItem item, Product product, ProductOption option) {
        return new ResellAvailableItemResponse(
                order.getOrderId(),
                order.getOrderNo(),
                item.getOrderItemId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getQuantity() * item.getUnitPrice(),
                order.getStatus(),
                order.getShippingStatus(),
                order.getCreatedAt(),
                order.getDeliveredAt()
        );
    }
}
