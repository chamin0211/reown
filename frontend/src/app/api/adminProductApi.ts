import { api } from './client';

export type ProductStatus = 'WAITING' | 'ON_SALE' | 'REJECTED' | 'DELETED';
export type ProductSaleType = 'NORMAL' | 'FUNDING' | 'RESELL' | 'DESIGNER_LIMITED';

export interface ProductOptionResponse {
  optionId: number;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stockQuantity: number;
  safetyStock: number | null;
  reservedQuantity: number;
}

export interface ProductListResponse {
  productId: number;
  brandId: number;
  brandName: string | null;
  name: string;
  thumbnailUrl: string | null;
  price: number;
  categoryName: string | null;
  description: string | null;
  saleType: string;
  status: string;
  createdAt: string;
}

export interface ProductDetailResponse extends ProductListResponse {
  weightG: number | null;
  maxPurchasePerUser: number | null;
  displaySortOrder: number | null;
  options: ProductOptionResponse[];
}

export interface ProductOptionCreateRequest {
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  stockQuantity: number;
  safetyStock?: number | null;
  reservedQuantity?: number | null;
}

export interface ProductCreateRequest {
  brandId: number;
  name: string;
  thumbnailUrl?: string | null;
  price: number;
  categoryName?: string | null;
  description?: string | null;
  weightG?: number | null;
  maxPurchasePerUser?: number | null;
  saleType?: ProductSaleType | string;
  status?: ProductStatus | string;
  displaySortOrder?: number | null;
  options?: ProductOptionCreateRequest[];
}

export interface ProductUpdateRequest {
  name?: string | null;
  thumbnailUrl?: string | null;
  price?: number | null;
  categoryName?: string | null;
  description?: string | null;
  weightG?: number | null;
  maxPurchasePerUser?: number | null;
  saleType?: ProductSaleType | string | null;
  status?: ProductStatus | string | null;
  displaySortOrder?: number | null;
  options?: ProductOptionCreateRequest[];
}

export function getAdminProducts(status?: ProductStatus | string): Promise<ProductListResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return api<ProductListResponse[]>(`/api/admin/products${query}`);
}

export function getAdminProduct(productId: number | string): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/admin/products/${productId}`);
}

export function approveProduct(productId: number | string): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/admin/products/${productId}/approve`, {
    method: 'PATCH',
  });
}

export function rejectProduct(productId: number | string): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/admin/products/${productId}/reject`, {
    method: 'PATCH',
  });
}

export function createAdminProduct(data: ProductCreateRequest): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminProduct(
  productId: number | string,
  data: ProductUpdateRequest
): Promise<ProductDetailResponse> {
  return api<ProductDetailResponse>(`/api/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
