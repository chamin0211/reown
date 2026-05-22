import { api } from './client';

export type SellerRole = 'SELLER' | 'DESIGNER' | string;

export interface AdminSellerResponse {
  brandId: number;
  ownerUserId: number;
  ownerEmail: string;
  ownerNickname: string;
  ownerRole: SellerRole;
  brandName: string;
  brandLogoUrl: string | null;
  businessNumber: string | null;
  salesStatus: string;
  settlementCycle: string | null;
  status: string;
}

export function getAdminSellers(): Promise<AdminSellerResponse[]> {
  return api<AdminSellerResponse[]>('/api/admin/sellers');
}

export function grantDesignerRole(brandId: number | string): Promise<AdminSellerResponse> {
  return api<AdminSellerResponse>(`/api/admin/sellers/${brandId}/grant-designer`, {
    method: 'PATCH',
  });
}

export function revokeDesignerRole(brandId: number | string): Promise<AdminSellerResponse> {
  return api<AdminSellerResponse>(`/api/admin/sellers/${brandId}/revoke-designer`, {
    method: 'PATCH',
  });
}
