import { api } from './client';

export interface ResellResponse {
    resellId: number;
    orderItemId: number;
    sellerId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string | null;
    optionId: number;
    size: string;
    color: string;
    resellPrice: number;
    conditionDescription: string | null;
    status: string;
    createdAt: string;
}

export function getResells(): Promise<ResellResponse[]> {
    return api<ResellResponse[]>('/api/resells');
}

export function getResellDetail(resellId: number): Promise<ResellResponse> {
    return api<ResellResponse>(`/api/resells/${resellId}`);
}