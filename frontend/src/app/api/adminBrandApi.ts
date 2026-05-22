import { api } from './client';

export type BrandStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | string;
export type BrandSalesStatus = 'ACTIVE' | 'INACTIVE' | string;

export interface BrandResponse {
  brandId: number;
  ownerUserId: number;
  brandName: string;
  brandLogoUrl: string | null;
  businessNumber: string | null;
  salesStatus: BrandSalesStatus;
  settlementCycle: string | null;
  status: BrandStatus;
}

export function getAdminBrands(status?: BrandStatus): Promise<BrandResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return api<BrandResponse[]>(`/api/admin/brands${query}`);
}

export function approveBrand(brandId: number | string): Promise<BrandResponse> {
  return api<BrandResponse>(`/api/admin/brands/${brandId}/approve`, {
    method: 'PATCH',
  });
}

export function rejectBrand(brandId: number | string): Promise<BrandResponse> {
  return api<BrandResponse>(`/api/admin/brands/${brandId}/reject`, {
    method: 'PATCH',
  });
}
