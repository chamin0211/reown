import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { getAdminOrders, type OrderResponse } from '../../api/orderApi';

const PLATFORM_FEE_RATE = 0.1;

type BrandPayout = {
  brandId: number | string;
  orderCount: number;
  itemCount: number;
  deliveredAmount: number;
  platformFee: number;
  payoutAmount: number;
};

function formatPrice(value: number) {
  return `₩${Math.round(value).toLocaleString()}`;
}

function getItemBrandId(item: { brandId?: number | null }) {
  return item.brandId ?? '미분류';
}

export function SettlementPayoutPage() {
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
      console.error('셀러 지급 목록 조회 실패:', err);
      setError('셀러 지급 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const { payouts, pendingOrders } = useMemo(() => {
    const payoutMap = new Map<number | string, BrandPayout & { orderIds: Set<number> }>();
    const paidOrders = orders.filter((order) => order.status === 'PAID');
    const deliveredOrders = paidOrders.filter((order) => order.shippingStatus === 'DELIVERED');
    const pending = paidOrders.filter((order) => order.shippingStatus !== 'DELIVERED');

    deliveredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const brandId = getItemBrandId(item);
        const current = payoutMap.get(brandId) || {
          brandId,
          orderCount: 0,
          itemCount: 0,
          deliveredAmount: 0,
          platformFee: 0,
          payoutAmount: 0,
          orderIds: new Set<number>(),
        };

        current.orderIds.add(order.orderId);
        current.itemCount += Number(item.quantity || 0);
        current.deliveredAmount += Number(item.totalPrice || 0);
        current.platformFee = current.deliveredAmount * PLATFORM_FEE_RATE;
        current.payoutAmount = current.deliveredAmount - current.platformFee;
        current.orderCount = current.orderIds.size;
        payoutMap.set(brandId, current);
      });
    });

    return {
      payouts: Array.from(payoutMap.values())
        .map(({ orderIds, ...payout }) => payout)
        .sort((a, b) => Number(b.payoutAmount) - Number(a.payoutAmount)),
      pendingOrders: pending,
    };
  }, [orders]);

  const totalPayout = payouts.reduce((sum, payout) => sum + payout.payoutAmount, 0);
  const totalFee = payouts.reduce((sum, payout) => sum + payout.platformFee, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">셀러 지급 목록</h1>
            <p className="text-gray-600">배송 완료 주문을 기준으로 브랜드별 지급 예정액을 계산합니다.</p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">지급 예정 브랜드</p>
            <p className="text-3xl font-bold text-gray-900">{payouts.length}개</p>
            <p className="text-sm text-gray-500 mt-2">배송 완료 주문 보유 기준</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">총 지급 예정액</p>
            <p className="text-3xl font-bold text-green-700">{formatPrice(totalPayout)}</p>
            <p className="text-sm text-gray-500 mt-2">판매액 - 플랫폼 수수료</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 mb-2">플랫폼 수수료</p>
            <p className="text-3xl font-bold text-purple-700">{formatPrice(totalFee)}</p>
            <p className="text-sm text-gray-500 mt-2">배송 완료 판매액의 10%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">브랜드별 지급 예정 목록</h2>
            <p className="text-sm text-gray-500 mt-1">현재 MVP에서는 브랜드 ID 기준으로 표시합니다.</p>
          </div>

          {payouts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">지급 예정 내역이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">브랜드</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">주문 수</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">상품 수량</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">배송 완료 판매액</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">수수료</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">지급 예정액</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map((payout) => (
                    <tr key={String(payout.brandId)} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">브랜드 #{payout.brandId}</td>
                      <td className="px-6 py-4 text-right">{payout.orderCount}건</td>
                      <td className="px-6 py-4 text-right">{payout.itemCount}개</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatPrice(payout.deliveredAmount)}</td>
                      <td className="px-6 py-4 text-right text-purple-600 font-semibold">{formatPrice(payout.platformFee)}</td>
                      <td className="px-6 py-4 text-right text-green-700 font-bold">{formatPrice(payout.payoutAmount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                          <Clock size={13} /> 정산 대기
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">배송 완료 전 주문</h2>
              <p className="text-sm text-gray-500 mt-1">배송 완료 처리 후 셀러 지급 목록에 포함됩니다.</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500">배송 완료 전 주문이 없습니다.</p>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.orderId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900">#{order.orderId} {order.items?.[0]?.productName || '-'}</p>
                    <p className="text-sm text-gray-500">상태: {order.shippingStatus}</p>
                  </div>
                  <p className="font-bold text-gray-900">{formatPrice(order.totalPaymentAmount || 0)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
