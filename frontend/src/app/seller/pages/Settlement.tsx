import { useEffect, useMemo, useState } from "react";
import { Calendar, DollarSign, Download, RefreshCw, Truck } from "lucide-react";
import { getSellerBrandId } from "../../auth/session";
import {
  getSellerOrders,
  getSellerOrderSummary,
  type SellerOrderItemResponse,
  type SellerOrderSummaryResponse,
} from "../../api/orderApi";

const PLATFORM_FEE_RATE = 0.1;

const emptySummary: SellerOrderSummaryResponse = {
  totalOrders: 0,
  paidOrders: 0,
  readyOrders: 0,
  preparingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  totalItems: 0,
  totalSalesAmount: 0,
  pendingShipmentAmount: 0,
};

function formatPrice(value: number) {
  return `₩${Math.round(value).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getShippingText(status: string) {
  const map: Record<string, string> = {
    READY: "출고 대기",
    PREPARING: "상품 준비중",
    SHIPPED: "배송중",
    DELIVERED: "배송 완료",
    NOT_STARTED: "결제 대기",
  };
  return map[status] ?? status;
}

export function Settlement() {
  const brandId = getSellerBrandId();
  const [orders, setOrders] = useState<SellerOrderItemResponse[]>([]);
  const [summary, setSummary] = useState<SellerOrderSummaryResponse>(emptySummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSettlement = async () => {
    if (!brandId) {
      setError("셀러 브랜드 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [orderItems, orderSummary] = await Promise.all([
        getSellerOrders(brandId),
        getSellerOrderSummary(brandId),
      ]);
      setOrders(orderItems);
      setSummary(orderSummary);
    } catch (err) {
      console.error("정산 데이터 조회 실패:", err);
      setError("정산 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettlement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const settlement = useMemo(() => {
    const deliveredItems = orders.filter(
      (order) => order.orderStatus === "PAID" && order.shippingStatus === "DELIVERED"
    );
    const pendingItems = orders.filter(
      (order) => order.orderStatus === "PAID" && order.shippingStatus !== "DELIVERED"
    );

    const deliveredAmount = deliveredItems.reduce((sum, order) => sum + order.itemTotalPrice, 0);
    const pendingAmount = pendingItems.reduce((sum, order) => sum + order.itemTotalPrice, 0);
    const platformFee = deliveredAmount * PLATFORM_FEE_RATE;
    const payoutAmount = deliveredAmount - platformFee;

    return {
      deliveredItems,
      pendingItems,
      deliveredAmount,
      pendingAmount,
      platformFee,
      payoutAmount,
    };
  }, [orders]);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">정산 내역</h1>
          <p className="text-gray-500 mt-1">
            주문/배송 DB 기준으로 정산 예정 금액을 계산합니다
          </p>
        </div>
        <button
          type="button"
          onClick={loadSettlement}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">정산 예정 금액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(settlement.payoutAmount)}</p>
          <p className="text-xs text-gray-500 mt-1">배송 완료 상품 기준, 수수료 10% 차감</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">누적 결제 금액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalSalesAmount)}</p>
          <p className="text-xs text-gray-500 mt-1">결제 완료 주문 상품 합계</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">다음 정산일</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">매월 말일</p>
          <p className="text-xs text-gray-500 mt-1">MVP 기준 임시 정산 주기</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">배송 완료 판매액</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{formatPrice(settlement.deliveredAmount)}</p>
          <p className="mt-1 text-xs text-gray-400">정산 계산 대상</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">플랫폼 수수료</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{formatPrice(settlement.platformFee)}</p>
          <p className="mt-1 text-xs text-gray-400">배송 완료 판매액의 10%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">정산 대기 판매액</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{formatPrice(settlement.pendingAmount)}</p>
          <p className="mt-1 text-xs text-gray-400">배송 완료 전 주문</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">정산 예정 내역</h2>
            <p className="text-sm text-gray-500 mt-1">배송 완료된 주문 상품이 정산 대상으로 표시됩니다</p>
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            정산 데이터를 불러오는 중입니다...
          </div>
        ) : settlement.deliveredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            배송 완료된 주문이 없어 정산 예정 내역이 없습니다
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">주문</th>
                  <th className="px-4 py-3">상품</th>
                  <th className="px-4 py-3">배송 완료일</th>
                  <th className="px-4 py-3">판매액</th>
                  <th className="px-4 py-3">수수료</th>
                  <th className="px-4 py-3">정산 예정액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlement.deliveredItems.map((order) => {
                  const fee = order.itemTotalPrice * PLATFORM_FEE_RATE;
                  const payout = order.itemTotalPrice - fee;
                  return (
                    <tr key={order.orderItemId} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">#{order.orderId}</p>
                        <p className="text-xs text-gray-500">{order.orderNo}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">{order.productName}</p>
                        <p className="text-xs text-gray-500">{order.color || "-"} / {order.size || "-"} · {order.quantity}개</p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{formatDate(order.deliveredAt)}</td>
                      <td className="px-4 py-4 font-medium">{formatPrice(order.itemTotalPrice)}</td>
                      <td className="px-4 py-4 text-gray-600">{formatPrice(fee)}</td>
                      <td className="px-4 py-4 font-bold text-green-700">{formatPrice(payout)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">배송 완료 전 주문</h2>
            <p className="text-sm text-gray-500 mt-1">배송 완료 처리 후 정산 예정 내역으로 이동합니다</p>
          </div>
        </div>
        {settlement.pendingItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-gray-500">
            정산 대기 중인 주문이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {settlement.pendingItems.slice(0, 5).map((order) => (
              <div key={order.orderItemId} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.productName}</p>
                  <p className="text-xs text-gray-500">#{order.orderId} · {getShippingText(order.shippingStatus)}</p>
                </div>
                <p className="font-bold text-gray-900">{formatPrice(order.itemTotalPrice)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
