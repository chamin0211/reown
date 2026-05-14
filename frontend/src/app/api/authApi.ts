import { api } from './client';
import { LoginUser } from '../auth/session';

export interface AuthResponse extends LoginUser {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  brandId?: number | null;
  brandName?: string | null;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function signup(data: {
  email: string;
  password: string;
  nickname: string;
  role?: string;
}): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      role: data.role ?? 'USER',
    }),
  });
}
