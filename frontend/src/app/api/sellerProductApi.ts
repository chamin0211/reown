import { api } from './client';
import type {
  ProductCreateRequest,
  ProductDetailResponse,
  ProductListResponse,
  ProductStatus,
  ProductUpdateRequest,
} from './adminProductApi';

export function getSellerProducts(
  brandId: number,
  status?: ProductStatus | string
): Promise<ProductListResponse[]> {
  const params = new URLSearchParams({ brandId: String(brandId) });
  if (status) params.set('status', status);
  return api<ProductListResponse[]>(`/api/seller/products?${params.toString()}`);
}

export function getSellerProduct(
  brandId: number,
  productId: number | string
): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/seller/products/${productId}?brandId=${brandId}`);
}

export function createSellerProduct(data: ProductCreateRequest): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>('/api/seller/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSellerProduct(
  brandId: number,
  productId: number | string,
  data: ProductUpdateRequest
): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/seller/products/${productId}?brandId=${brandId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteSellerProduct(
  brandId: number,
  productId: number | string
): Promise<{ message: string; productId: string }> {
  return api<{ message: string; productId: string }>(`/api/seller/products/${productId}?brandId=${brandId}`, {
    method: 'DELETE',
  });
}
