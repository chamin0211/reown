import { api } from './client';

export interface AdminCategoryResponse {
  categoryId: number;
  parentId: number | null;
  name: string;
}

export function getAdminCategories(): Promise<AdminCategoryResponse[]> {
  return api<AdminCategoryResponse[]>('/api/admin/categories');
}

export function createAdminCategory(data: { name: string; parentId?: number | null }): Promise<AdminCategoryResponse> {
  return api<AdminCategoryResponse>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminCategory(categoryId: number | string, data: { name: string; parentId?: number | null }): Promise<AdminCategoryResponse> {
  return api<AdminCategoryResponse>(`/api/admin/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAdminCategory(categoryId: number | string): Promise<{ deleted: boolean; categoryId: number }> {
  return api<{ deleted: boolean; categoryId: number }>(`/api/admin/categories/${categoryId}`, {
    method: 'DELETE',
  });
}
