import { api } from "./client";

export interface CartItemResponse {
    cartId: number;
    userId: number;
    productId: number;
    productName: string;
    optionId: number;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export function getCartItems(userId: number): Promise<CartItemResponse[]> {
    return api<CartItemResponse[]>(`/api/cart?userId=${userId}`);
}

export function addCartItem(data: {
    userId: number;
    optionId: number;
    quantity: number;
}): Promise<CartItemResponse> {
    return api<CartItemResponse>("/api/cart/items", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function deleteCartItem(cartItemId: number): Promise<{ message: string; cartItemId: string }> {
    return api<{ message: string; cartItemId: string }>(`/api/cart/items/${cartItemId}`, {
        method: "DELETE",
    });
}