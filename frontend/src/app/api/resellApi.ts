import { api } from './client';

export interface ResellResponse {
  resellId: number;
  orderItemId: number | null;
  sellerId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string | null;
  optionId: number;
  size: string | null;
  color: string | null;
  resellPrice: number;
  startPrice: number;
  instantBuyPrice: number;
  currentHighestBid: number;
  currentHighestBidderId: number | null;
  minBidIncrement: number;
  bidCount: number;
  auctionEndAt: string | null;
  rarityGrade: string | null;
  conditionDescription: string | null;
  verificationNote: string | null;
  premiumReason: string | null;
  status: string;
  createdAt: string;
}

export interface ResellOfferResponse {
  offerId: number;
  resellId: number;
  buyerId: number;
  offerPrice: number;
  status: string;
  createdAt: string;
}

export interface ResellOfferDetailResponse {
  offerId: number;
  resellId: number;
  buyerId: number;
  offerPrice: number;
  offerStatus: string;
  sellerId: number;
  resellStatus: string;
  startPrice: number;
  instantBuyPrice: number;
  currentHighestBid: number;
  productId: number;
  productName: string;
  thumbnailUrl: string | null;
  optionId: number;
  size: string | null;
  color: string | null;
  rarityGrade: string | null;
  auctionEndAt: string | null;
  createdAt: string;
}

export interface ResellTransactionResponse {
  transactionId: number;
  resellId: number;
  buyerId: number;
  resellPrice: number;
  platformFee: number;
  settlementAmount: number | null;
  status: string;
  courierName: string | null;
  trackingNumber: string | null;
  cancelReason: string | null;
  createdAt: string;
  paidAt: string | null;
  shipmentPreparedAt: string | null;
  shippedAt: string | null;
  purchaseConfirmedAt: string | null;
  settledAt: string | null;
  canceledAt: string | null;
}

export interface ResellTransactionDetailResponse extends ResellTransactionResponse {
  sellerId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string | null;
  optionId: number;
  size: string | null;
  color: string | null;
  rarityGrade: string | null;
}

export interface CreatePremiumResellRequest {
  // 셀러 등록용입니다. sellerId는 현재 로그인한 셀러 userId를 사용합니다.
  sellerId?: number;
  brandId?: number;

  // 새 프리미엄 리셀 상품 정보
  productName: string;
  thumbnailUrl: string;
  categoryName: string;
  size: string;
  color: string;
  colorHex?: string;

  startPrice: number;
  instantBuyPrice: number;
  minBidIncrement: number;
  auctionEndAt: string;
  rarityGrade: string;
  conditionDescription: string;
  verificationNote: string;
  premiumReason: string;

  // 구버전 ID 기반 등록 호환용. 새 셀러 화면에서는 사용하지 않습니다.
  productId?: number;
  optionId?: number;
}

export function getResells(): Promise<ResellResponse[]> {
  return api<ResellResponse[]>('/api/resells');
}

export function getAdminResells(): Promise<ResellResponse[]> {
  return api<ResellResponse[]>('/api/resells/admin');
}

export function getResellDetail(resellId: number): Promise<ResellResponse> {
  return api<ResellResponse>(`/api/resells/${resellId}`);
}

export function createPremiumResell(data: CreatePremiumResellRequest): Promise<ResellResponse> {
  return api<ResellResponse>('/api/resells', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePremiumResell(resellId: number, data: CreatePremiumResellRequest): Promise<ResellResponse> {
  return api<ResellResponse>(`/api/resells/${resellId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function approveResell(resellId: number): Promise<ResellResponse> {
  return api<ResellResponse>(`/api/resells/${resellId}/approve`, { method: 'PATCH' });
}

export function rejectResell(resellId: number): Promise<ResellResponse> {
  return api<ResellResponse>(`/api/resells/${resellId}/reject`, { method: 'PATCH' });
}

export function cancelResell(resellId: number, sellerId?: number): Promise<ResellResponse> {
  const suffix = sellerId ? `?sellerId=${sellerId}` : '';
  return api<ResellResponse>(`/api/resells/${resellId}/cancel${suffix}`, { method: 'PATCH' });
}

export function getResellOffers(resellId: number): Promise<ResellOfferResponse[]> {
  return api<ResellOfferResponse[]>(`/api/resells/${resellId}/offers`);
}

export function placeResellBid(resellId: number, data: { buyerId: number; offerPrice: number }): Promise<ResellOfferResponse> {
  return api<ResellOfferResponse>(`/api/resells/${resellId}/offers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function instantBuyResell(resellId: number, buyerId: number): Promise<ResellTransactionResponse> {
  return api<ResellTransactionResponse>(`/api/resells/${resellId}/purchase`, {
    method: 'POST',
    body: JSON.stringify({ buyerId }),
  });
}

export function closeResellAuction(resellId: number): Promise<ResellTransactionResponse> {
  return api<ResellTransactionResponse>(`/api/resells/${resellId}/close`, { method: 'POST' });
}

export function getBuyerOffers(buyerId: number): Promise<ResellOfferDetailResponse[]> {
  return api<ResellOfferDetailResponse[]>(`/api/resells/buyers/${buyerId}/offers`);
}

export function getBuyerResellTransactions(buyerId: number): Promise<ResellTransactionDetailResponse[]> {
  return api<ResellTransactionDetailResponse[]>(`/api/resells/buyers/${buyerId}/transactions`);
}

export function getSellerResells(sellerId: number): Promise<ResellResponse[]> {
  return api<ResellResponse[]>(`/api/resells/sellers/${sellerId}`);
}

export function getSellerResellTransactions(sellerId: number): Promise<ResellTransactionDetailResponse[]> {
  return api<ResellTransactionDetailResponse[]>(`/api/resells/sellers/${sellerId}/transactions`);
}

export function getResellTransactionDetail(transactionId: number): Promise<ResellTransactionDetailResponse> {
  return api<ResellTransactionDetailResponse>(`/api/resells/transactions/${transactionId}`);
}

export function payResellTransaction(transactionId: number, buyerId?: number): Promise<ResellTransactionResponse> {
  const suffix = buyerId ? `?buyerId=${buyerId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/pay${suffix}`, { method: 'PATCH' });
}

export function prepareResellShipment(transactionId: number, sellerId?: number): Promise<ResellTransactionResponse> {
  const suffix = sellerId ? `?sellerId=${sellerId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/prepare-shipment${suffix}`, { method: 'PATCH' });
}

export function shipResellTransaction(
  transactionId: number,
  data: { sellerId?: number; courierName?: string; trackingNumber?: string } = {},
): Promise<ResellTransactionResponse> {
  const suffix = data.sellerId ? `?sellerId=${data.sellerId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/ship${suffix}`, {
    method: 'PATCH',
    body: JSON.stringify({ courierName: data.courierName ?? '', trackingNumber: data.trackingNumber ?? '' }),
  });
}

export function confirmResellPurchase(transactionId: number, buyerId?: number): Promise<ResellTransactionResponse> {
  const suffix = buyerId ? `?buyerId=${buyerId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/confirm${suffix}`, { method: 'PATCH' });
}

export function settleResellTransaction(transactionId: number, sellerId?: number): Promise<ResellTransactionResponse> {
  const suffix = sellerId ? `?sellerId=${sellerId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/settle${suffix}`, { method: 'PATCH' });
}

export function cancelResellTransaction(transactionId: number, actorId?: number, reason = ''): Promise<ResellTransactionResponse> {
  const suffix = actorId ? `?actorId=${actorId}` : '';
  return api<ResellTransactionResponse>(`/api/resells/transactions/${transactionId}/cancel${suffix}`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}
