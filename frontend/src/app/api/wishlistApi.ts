import { api } from './client';

export interface WishItemResponse {
    wishId: number;
    userId: number;
    productId: number;
    brandId: number;
    productName: string;
    thumbnailUrl: string | null;
    price: number;
    saleType: string;
    status: string;
    createdAt: string;
}

export function getWishlistItems(userId: number): Promise<WishItemResponse[]> {
    return api<WishItemResponse[]>(`/api/wishlist?userId=${userId}`);
}

export function addWishlistItem(data: {
    userId: number;
    productId: number;
}): Promise<WishItemResponse> {
    return api<WishItemResponse>('/api/wishlist/items', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function isProductWished(
    userId: number,
    productId: number
): Promise<{ wished: boolean }> {
    return api<{ wished: boolean }>(`/api/wishlist/products/${productId}?userId=${userId}`);
}

export function deleteWishlistItem(wishId: number): Promise<{ message: string; wishId: string }> {
    return api<{ message: string; wishId: string }>(`/api/wishlist/items/${wishId}`, {
        method: 'DELETE',
    });
}

export function deleteWishlistItemByProduct(
    userId: number,
    productId: number
): Promise<{ message: string; productId: string }> {
    return api<{ message: string; productId: string }>(
        `/api/wishlist/products/${productId}?userId=${userId}`,
        {
            method: 'DELETE',
        }
    );
}