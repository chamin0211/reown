import { api } from './client';

export interface OrderItemResponse {
    orderItemId: number;
    productId: number;
    productName: string;
    optionId: number;
    size: string;
    color: string;
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
    shippingAddressSnapshot: string;
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
    orderItemId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    optionId: number;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemStatus: string;
    orderedAt: string;
}

export function getPurchasedOrderItems(userId: number): Promise<PurchasedOrderItemResponse[]> {
    return api<PurchasedOrderItemResponse[]>(`/api/orders/users/${userId}/items`);
}