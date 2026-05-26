import { api } from './client';

export interface NotificationItem {
  notificationId: number;
  title: string;
  message: string;
  type: string;
  linkUrl?: string | null;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(unreadOnly = false): Promise<NotificationItem[]> {
  return api<NotificationItem[]>(`/api/notifications?unreadOnly=${unreadOnly}`);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await api<{ count: number }>('/api/notifications/unread-count');
  return response.count ?? 0;
}

export async function markNotificationAsRead(notificationId: number): Promise<NotificationItem> {
  return api<NotificationItem>(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead(): Promise<{ updated: number }> {
  return api<{ updated: number }>('/api/notifications/read-all', {
    method: 'PATCH',
  });
}
