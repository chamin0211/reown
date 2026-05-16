import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Calendar, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { getAdminOrders, type OrderResponse } from '../../api/orderApi';

const PLATFORM_FEE_RATE = 0.1;

type DateRange = 'last7' | 'last30' | 'all';

function formatPrice(value: number) {
  return `₩${Math.round(value).toLocaleString()}`;
}

function toDateKey(value?: string | null) {
  if (!value) return '날짜 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatShortDate(value: string) {
  if (value === '날짜 없음') return value;
  const [, month, day] = value.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function isInsideRange(order: OrderResponse, range: DateRange) {
  if (range === 'all') return true;
  const createdAt = new Date(order.createdAt);
  if (Number.isNaN(createdAt.getTime())) return true;
  const days = range === 'last7' ? 7 : 30;
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  threshold.setHours(0, 0, 0, 0);
  return createdAt >= threshold;
}

export function RevenueAnalyticsPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('last30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('매출 분석 데이터 조회 실패:', err);
      setError('매출 분석 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const analytics = useMemo(() => {
    const paidOrders = orders
      .filter((order) => order.status === 'PAID')
      .filter((order) => isInsideRange(order, dateRange));

    const totalGmv = paidOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const deliveredGmv = paidOrders
      .filter((order) => order.shippingStatus === 'DELIVERED')
      .reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const platformFee = deliveredGmv * PLATFORM_FEE_RATE;
    const averageOrderValue = paidOrders.length > 0 ? totalGmv / paidOrders.length : 0;

    const dailyMap = new Map<string, { date: string; orders: number; gmv: number; delivered: number }>();
    paidOrders.forEach((order) => {
      const key = toDateKey(order.createdAt);
      const current = dailyMap.get(key) || { date: key, orders: 0, gmv: 0, delivered: 0 };
      current.orders += 1;
      current.gmv += Number(order.totalPaymentAmount || 0);
      if (order.shippingStatus === 'DELIVERED') {
        current.delivered += Number(order.totalPaymentAmount || 0);
      }
      dailyMap.set(key, current);
    });

    const dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const maxAmount = Math.max(...dailyData.map((item) => item.gmv), 1);

    return {
      paidOrders,
      totalGmv,
      deliveredGmv,
      platformFee,
      averageOrderValue,
      dailyData,
      maxAmount,
    };
  }, [orders, dateRange]);

  const exportCsv = () => {
    const rows = [
      ['날짜', '주문수', '결제 완료 GMV', '배송 완료 판매액', '예상 수수료'].join(','),
      ...analytics.dailyData.map((row) => [
        row.date,
        row.orders,
        row.gmv,
        row.delivered,
        Math.round(row.delivered * PLATFORM_FEE_RATE),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([`\ufeff${rows}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reown-sales-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">매출 & 분석 대시보드</h1>
            <p className="text-gray-600">trade_orders 기준 결제 완료 주문을 분석합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCsv}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50"
            >
              <Download size={18} /> CSV 다운로드
            </button>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> 새로고침
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <Calendar size={20} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700">기간</span>
            {(['last7', 'last30', 'all'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  dateRange === range ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === 'last7' ? '최근 7일' : range === 'last30' ? '최근 30일' : '전체'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-5">
            <div className="p-5 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 mb-2">결제 완료 주문</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.paidOrders.length}건</p>
            </div>
            <div className="p-5 bg-blue-50 rounded-xl">
              <p className="text-sm font-semibold text-blue-700 mb-2">총 GMV</p>
              <p className="text-3xl font-bold text-blue-800">{formatPrice(analytics.totalGmv)}</p>
            </div>
            <div className="p-5 bg-green-50 rounded-xl">
              <p className="text-sm font-semibold text-green-700 mb-2">배송 완료 판매액</p>
              <p className="text-3xl font-bold text-green-800">{formatPrice(analytics.deliveredGmv)}</p>
            </div>
            <div className="p-5 bg-purple-50 rounded-xl">
              <p className="text-sm font-semibold text-purple-700 mb-2">예상 수수료</p>
              <p className="text-3xl font-bold text-purple-800">{formatPrice(analytics.platformFee)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">일별 거래액 추이</h2>
              <p className="text-sm text-gray-500 mt-1">결제 완료 주문 기준입니다.</p>
            </div>
            <div className="text-sm text-gray-500">평균 주문 금액: {formatPrice(analytics.averageOrderValue)}</div>
          </div>

          {analytics.dailyData.length === 0 ? (
            <div className="h-72 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500">
              <BarChart3 size={42} className="mb-3 text-gray-300" />
              표시할 거래액 데이터가 없습니다.
            </div>
          ) : (
            <div className="h-80 flex items-end gap-5 border-b border-gray-200 px-4">
              {analytics.dailyData.map((item) => (
                <div key={item.date} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-xs font-bold text-blue-700 mb-2">{formatPrice(item.gmv)}</div>
                  <div
                    className="w-full bg-blue-600 rounded-t-lg min-h-[12px]"
                    style={{ height: `${Math.max((item.gmv / analytics.maxAmount) * 220, 12)}px` }}
                  />
                  <div className="text-xs text-gray-500 mt-3 mb-2">{formatShortDate(item.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">최근 주문 거래 내역</h2>
            <p className="text-sm text-gray-500 mt-1">취소 주문은 제외하고 표시합니다.</p>
          </div>
          {analytics.paidOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">결제 완료 주문이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">주문</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">상품</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">배송 상태</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">결제 금액</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">수수료 기준</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.paidOrders.slice(0, 10).map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">#{order.orderId}</div>
                        <div className="text-xs text-gray-500">{order.orderNo}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{order.items?.[0]?.productName || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{order.shippingStatus}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">{formatPrice(order.totalPaymentAmount || 0)}</td>
                      <td className="px-6 py-4 text-right text-purple-700 font-bold">
                        {order.shippingStatus === 'DELIVERED' ? formatPrice((order.totalPaymentAmount || 0) * PLATFORM_FEE_RATE) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
