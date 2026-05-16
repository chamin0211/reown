package com.reown.backend.trade.dto;

public record SellerOrderSummaryResponse(
        long totalOrders,
        long paidOrders,
        long readyOrders,
        long preparingOrders,
        long shippedOrders,
        long deliveredOrders,
        long totalItems,
        int totalSalesAmount,
        int pendingShipmentAmount
) {
}
