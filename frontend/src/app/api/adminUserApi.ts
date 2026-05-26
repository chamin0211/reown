import { api } from './client';

export type AdminManagedRole = 'USER' | 'SELLER_PENDING' | 'SELLER' | 'DESIGNER' | 'ADMIN_PENDING' | 'ADMIN' | 'MASTER' | string;

export interface AdminUserResponse {
  userId: number;
  loginId?: string;
  email: string;
  nickname: string;
  role: AdminManagedRole;
  failedLoginCount?: number;
  lockedUntil?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface UserReportResponse {
  reportId: number;
  reportedUserId: number;
  reportedLoginId: string | null;
  reportedNickname: string | null;
  reportedRole: string | null;
  reporterUserId: number | null;
  reporterLoginId: string | null;
  reason: string;
  detail: string | null;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

export function getAdminUsers(role?: string): Promise<AdminUserResponse[]> {
  const query = role && role !== 'ALL' ? `?role=${encodeURIComponent(role)}` : '';
  return api<AdminUserResponse[]>(`/api/admin/users${query}`);
}

export function getAdminApplications(): Promise<AdminUserResponse[]> {
  return api<AdminUserResponse[]>('/api/admin/users/admin-applications');
}

export function approveAdmin(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/approve-admin`, { method: 'PATCH' });
}

export function rejectAdmin(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/reject-admin`, { method: 'PATCH' });
}

export function grantMaster(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/grant-master`, { method: 'PATCH' });
}

export function revokeMaster(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/revoke-master`, { method: 'PATCH' });
}

export function changeUserRole(userId: number | string, role: string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export function lockUser(userId: number | string, days = 7): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ days }),
  });
}

export function unlockUser(userId: number | string): Promise<AdminUserResponse> {
  return api<AdminUserResponse>(`/api/admin/users/${userId}/unlock`, { method: 'PATCH' });
}

export function getUserReports(status?: string): Promise<UserReportResponse[]> {
  const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
  return api<UserReportResponse[]>(`/api/admin/user-reports${query}`);
}

export function createUserReport(data: {
  reportedUserId: number;
  reporterUserId?: number | null;
  reason: string;
  detail?: string | null;
}): Promise<UserReportResponse> {
  return api<UserReportResponse>('/api/admin/user-reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUserReportStatus(reportId: number | string, status: string): Promise<UserReportResponse> {
  return api<UserReportResponse>(`/api/admin/user-reports/${reportId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
