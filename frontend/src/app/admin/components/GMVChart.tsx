import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Database, RefreshCw } from 'lucide-react';
import { getAdminOrders, type OrderResponse } from '../../api/orderApi';

const PLATFORM_FEE_RATE = 0.1;

function formatPrice(value: number) {
  return `₩${Math.round(value).toLocaleString()}`;
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function GMVChart() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('관리자 거래액 조회 실패:', err);
      setError('주문/거래액 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const summary = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status === 'PAID');
    const totalGmv = paidOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const feeRevenue = totalGmv * PLATFORM_FEE_RATE;
    const deliveredOrders = paidOrders.filter((order) => order.shippingStatus === 'DELIVERED');
    const deliveredGmv = deliveredOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);

    const dailyMap = new Map<string, number>();
    paidOrders.forEach((order) => {
      const key = order.createdAt ? order.createdAt.slice(0, 10) : '날짜 없음';
      dailyMap.set(key, (dailyMap.get(key) || 0) + Number(order.totalPaymentAmount || 0));
    });

    const dailyData = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, amount]) => ({ date, amount }));

    const averageDailyGmv = dailyData.length > 0 ? totalGmv / dailyData.length : 0;
    const maxDailyAmount = Math.max(...dailyData.map((item) => item.amount), 1);

    return {
      paidOrders,
      totalGmv,
      feeRevenue,
      deliveredGmv,
      dailyData,
      averageDailyGmv,
      maxDailyAmount,
    };
  }, [orders]);

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">플랫폼 거래액 현황</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            trade_orders 기준 결제 완료 주문으로 거래액을 계산합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            <Database size={16} />
            DB connected
          </span>
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">총 GMV</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{loading ? '-' : formatPrice(summary.totalGmv)}</p>
          <p className="text-xs text-gray-500 mt-1">결제 완료 {summary.paidOrders.length}건</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">일평균 거래액</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{loading ? '-' : formatPrice(summary.averageDailyGmv)}</p>
          <p className="text-xs text-gray-500 mt-1">최근 거래 발생일 기준</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">예상 수수료 수익</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{loading ? '-' : formatPrice(summary.feeRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">MVP 기준 10% 계산</p>
        </div>
      </div>

      {summary.dailyData.length === 0 ? (
        <div className="h-72 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
            <BarChart3 size={28} className="text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700">표시할 거래액 데이터가 없습니다</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            사용자가 결제를 완료하면 이 영역에 실제 거래액이 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">최근 거래액 추이</p>
              <p className="text-sm text-gray-500 mt-1">결제 완료 주문 기준</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">배송 완료 거래액</p>
              <p className="font-bold text-green-700">{formatPrice(summary.deliveredGmv)}</p>
            </div>
          </div>
          <div className="flex h-64 items-end gap-3">
            {summary.dailyData.map((item) => {
              const height = Math.max((item.amount / summary.maxDailyAmount) * 100, 8);
              return (
                <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-48 w-full items-end rounded-t-lg bg-white px-2">
                    <div
                      className="w-full rounded-t-lg bg-blue-600 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${item.date}: ${formatPrice(item.amount)}`}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-600">{formatDateLabel(item.date)}</p>
                  <p className="text-xs text-gray-400">{formatPrice(item.amount)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
