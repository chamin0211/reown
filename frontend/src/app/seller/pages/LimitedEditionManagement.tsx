import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Award, Eye, Lock, Plus, RefreshCw, Sparkles } from "lucide-react";
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
    ON_SALE: "디자이너 스토어 노출중",
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

export function LimitedEditionManagement() {
  const navigate = useNavigate();
  const { roleType, brandId } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const limitedProducts = useMemo(
    () => products.filter((product) => product.saleType === "DESIGNER_LIMITED"),
    [products]
  );

  const summary = useMemo(
    () => ({
      total: limitedProducts.length,
      waiting: limitedProducts.filter((product) => product.status === "WAITING").length,
      onSale: limitedProducts.filter((product) => product.status === "ON_SALE").length,
      rejected: limitedProducts.filter((product) => product.status === "REJECTED").length,
    }),
    [limitedProducts]
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getSellerProducts(brandId);
      setProducts(data);
    } catch (error) {
      console.error("디자이너 한정판 목록 조회 실패:", error);
      alert(error instanceof Error ? error.message : "디자이너 한정판 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  if (!isDesigner) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Sparkles className="h-7 w-7 text-amber-500" />
            디자이너 한정판
          </h1>
          <p className="mt-1 text-gray-500">관리자가 디자이너로 승인한 셀러만 사용할 수 있습니다.</p>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-12 text-center">
          <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-gray-300 to-gray-400 p-6 shadow-xl">
            <Lock className="h-16 w-16 text-white" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">디자이너 권한이 필요합니다</h3>
          <p className="mx-auto max-w-md text-gray-600">
            입점 신청 후 관리자가 디자이너 브랜드로 승인하면 이 메뉴에서 고가 한정판 상품을 등록할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Sparkles className="h-7 w-7 text-amber-500" />
            디자이너 한정판
          </h1>
          <p className="mt-1 text-gray-500">디자이너 스토어에 노출될 고가 한정판 상품을 관리하세요.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          <button
            type="button"
            onClick={() => navigate("/seller/limited-edition/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            신규 한정판 등록
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "전체", value: summary.total, className: "bg-gray-900 text-white" },
          { label: "승인 대기", value: summary.waiting, className: "border-yellow-200 bg-yellow-50 text-yellow-700" },
          { label: "노출중", value: summary.onSale, className: "border-green-200 bg-green-50 text-green-700" },
          { label: "반려", value: summary.rejected, className: "border-red-200 bg-red-50 text-red-700" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-5 ${item.className}`}>
            <p className="text-sm font-medium opacity-80">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
          한정판 상품 목록을 불러오는 중입니다...
        </div>
      ) : limitedProducts.length === 0 ? (
        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-12 text-center">
          <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-6 shadow-xl">
            <Award className="h-16 w-16 text-white" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">등록된 한정판이 없습니다</h3>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            특별한 에디션 컬렉션으로 브랜드 가치를 높이고 컬렉터들에게 독점적인 경험을 선사하세요.
          </p>
          <button
            type="button"
            onClick={() => navigate("/seller/limited-edition/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
          >
            <Sparkles className="h-6 w-6" />
            첫 한정판 컬렉션 만들기
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">상품</th>
                <th className="px-6 py-4 font-semibold">가격</th>
                <th className="px-6 py-4 font-semibold">카테고리</th>
                <th className="px-6 py-4 font-semibold">상태</th>
                <th className="px-6 py-4 font-semibold">등록일</th>
                <th className="px-6 py-4 text-right font-semibold">확인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {limitedProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-amber-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brandName ?? `Brand #${product.brandId}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-gray-600">{product.categoryName ?? "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(product.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.productId}`)}
                      disabled={product.status !== "ON_SALE"}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Eye className="h-4 w-4" />
                      보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
