import { api } from './client';
import { LoginUser } from '../auth/session';

export interface AuthResponse extends LoginUser {
  userId: number;
  loginId: string;
  email: string;
  nickname: string;
  role: string;
  brandId?: number | null;
  brandName?: string | null;
}

export type SignupAccountType = 'USER' | 'SELLER' | 'ADMIN';

export function login(loginId: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      loginId,
      password,
    }),
  });
}

export function checkLoginId(loginId: string): Promise<{ available: boolean }> {
  const params = new URLSearchParams({ loginId });
  return api<{ available: boolean }>(`/api/auth/check-login-id?${params.toString()}`);
}

export function signup(data: {
  loginId: string;
  password: string;
  nickname: string;
  accountType?: SignupAccountType;
  role?: string;
  brandName?: string;
  brandLogoUrl?: string;
  businessNumber?: string;
  settlementCycle?: string;
  adminCode?: string;
}): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      loginId: data.loginId,
      password: data.password,
      nickname: data.nickname,
      accountType: data.accountType ?? data.role ?? 'USER',
      role: data.role,
      brandName: data.brandName,
      brandLogoUrl: data.brandLogoUrl,
      businessNumber: data.businessNumber,
      settlementCycle: data.settlementCycle,
      adminCode: data.adminCode,
    }),
  });
}
