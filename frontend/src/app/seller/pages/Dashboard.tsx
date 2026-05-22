import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getSellerProducts } from "../../api/sellerProductApi";
import type { ProductListResponse } from "../../api/adminProductApi";
import { getSellerOrderSummary, type SellerOrderSummaryResponse } from "../../api/orderApi";

function formatPrice(value: number) {
  return `₩${value.toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    WAITING: "승인 대기",
    ON_SALE: "판매중",
    REJECTED: "반려",
    DELETED: "삭제됨",
  };
  return map[status] ?? status;
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    WAITING: "bg-yellow-100 text-yellow-700",
    ON_SALE: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    DELETED: "bg-gray-100 text-gray-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

function getSaleTypeText(saleType: string) {
  const map: Record<string, string> = {
    NORMAL: "일반",
    FUNDING: "펀딩",
    RESELL: "리셀",
    DESIGNER_LIMITED: "디자이너 한정판",
  };
  return map[saleType] ?? saleType;
}

const emptyOrderSummary: SellerOrderSummaryResponse = {
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

export function Dashboard() {
  const navigate = useNavigate();
  const { brandId, brandName } = useAuth();
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [orderSummary, setOrderSummary] = useState<SellerOrderSummaryResponse>(emptyOrderSummary);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const [productData, orderData] = await Promise.all([
        getSellerProducts(brandId),
        getSellerOrderSummary(brandId),
      ]);
      setProducts(productData);
      setOrderSummary(orderData);
    } catch (error) {
      console.error("셀러 대시보드 현황 조회 실패:", error);
      setErrorMessage(error instanceof Error ? error.message : "대시보드 현황을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const productStats = useMemo(() => {
    const total = products.length;
    const waiting = products.filter((product) => product.status === "WAITING").length;
    const onSale = products.filter((product) => product.status === "ON_SALE").length;
    const rejected = products.filter((product) => product.status === "REJECTED").length;
    const funding = products.filter((product) => product.saleType === "FUNDING").length;
    const normal = products.filter((product) => product.saleType !== "FUNDING").length;

    return {
      total,
      waiting,
      onSale,
      rejected,
      funding,
      normal,
    };
  }, [products]);

  const recentProducts = useMemo(() => products.slice(0, 6), [products]);
  const maxStatusCount = Math.max(productStats.total, 1);
  const summaryCards = [
    {
      title: "전체 등록 상품",
      value: `${productStats.total}개`,
      description: "내 브랜드 기준",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "승인 대기",
      value: `${productStats.waiting}개`,
      description: "관리자 검수 필요",
      icon: Clock,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "판매중",
      value: `${productStats.onSale}개`,
      description: "사용자 목록 노출",
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "결제 완료 판매액",
      value: formatPrice(orderSummary.totalSalesAmount),
      description: "결제 완료 주문 기준",
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 mt-1">
            {brandName} 상품·주문 현황을 MySQL 데이터 기준으로 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          <button
            onClick={() => navigate("/seller/product/add")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            상품 등록
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{loading ? "-" : card.value}</p>
              <p className="text-sm text-gray-500 mt-2">{card.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">상품 상태 분포</h2>
              <p className="text-sm text-gray-500 mt-1">승인/반려 흐름이 정상인지 확인할 수 있습니다</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">총 {productStats.total}개</span>
          </div>

          <div className="space-y-5">
            {[
              { label: "승인 대기", value: productStats.waiting, className: "bg-yellow-400" },
              { label: "판매중", value: productStats.onSale, className: "bg-green-500" },
              { label: "반려", value: productStats.rejected, className: "bg-red-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}개</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.className} rounded-full transition-all`}
                    style={{ width: `${(item.value / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">주문·매출 요약</h2>
              <p className="text-sm text-gray-500 mt-1">trade_orders 기준 실제 주문 데이터입니다</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-4">
              <span className="text-sm font-medium text-blue-700">전체 주문</span>
              <span className="text-lg font-bold text-blue-900">{orderSummary.totalOrders}건</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-4">
              <span className="text-sm font-medium text-green-700">결제 완료 판매액</span>
              <span className="text-lg font-bold text-green-900">{formatPrice(orderSummary.totalSalesAmount)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-4">
              <span className="text-sm font-medium text-orange-700">출고 대기</span>
              <span className="text-lg font-bold text-orange-900">{orderSummary.readyOrders}건</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-4">
              <span className="text-sm font-medium text-purple-700">배송 완료</span>
              <span className="text-lg font-bold text-purple-900">{orderSummary.deliveredOrders}건</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">출고 현황</h2>
            <p className="text-sm text-gray-500 mt-1">주문 처리 상태를 빠르게 확인합니다</p>
          </div>
          <button
            onClick={() => navigate("/seller/orders")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            주문/출고 관리 →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {[
            { label: "출고 대기", value: orderSummary.readyOrders, icon: Clock, color: "text-orange-600 bg-orange-50" },
            { label: "상품 준비중", value: orderSummary.preparingOrders, icon: Package, color: "text-blue-600 bg-blue-50" },
            { label: "배송중", value: orderSummary.shippedOrders, icon: Truck, color: "text-purple-600 bg-purple-50" },
            { label: "배송 완료", value: orderSummary.deliveredOrders, icon: CheckCircle, color: "text-green-600 bg-green-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}건</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">최근 등록 상품</h2>
            <p className="text-sm text-gray-500 mt-1">가장 최근에 등록된 상품 6개입니다</p>
          </div>
          <button
            onClick={() => navigate("/seller/products")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            전체보기 →
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">상품 데이터를 불러오는 중입니다...</div>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-500">등록된 상품이 없습니다</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">상품명</th>
                  <th className="px-6 py-3">유형</th>
                  <th className="px-6 py-3">가격</th>
                  <th className="px-6 py-3">상태</th>
                  <th className="px-6 py-3">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnailUrl || `https://picsum.photos/seed/reown-${product.productId}/80/100`}
                          alt={product.name}
                          className="h-14 w-11 rounded-md object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">ID {product.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{getSaleTypeText(product.saleType)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(Number(product.price || 0))}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(product.createdAt)}</td>
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
