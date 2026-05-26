import { api } from './client';

export interface BrandContractResponse {
  brandId: number;
  brandName: string;
  ownerUserId: number;
  ownerLoginId: string;
  ownerNickname: string;
  ownerRole: string;
  businessNumber: string | null;
  status: string;
  salesStatus: string;
  settlementCycle: string | null;
  commissionRate: number | null;
}

export function getBrandContracts(): Promise<BrandContractResponse[]> {
  return api<BrandContractResponse[]>('/api/admin/brands/contracts');
}

export function updateBrandContract(
  brandId: number | string,
  data: { settlementCycle?: string; commissionRate?: number; salesStatus?: string }
): Promise<BrandContractResponse> {
  return api<BrandContractResponse>(`/api/admin/brands/${brandId}/contract`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
