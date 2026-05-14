/*
DB 관련 설명
- 이 파일은 프론트에서 펀딩 DB 데이터를 다룰 때 사용하는 API 함수입니다.
- 백엔드에서는 주로 아래 테이블을 사용합니다.
  1) trade_funding_campaign: 펀딩 캠페인 정보입니다. 목표 금액, 현재 금액, 시작일, 종료일, 상태가 저장됩니다.
  2) trade_funding_participation: 사용자의 펀딩 참여 내역입니다. user_id, campaign_id, amount, option_id, quantity, unit_price가 저장됩니다.
  3) catalog_product: 펀딩 상품의 이름, 가격, 이미지 URL을 저장합니다.
  4) catalog_product_option: 사용자가 선택하는 색상/사이즈 옵션을 저장합니다.
- 더미 SQL로 넣은 데이터든, 나중에 판매자가 웹에서 등록한 데이터든 같은 API를 통해 조회/참여합니다.
*/
import { api } from './client';
import type { Product } from '../data/products';

export interface FundingCampaignResponse {
  campaignId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string | null;
  productPrice: number;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressRate: number;
  startDate: string | null;
  endDate: string | null;
  fundingStatus: string;
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
    brandName: fallbackBrandName,
    price: campaign.productPrice,
    saleType: 'FUNDING',
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
      { stage: 'funding_open', label: '펀딩 오픈', completed: true },
      { stage: 'target_progress', label: '목표 금액 달성 중', completed: campaign.progressRate > 0 },
      { stage: 'production', label: '생산 준비', completed: campaign.fundingStatus === 'SUCCESS' },
      { stage: 'shipping_prep', label: '배송 준비', completed: false },
    ],
  };
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
