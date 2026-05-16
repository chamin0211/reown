/*
DB 관련 설명
- 펀딩 API는 아래 테이블을 사용합니다.
  1) catalog_product: sale_type='FUNDING'인 펀딩 상품 기본 정보
  2) catalog_product_option: 펀딩 옵션
  3) trade_funding_campaign: 목표 금액, 현재 금액, 시작일, 종료일, 펀딩 상태
  4) trade_funding_participation: 사용자 펀딩 참여 내역
- 셀러 등록 → WAITING, 관리자 승인 → OPEN, 목표 달성 → SUCCESS 흐름입니다.
*/
import { api } from './client';
import type { Product } from '../data/products';

export interface FundingCampaignResponse {
  campaignId: number;
  productId: number;
  brandId?: number | null;
  brandName?: string | null;
  productName: string;
  thumbnailUrl: string | null;
  productPrice: number;
  categoryName?: string | null;
  productStatus?: string | null;
  maxPurchasePerUser?: number | null;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressRate: number;
  startDate: string | null;
  endDate: string | null;
  fundingStatus: string;
  productionStage?: string | null;
  productionStageLabel?: string | null;
  canUpdateProductionStage?: boolean | null;
  participantCount?: number | null;
  remainingDays?: number | null;
}

export interface SellerFundingCreateRequest {
  brandId: number;
  name: string;
  thumbnailUrl?: string | null;
  price: number;
  categoryName?: string | null;
  description?: string | null;
  targetAmount: number;
  startDate?: string | null;
  endDate?: string | null;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  stockQuantity?: number | null;
  safetyStock?: number | null;
  maxPurchasePerUser?: number | null;
}

export interface FundingParticipateRequest {
  userId: number;
  optionId?: number | null;
  quantity: number;
  amount: number;
}

export interface FundingParticipateResponse {
  userId: number;
  participatedAmount: number;
  participationId: number;
  optionId: number | null;
  quantity: number;
  unitPrice: number;
  campaign: FundingCampaignResponse;
}

export interface FundingParticipationResponse {
  participationId: number;
  campaignId: number;
  userId: number;
  optionId: number | null;
  quantity: number | null;
  unitPrice: number | null;
  amount: number;
  status: string;
  createdAt: string;
}

export interface FundingUpdateCreateRequest {
  updateType?: string | null;
  title: string;
  content: string;
  productionStage?: string | null;
}

export interface FundingUpdateResponse {
  updateId: number;
  campaignId: number;
  writerId?: number | null;
  updateType: string;
  updateTypeLabel?: string | null;
  title: string;
  content: string;
  productionStage?: string | null;
  productionStageLabel?: string | null;
  createdAt: string;
}

const fallbackBrandName = 'RE:OWN FUNDING';

function getFundingImageUrl(campaign: FundingCampaignResponse): string {
  if (campaign.thumbnailUrl && campaign.thumbnailUrl.startsWith('http')) {
    return campaign.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-funding-${campaign.productId}/600/800`;
}

export function calculateRemainingDays(endDate?: string | null): number | undefined {
  if (!endDate) return undefined;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return undefined;

  const diffMs = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function mapFundingToProduct(campaign: FundingCampaignResponse): Product {
  const imageUrl = getFundingImageUrl(campaign);

  return {
    productId: String(campaign.productId),
    fundingCampaignId: campaign.campaignId,
    name: campaign.productName,
    brandName: campaign.brandName || fallbackBrandName,
    price: campaign.productPrice,
    saleType: 'FUNDING',
    categoryName: campaign.categoryName ?? undefined,
    ogImageUrl: imageUrl,
    images: [imageUrl],
    availableSizes: ['Free'],
    availableColors: [{ name: '기본', code: '#101828' }],
    options: [],
    description: `${campaign.productName} 펀딩 상품입니다. 목표 금액 달성 시 제작 및 배송이 진행됩니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '-' }],
    reviews: [],
    fundingAchievementRate: campaign.progressRate,
    fundingTargetAmount: campaign.targetAmount,
    fundingCurrentAmount: campaign.currentAmount,
    fundingRemainingAmount: campaign.remainingAmount,
    fundingStatus: campaign.fundingStatus,
    fundingStartDate: campaign.startDate ?? undefined,
    fundingEndDate: campaign.endDate ?? undefined,
    remainingDays: calculateRemainingDays(campaign.endDate),
    productionStages: [
      { stage: 'funding_open', label: '펀딩 오픈', completed: campaign.fundingStatus === 'OPEN' || campaign.fundingStatus === 'SUCCESS' },
      { stage: 'target_progress', label: '목표 금액 달성', completed: campaign.fundingStatus === 'SUCCESS' || campaign.progressRate >= 100 },
      { stage: 'production', label: campaign.productionStageLabel || '제작 준비', completed: campaign.fundingStatus === 'SUCCESS' },
      { stage: 'shipping_prep', label: '배송 준비/완료', completed: campaign.productionStage === 'SHIPPING_PREP' || campaign.productionStage === 'SHIPPED' },
    ],
  };
}

export async function createSellerFundingProduct(
  request: SellerFundingCreateRequest
): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>('/api/fundings/seller', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getSellerFundings(
  brandId: string | number,
  status?: string
): Promise<FundingCampaignResponse[]> {
  const params = new URLSearchParams({ brandId: String(brandId) });
  if (status) params.set('status', status);
  return api<FundingCampaignResponse[]>(`/api/fundings/seller?${params.toString()}`);
}

export async function getAdminFundings(status?: string): Promise<FundingCampaignResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return api<FundingCampaignResponse[]>(`/api/fundings/admin${query}`);
}

export async function approveFunding(campaignId: string | number): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>(`/api/fundings/admin/${campaignId}/approve`, { method: 'PATCH' });
}

export async function rejectFunding(campaignId: string | number): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>(`/api/fundings/admin/${campaignId}/reject`, { method: 'PATCH' });
}

export async function updateSellerFundingProductionStage(
  campaignId: string | number,
  brandId: string | number,
  productionStage: string
): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>(
    `/api/fundings/seller/${campaignId}/production-stage?brandId=${encodeURIComponent(String(brandId))}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ productionStage }),
    }
  );
}

export async function updateAdminFundingProductionStage(
  campaignId: string | number,
  productionStage: string
): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>(`/api/fundings/admin/${campaignId}/production-stage`, {
    method: 'PATCH',
    body: JSON.stringify({ productionStage }),
  });
}

export async function getFundings(status?: string): Promise<FundingCampaignResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return api<FundingCampaignResponse[]>(`/api/fundings${query}`);
}

export async function getFunding(campaignId: string | number): Promise<FundingCampaignResponse> {
  return api<FundingCampaignResponse>(`/api/fundings/${campaignId}`);
}

export async function getFundingProducts(status?: string): Promise<Product[]> {
  const campaigns = await getFundings(status);
  return campaigns.map(mapFundingToProduct);
}

export async function participateFunding(
  campaignId: string | number,
  request: FundingParticipateRequest
): Promise<FundingParticipateResponse> {
  return api<FundingParticipateResponse>(`/api/fundings/${campaignId}/participate`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function cancelFundingParticipation(
  participationId: string | number,
  userId: string | number
): Promise<FundingParticipateResponse> {
  return api<FundingParticipateResponse>(
    `/api/fundings/participations/${participationId}/cancel?userId=${encodeURIComponent(String(userId))}`,
    { method: 'PATCH' }
  );
}

export async function getFundingParticipationsByUser(
  userId: string | number
): Promise<FundingParticipationResponse[]> {
  return api<FundingParticipationResponse[]>(`/api/fundings/users/${userId}/participations`);
}

export async function getFundingParticipationsByCampaign(
  campaignId: string | number
): Promise<FundingParticipationResponse[]> {
  return api<FundingParticipationResponse[]>(`/api/fundings/${campaignId}/participations`);
}

export async function getFundingUpdates(
  campaignId: string | number
): Promise<FundingUpdateResponse[]> {
  return api<FundingUpdateResponse[]>(`/api/fundings/${campaignId}/updates`);
}

export async function createSellerFundingUpdate(
  campaignId: string | number,
  brandId: string | number,
  request: FundingUpdateCreateRequest
): Promise<FundingUpdateResponse> {
  return api<FundingUpdateResponse>(
    `/api/fundings/seller/${campaignId}/updates?brandId=${encodeURIComponent(String(brandId))}`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
}
