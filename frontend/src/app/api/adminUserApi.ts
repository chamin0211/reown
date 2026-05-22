import { api } from './client';

export type AdminManagedRole = 'USER' | 'SELLER_PENDING' | 'SELLER' | 'DESIGNER' | 'ADMIN_PENDING' | 'ADMIN' | 'MASTER' | string;

export interface AdminUserResponse {
  userId: number;
  email: string;
  nickname: string;
  role: AdminManagedRole;
  createdAt: string;
}

export function getAdminUsers(role?: string): Promise<AdminUserResponse[]> {
  const query = role && role !== 'ALL' ? `?role=${encodeURIComponent(role)}` : '';
  return api<AdminUserResponse[]>(`/api/admin/users${query}`);
}

export function getAdminApplications(): Promise<AdminUserResponse[]> {
  return api<AdminUserResponse[]>('/api/admin/users/admin-applications');
}

export function approveAdmin(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/approve-admin`, {
    method: 'PATCH',
  });
}

export function rejectAdmin(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/reject-admin`, {
    method: 'PATCH',
  });
}

export function grantMaster(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/grant-master`, {
    method: 'PATCH',
  });
}

export function revokeMaster(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/revoke-master`, {
    method: 'PATCH',
  });
}
