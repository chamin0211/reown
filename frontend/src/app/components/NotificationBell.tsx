import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationItem,
} from '../api/notificationApi';
import { getLoginUser, SESSION_CHANGED_EVENT } from '../auth/session';

interface NotificationBellProps {
  className?: string;
  panelClassName?: string;
}

const PANEL_WIDTH = 340;
const PANEL_GAP = 8;

export function NotificationBell({ className = '', panelClassName = '' }: NotificationBellProps) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = () => !!getLoginUser()?.userId;

  const updatePanelPosition = useCallback(() => {
    if (!rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 관리자 사이드바처럼 왼쪽 좁은 영역 안에 있는 경우에는 오른쪽으로 펼치고,
    // 일반 헤더처럼 우측 상단에 있는 경우에는 버튼 오른쪽에 맞춰 펼친다.
    const canOpenToRight = rect.right + PANEL_GAP + PANEL_WIDTH < viewportWidth - 12;
    const shouldOpenToRight = rect.left < 280 && canOpenToRight;

    let left = shouldOpenToRight
      ? rect.right + PANEL_GAP
      : rect.right - PANEL_WIDTH;

    left = Math.max(12, Math.min(left, viewportWidth - PANEL_WIDTH - 12));

    let top = rect.bottom + PANEL_GAP;
    top = Math.max(12, Math.min(top, viewportHeight - 120));

    setPanelPosition({ top, left });
  }, []);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      setUnreadCount(0);
      return;
    }

    try {
      setError(null);
      const [notifications, count] = await Promise.all([
        getNotifications(false),
        getUnreadNotificationCount(),
      ]);
      setItems(notifications);
      setUnreadCount(count);
    } catch (e) {
      console.error(e);
      setError('알림을 불러오지 못했습니다.');
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(SESSION_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    const timer = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.clearInterval(timer);
    };
  }, [refresh]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  const handleToggle = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      updatePanelPosition();
      setLoading(true);
      await refresh();
      setLoading(false);
    }
  };

  const handleClickItem = async (item: NotificationItem) => {
    try {
      if (!item.read) {
        await markNotificationAsRead(item.notificationId);
      }
      setOpen(false);
      await refresh();
      if (item.linkUrl) {
        navigate(item.linkUrl);
      }
    } catch (e) {
      console.error(e);
      setError('알림 처리에 실패했습니다.');
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsAsRead();
      await refresh();
    } catch (e) {
      console.error(e);
      setError('전체 읽음 처리에 실패했습니다.');
    }
  };

  const panel = open ? (
    <div
      ref={panelRef}
      style={{ top: panelPosition.top, left: panelPosition.left, width: PANEL_WIDTH }}
      className={`fixed bg-white border border-gray-200 rounded-2xl shadow-2xl z-[99999] overflow-hidden ${panelClassName}`}
    >
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">알림</h3>
          <p className="text-xs text-gray-500">최근 50개 알림을 표시합니다.</p>
        </div>
        <button
          type="button"
          onClick={handleReadAll}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-300"
          disabled={unreadCount === 0}
        >
          <CheckCheck className="w-4 h-4" />
          모두 읽음
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="py-10 flex items-center justify-center text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            불러오는 중...
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            아직 도착한 알림이 없습니다.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.notificationId}
              type="button"
              onClick={() => handleClickItem(item)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                item.read ? 'bg-white' : 'bg-blue-50/70'
              }`}
            >
              <div className="flex items-start gap-2">
                {!item.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                      {labelByType(item.type)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">{item.message}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="알림"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {panel ? createPortal(panel, document.body) : null}
    </div>
  );
}

function labelByType(type?: string) {
  const value = (type ?? '').toUpperCase();
  if (value.includes('SELLER')) return '셀러';
  if (value.includes('ADMIN')) return '관리자';
  if (value.includes('PRODUCT')) return '상품';
  if (value.includes('FUNDING')) return '펀딩';
  if (value.includes('RESELL')) return '리셀';
  if (value.includes('DESIGNER')) return '디자이너';
  return '알림';
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
