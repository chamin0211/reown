import { api } from './client';
import type {
  ProductCreateRequest,
  ProductDetailResponse,
  ProductListResponse,
  ProductStatus,
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
