import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, Lock, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getSellerProducts } from "../../api/sellerProductApi";
import type { ProductListResponse } from "../../api/adminProductApi";

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
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

export function ProductManagement() {
  const navigate = useNavigate();
  const { roleType, brandId } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadProducts = async () => {
    try {
      setLoading(true);
      // 상태 카드는 항상 전체 상품 기준으로 계산해야 하므로 목록은 전체를 가져옵니다.
      // 화면 필터링은 아래 filteredProducts에서 프론트에서 처리합니다.
      const data = await getSellerProducts(brandId);
      setProducts(data);
    } catch (error) {
      console.error("셀러 상품 목록 조회 실패:", error);
      alert(error instanceof Error ? error.message : "상품 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
      const matchesSearch =
        !query ||
        [product.name, product.brandName ?? "", product.categoryName ?? "", product.status]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [products, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: products.length,
      waiting: products.filter((product) => product.status === "WAITING").length,
      onSale: products.filter((product) => product.status === "ON_SALE").length,
      rejected: products.filter((product) => product.status === "REJECTED").length,
    };
  }, [products]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-gray-500 mt-1">MySQL에 등록된 내 브랜드 상품을 관리하세요</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/seller/product/add")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            일반 상품 등록
          </button>

          {isDesigner ? (
            <button
              onClick={() => navigate("/seller/limited-edition/new")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              디자이너 한정판 등록
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 rounded-lg cursor-not-allowed font-medium opacity-60"
              >
                <Lock className="w-5 h-5" />
                <Sparkles className="w-5 h-5" />
                디자이너 한정판 등록
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "전체", value: summary.total, className: "bg-gray-900 text-white" },
          { label: "승인 대기", value: summary.waiting, className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
          { label: "판매중", value: summary.onSale, className: "bg-green-50 text-green-700 border-green-200" },
          { label: "반려", value: summary.rejected, className: "bg-red-50 text-red-700 border-red-200" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.label === "전체") setStatusFilter("ALL");
              if (item.label === "승인 대기") setStatusFilter("WAITING");
              if (item.label === "판매중") setStatusFilter("ON_SALE");
              if (item.label === "반려") setStatusFilter("REJECTED");
            }}
            className={`rounded-xl border p-4 text-left hover:shadow-sm transition-all ${item.className}`}
          >
            <div className="text-sm font-medium opacity-80">{item.label}</div>
            <div className="text-2xl font-bold mt-1">{item.value}개</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명, 브랜드, 카테고리로 검색"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">전체 상태</option>
            <option value="WAITING">승인 대기</option>
            <option value="ON_SALE">판매중</option>
            <option value="REJECTED">반려</option>
          </select>

          <button
            onClick={loadProducts}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
            필터
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">상품 목록을 불러오는 중입니다...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {products.length === 0
              ? "등록된 상품이 없습니다. 일반 상품 등록 버튼으로 첫 상품을 등록해보세요."
              : "현재 조건에 맞는 상품이 없습니다."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">이미지</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상품명</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">카테고리</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">판매 유형</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가격</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const imageUrl = product.thumbnailUrl?.startsWith("http")
                    ? product.thumbnailUrl
                    : `https://picsum.photos/seed/reown-product-${product.productId}/120/120`;

                  return (
                    <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        #{product.productId}
                      </td>
                      <td className="px-4 py-4">
                        <img src={imageUrl} alt={product.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{product.brandName}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {product.categoryName || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {product.saleType === "FUNDING" ? "펀딩" : "일반"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(product.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
