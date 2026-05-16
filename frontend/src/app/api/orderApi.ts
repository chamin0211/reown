import { api } from './client';

export interface OrderItemResponse {
    orderItemId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    optionId: number;
    size: string | null;
    color: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemStatus: string;
}

export interface OrderResponse {
    orderId: number;
    userId: number;
    orderNo: string;
    totalPaymentAmount: number;
    shippingAddressSnapshot: string | null;
    status: string;
    shippingStatus: string;
    trackingNumber: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
    items: OrderItemResponse[];
}

export interface PaymentResponse {
    paymentId: number;
    orderId: number;
    pgTid: string;
    paymentMethod: string;
    amount: number;
    status: string;
    paidAt: string;
}

export function createOrder(data: {
    userId: number;
    shippingAddressSnapshot: string;
}): Promise<OrderResponse> {
    return api<OrderResponse>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function getOrder(orderId: number): Promise<OrderResponse> {
    return api<OrderResponse>(`/api/orders/${orderId}`);
}

export function mockPayment(data: {
    orderId: number;
    paymentMethod: string;
}): Promise<PaymentResponse> {
    return api<PaymentResponse>('/api/payments/mock', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export interface PurchasedOrderItemResponse {
    orderId: number;
    orderNo: string;
    orderItemId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    optionId: number;
    size: string | null;
    color: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemStatus: string;
    orderStatus: string;
    shippingStatus: string;
    trackingNumber: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    shippingAddressSnapshot: string | null;
    orderedAt: string;
}

export function getPurchasedOrderItems(userId: number): Promise<PurchasedOrderItemResponse[]> {
    return api<PurchasedOrderItemResponse[]>(`/api/orders/users/${userId}/items`);
}

export interface SellerOrderItemResponse {
    orderId: number;
    orderNo: string;
    userId: number;
    orderTotalPaymentAmount: number;
    orderStatus: string;
    shippingStatus: string;
    trackingNumber: string | null;
    shippingAddressSnapshot: string | null;
    orderedAt: string;
    shippedAt: string | null;
    deliveredAt: string | null;
    orderItemId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    brandId: number;
    optionId: number;
    size: string | null;
    color: string | null;
    quantity: number;
    unitPrice: number;
    itemTotalPrice: number;
    itemStatus: string;
}

export interface SellerOrderSummaryResponse {
    totalOrders: number;
    paidOrders: number;
    readyOrders: number;
    preparingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalItems: number;
    totalSalesAmount: number;
    pendingShipmentAmount: number;
}

export function getSellerOrders(brandId: number): Promise<SellerOrderItemResponse[]> {
    return api<SellerOrderItemResponse[]>(`/api/orders/seller?brandId=${brandId}`);
}

export function getSellerOrderSummary(brandId: number): Promise<SellerOrderSummaryResponse> {
    return api<SellerOrderSummaryResponse>(`/api/orders/seller/summary?brandId=${brandId}`);
}

export function prepareSellerOrderShipping(orderId: number, brandId: number): Promise<OrderResponse> {
    return api<OrderResponse>(`/api/orders/seller/${orderId}/prepare-shipping?brandId=${brandId}`, {
        method: 'PATCH',
    });
}

export function shipSellerOrder(orderId: number, brandId: number, trackingNumber?: string): Promise<OrderResponse> {
    return api<OrderResponse>(`/api/orders/seller/${orderId}/ship?brandId=${brandId}`, {
        method: 'PATCH',
        body: JSON.stringify({ trackingNumber: trackingNumber || null }),
    });
}

export function deliverSellerOrder(orderId: number, brandId: number): Promise<OrderResponse> {
    return api<OrderResponse>(`/api/orders/seller/${orderId}/deliver?brandId=${brandId}`, {
        method: 'PATCH',
    });
}

export function getAdminOrders(): Promise<OrderResponse[]> {
    return api<OrderResponse[]>('/api/orders/admin');
}
