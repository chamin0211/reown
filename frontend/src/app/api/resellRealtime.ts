const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export interface ResellRealtimeEvent {
  type: string;
  resellId: number;
  offerId: number | null;
  buyerId: number | null;
  offerPrice: number | null;
  currentHighestBid: number | null;
  currentHighestBidderId: number | null;
  bidCount: number | null;
  status: string;
  auctionEndAt: string | null;
  createdAt: string;
  message: string | null;
}

type EventHandler = (event: ResellRealtimeEvent) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

function buildWebSocketUrl() {
  const url = new URL(rawApiBaseUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws';
  url.search = '';
  url.hash = '';
  return url.toString();
}

function stompFrame(command: string, headers: Record<string, string> = {}, body = '') {
  const headerLines = Object.entries(headers).map(([key, value]) => `${key}:${value}`);
  return `${command}\n${headerLines.join('\n')}\n\n${body}\0`;
}

/**
 * 별도 라이브러리 없이 Spring STOMP WebSocket을 구독하는 최소 구현입니다.
 * 리셀 상세 페이지에서 /topic/resells/{resellId} 이벤트를 받아 현재 최고가를 실시간 갱신합니다.
 */
export function subscribeResellRealtime(
  resellId: number,
  onEvent: EventHandler,
  onStatus?: StatusHandler,
) {
  const socket = new WebSocket(buildWebSocketUrl());
  const subscriptionId = `resell-${resellId}-${Date.now()}`;
  let closedByClient = false;

  onStatus?.('connecting');

  socket.onopen = () => {
    socket.send(stompFrame('CONNECT', {
      'accept-version': '1.2',
      'heart-beat': '10000,10000',
    }));
  };

  socket.onmessage = (message) => {
    const frames = String(message.data).split('\0').filter(Boolean);

    for (const frame of frames) {
      const [rawHeaders, rawBody = ''] = frame.split('\n\n');
      const command = rawHeaders.split('\n')[0];

      if (command === 'CONNECTED') {
        onStatus?.('connected');
        socket.send(stompFrame('SUBSCRIBE', {
          id: subscriptionId,
          destination: `/topic/resells/${resellId}`,
        }));
        continue;
      }

      if (command === 'MESSAGE') {
        try {
          onEvent(JSON.parse(rawBody) as ResellRealtimeEvent);
        } catch (error) {
          console.error('리셀 실시간 이벤트 파싱 실패:', error, rawBody);
        }
      }
    }
  };

  socket.onerror = () => {
    onStatus?.('error');
  };

  socket.onclose = () => {
    onStatus?.(closedByClient ? 'disconnected' : 'error');
  };

  return () => {
    closedByClient = true;
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(stompFrame('UNSUBSCRIBE', { id: subscriptionId }));
      socket.send(stompFrame('DISCONNECT'));
    }
    socket.close();
  };
}
