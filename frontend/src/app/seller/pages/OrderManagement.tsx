import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, PackageCheck, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { getLoginUser, getSellerBrandId } from "../../auth/session";
import {
  deliverSellerOrder,
  getSellerOrderSummary,
  getSellerOrders,
  prepareSellerOrderShipping,
  shipSellerOrder,
  type SellerOrderItemResponse,
  type SellerOrderSummaryResponse,
} from "../../api/orderApi";

function formatPrice(value?: number | null) {
  return `₩${(value ?? 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getImageUrl(item: SellerOrderItemResponse) {
  return item.thumbnailUrl || `https://picsum.photos/seed/reown-order-${item.productId}/160/200`;
}

function getShippingLabel(status?: string | null) {
  switch (status) {
    case "READY":
      return "출고 대기";
    case "PREPARING":
      return "상품 준비중";
    case "SHIPPED":
      return "배송중";
    case "DELIVERED":
      return "배송 완료";
    case "NOT_STARTED":
      return "결제 대기";
    default:
      return status || "-";
  }
}

function getOrderLabel(status?: string | null) {
  switch (status) {
    case "CREATED":
      return "주문 생성";
    case "PAID":
      return "결제 완료";
    default:
      return status || "-";
  }
}

function getStatusBadgeClass(status?: string | null) {
  switch (status) {
    case "READY":
      return "bg-orange-50 text-orange-700";
    case "PREPARING":
      return "bg-blue-50 text-blue-700";
    case "SHIPPED":
      return "bg-purple-50 text-purple-700";
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function parseShippingAddress(snapshot?: string | null) {
  if (!snapshot) return "-";

  try {
    const parsed = JSON.parse(snapshot);
    const recipient = parsed.recipientName || parsed.name || "";
    const phone = parsed.phone || "";
    const address = [parsed.address, parsed.detailedAddress].filter(Boolean).join(" ");

    return [recipient, phone, address].filter(Boolean).join(" / ") || snapshot;
  } catch {
    return snapshot;
  }
}

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

export function OrderManagement() {
  const [orders, setOrders] = useState<SellerOrderItemResponse[]>([]);
  const [summary, setSummary] = useState<SellerOrderSummaryResponse>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "READY" | "PREPARING" | "SHIPPED" | "DELIVERED">("ALL");
  const [error, setError] = useState<string | null>(null);

  const brandId = getSellerBrandId();
  const loginUser = getLoginUser();

  const loadOrders = () => {
    if (!loginUser || !brandId) {
      setLoading(false);
      setError("셀러 브랜드 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([getSellerOrders(brandId), getSellerOrderSummary(brandId)])
      .then(([orderItems, orderSummary]) => {
        setOrders(orderItems);
        setSummary(orderSummary);
      })
      .catch((err) => {
        console.error("셀러 주문 조회 실패:", err);
        setError("주문 데이터를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const filteredOrders = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.shippingStatus === statusFilter;
      const matchesKeyword =
        !keyword ||
        order.orderNo.toLowerCase().includes(keyword) ||
        order.productName.toLowerCase().includes(keyword) ||
        String(order.orderId).includes(keyword) ||
        String(order.userId).includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [orders, searchTerm, statusFilter]);

  const handlePrepare = (orderId: number) => {
    if (!brandId) return;
    setActionLoadingId(orderId);
    prepareSellerOrderShipping(orderId, brandId)
      .then(() => loadOrders())
      .catch((err) => {
        console.error("배송 준비 처리 실패:", err);
        alert("배송 준비 처리에 실패했습니다. 결제 완료 상태인지 확인해주세요.");
      })
      .finally(() => setActionLoadingId(null));
  };

  const handleShip = (orderId: number) => {
    if (!brandId) return;
    const trackingNumber = window.prompt("운송장 번호를 입력하세요. 비워두면 자동 테스트 번호가 입력됩니다.") || `MOCK-${Date.now()}`;

    setActionLoadingId(orderId);
    shipSellerOrder(orderId, brandId, trackingNumber)
      .then(() => loadOrders())
      .catch((err) => {
        console.error("출고 처리 실패:", err);
        alert("출고 처리에 실패했습니다. 배송 준비 상태인지 확인해주세요.");
      })
      .finally(() => setActionLoadingId(null));
  };

  const handleDeliver = (orderId: number) => {
    if (!brandId) return;
    if (!window.confirm("배송 완료 처리할까요?")) return;

    setActionLoadingId(orderId);
    deliverSellerOrder(orderId, brandId)
      .then(() => loadOrders())
      .catch((err) => {
        console.error("배송 완료 처리 실패:", err);
        alert("배송 완료 처리에 실패했습니다. 배송중 상태인지 확인해주세요.");
      })
      .finally(() => setActionLoadingId(null));
  };

  const renderActionButton = (order: SellerOrderItemResponse) => {
    const disabled = actionLoadingId === order.orderId;

    if (order.orderStatus !== "PAID") {
      return <span className="text-xs text-gray-400">결제 대기</span>;
    }

    if (order.shippingStatus === "READY") {
      return (
        <button
          onClick={() => handlePrepare(order.orderId)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <PackageCheck className="h-4 w-4" />
          준비 처리
        </button>
      );
    }

    if (order.shippingStatus === "PREPARING") {
      return (
        <button
          onClick={() => handleShip(order.orderId)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Truck className="h-4 w-4" />
          출고 처리
        </button>
      );
    }

    if (order.shippingStatus === "SHIPPED") {
      return (
        <button
          onClick={() => handleDeliver(order.orderId)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          배송 완료
        </button>
      );
    }

    if (order.shippingStatus === "DELIVERED") {
      return <span className="text-xs font-medium text-green-600">완료됨</span>;
    }

    return <span className="text-xs text-gray-400">처리 불가</span>;
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문/출고 관리</h1>
          <p className="mt-1 text-gray-500">DB에 저장된 주문을 확인하고 배송 상태를 변경하세요</p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          새로고침
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">전체 주문</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.totalOrders}건</p>
          <p className="mt-1 text-xs text-gray-400">주문번호 기준</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm text-orange-700">출고 대기</p>
          <p className="mt-2 text-2xl font-bold text-orange-700">{summary.readyOrders}건</p>
          <p className="mt-1 text-xs text-orange-600">결제 완료 후 출고 전</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm text-blue-700">배송 진행</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">{summary.preparingOrders + summary.shippedOrders}건</p>
          <p className="mt-1 text-xs text-blue-600">준비중 + 배송중</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">판매 금액</p>
          <p className="mt-2 text-2xl font-bold text-green-700">{formatPrice(summary.totalSalesAmount)}</p>
          <p className="mt-1 text-xs text-green-600">결제 완료 상품 기준</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="주문번호, 상품명, 구매자 ID로 검색"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["ALL", "전체"],
              ["READY", "출고 대기"],
              ["PREPARING", "준비중"],
              ["SHIPPED", "배송중"],
              ["DELIVERED", "배송 완료"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value as typeof statusFilter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-500">주문 데이터를 불러오는 중입니다...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">표시할 주문 내역이 없습니다</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-y bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">주문</th>
                  <th className="px-4 py-3">상품</th>
                  <th className="px-4 py-3">옵션</th>
                  <th className="px-4 py-3">수량</th>
                  <th className="px-4 py-3">금액</th>
                  <th className="px-4 py-3">주문/배송</th>
                  <th className="px-4 py-3">배송지</th>
                  <th className="px-4 py-3 text-right">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={`${order.orderId}-${order.orderItemId}`} className="hover:bg-gray-50/70">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-gray-900">#{order.orderId}</p>
                      <p className="mt-1 text-xs text-gray-500">{order.orderNo}</p>
                      <p className="mt-1 text-xs text-gray-400">구매자 ID {order.userId}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatDate(order.orderedAt)}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex gap-3">
                        <img
                          src={getImageUrl(order)}
                          alt={order.productName}
                          className="h-16 w-12 rounded-md object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{order.productName}</p>
                          <p className="mt-1 text-xs text-gray-500">상품 ID {order.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-600">
                      <p>{order.color || "-"}</p>
                      <p className="text-xs text-gray-400">{order.size || "-"}</p>
                    </td>
                    <td className="px-4 py-4 align-top font-medium">{order.quantity}개</td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-gray-900">{formatPrice(order.itemTotalPrice)}</p>
                      <p className="text-xs text-gray-400">단가 {formatPrice(order.unitPrice)}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-xs text-gray-500">{getOrderLabel(order.orderStatus)}</p>
                      <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(order.shippingStatus)}`}>
                        {getShippingLabel(order.shippingStatus)}
                      </span>
                      {order.trackingNumber && (
                        <p className="mt-1 text-xs text-gray-400">운송장 {order.trackingNumber}</p>
                      )}
                    </td>
                    <td className="max-w-[260px] px-4 py-4 align-top text-xs leading-5 text-gray-500">
                      {parseShippingAddress(order.shippingAddressSnapshot)}
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      {renderActionButton(order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
