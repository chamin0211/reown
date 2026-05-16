import { useEffect, useMemo, useState } from 'react';
import { DollarSign, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { getAdminOrders, type OrderResponse } from '../../api/orderApi';

const PLATFORM_FEE_RATE = 0.1;

function formatPrice(value: number) {
  return `₩${Math.round(value).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function nextSettlementDate() {
  const now = new Date();
  return `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. 말일`;
}

export function SettlementManagementPage() {
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
      console.error('관리자 정산 데이터 조회 실패:', err);
      setError('주문/정산 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const summary = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status === 'PAID');
    const deliveredOrders = paidOrders.filter((order) => order.shippingStatus === 'DELIVERED');
    const pendingOrders = paidOrders.filter((order) => order.shippingStatus !== 'DELIVERED');

    const paidGmv = paidOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const deliveredGmv = deliveredOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const pendingGmv = pendingOrders.reduce((sum, order) => sum + Number(order.totalPaymentAmount || 0), 0);
    const platformFee = deliveredGmv * PLATFORM_FEE_RATE;
    const payoutAmount = deliveredGmv - platformFee;

    return {
      paidOrders,
      deliveredOrders,
      pendingOrders,
      paidGmv,
      deliveredGmv,
      pendingGmv,
      platformFee,
      payoutAmount,
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">수수료 수익 현황</h1>
            <p className="text-gray-600">trade_orders 기준 배송 완료 주문에서 플랫폼 수수료를 계산합니다.</p>
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

        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl"><DollarSign className="text-blue-600" size={22} /></div>
              <p className="text-sm font-semibold text-gray-600">결제 완료 GMV</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(summary.paidGmv)}</p>
            <p className="text-sm text-gray-500 mt-2">PAID 주문 전체</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-xl"><CheckCircle className="text-green-600" size={22} /></div>
              <p className="text-sm font-semibold text-gray-600">배송 완료 판매액</p>
            </div>
            <p className="text-3xl font-bold text-green-700">{formatPrice(summary.deliveredGmv)}</p>
            <p className="text-sm text-gray-500 mt-2">정산 계산 대상</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl"><DollarSign className="text-purple-600" size={22} /></div>
              <p className="text-sm font-semibold text-gray-600">확정 수수료 수익</p>
            </div>
            <p className="text-3xl font-bold text-purple-700">{formatPrice(summary.platformFee)}</p>
            <p className="text-sm text-gray-500 mt-2">배송 완료 판매액의 10%</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-50 rounded-xl"><Clock className="text-yellow-600" size={22} /></div>
              <p className="text-sm font-semibold text-gray-600">정산 대기 판매액</p>
            </div>
            <p className="text-3xl font-bold text-yellow-700">{formatPrice(summary.pendingGmv)}</p>
            <p className="text-sm text-gray-500 mt-2">배송 완료 전 주문</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">정산 예정 내역</h2>
              <p className="text-sm text-gray-500 mt-1">배송 완료된 주문만 셀러 지급 대상입니다.</p>
            </div>
            <div className="text-sm text-gray-500">다음 정산일: {nextSettlementDate()}</div>
          </div>

          {summary.deliveredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">배송 완료된 정산 대상 주문이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">주문</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">상품</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">배송 완료일</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">판매액</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">수수료</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">셀러 지급액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summary.deliveredOrders.map((order) => {
                    const fee = Number(order.totalPaymentAmount || 0) * PLATFORM_FEE_RATE;
                    const payout = Number(order.totalPaymentAmount || 0) - fee;
                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">#{order.orderId}</div>
                          <div className="text-xs text-gray-500">{order.orderNo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{order.items?.[0]?.productName || '-'}</div>
                          <div className="text-xs text-gray-500">{order.items?.length || 0}개 상품</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.deliveredAt)}</td>
                        <td className="px-6 py-4 text-right font-bold">{formatPrice(order.totalPaymentAmount || 0)}</td>
                        <td className="px-6 py-4 text-right font-semibold text-purple-600">{formatPrice(fee)}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-700">{formatPrice(payout)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">정산 기준</h2>
          <p className="text-sm text-gray-600">MVP 기준으로 배송 완료된 결제 주문만 정산 대상으로 계산합니다. 플랫폼 수수료율은 10%입니다.</p>
        </div>
      </main>
    </div>
  );
}
