import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, Lock, Sparkles, RefreshCw, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { deleteSellerProduct, getSellerProducts, updateSellerProduct } from "../../api/sellerProductApi";
import type { ProductListResponse, ProductUpdateRequest } from "../../api/adminProductApi";

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

interface ProductEditFormState {
  productId: number;
  name: string;
  price: string;
  categoryName: string;
  description: string;
  thumbnailUrl: string;
  saleType: string;
}

function toEditForm(product: ProductListResponse): ProductEditFormState {
  return {
    productId: product.productId,
    name: product.name ?? "",
    price: String(product.price ?? 0),
    categoryName: product.categoryName ?? "",
    description: product.description ?? "",
    thumbnailUrl: product.thumbnailUrl ?? "",
    saleType: product.saleType || "NORMAL",
  };
}

export function ProductManagement() {
  const navigate = useNavigate();
  const { roleType, brandId } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editForm, setEditForm] = useState<ProductEditFormState | null>(null);

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

  const handleEditSubmit = async () => {
    if (!editForm) return;

    const trimmedName = editForm.name.trim();
    const price = Number(editForm.price);

    if (!trimmedName) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("판매가격은 0원 이상 숫자로 입력해주세요.");
      return;
    }

    const payload: ProductUpdateRequest = {
      name: trimmedName,
      price,
      categoryName: editForm.categoryName.trim() || null,
      description: editForm.description.trim() || null,
      thumbnailUrl: editForm.thumbnailUrl.trim() || null,
      saleType: editForm.saleType || "NORMAL",
    };

    try {
      setSaving(true);
      await updateSellerProduct(brandId, editForm.productId, payload);
      alert("상품 정보가 수정되었습니다. 수정된 상품은 관리자 재승인을 위해 승인 대기 상태로 변경됩니다.");
      setEditForm(null);
      await loadProducts();
      setStatusFilter("ALL");
    } catch (error) {
      console.error("상품 수정 실패:", error);
      alert(error instanceof Error ? error.message : "상품 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product: ProductListResponse) => {
    const ok = window.confirm(
      `상품을 삭제 처리할까요?\n\n상품명: ${product.name}\n\n삭제 처리하면 DB에서는 DELETED 상태가 되고 사용자/셀러 상품 목록에서 숨겨집니다.`
    );

    if (!ok) return;

    try {
      setLoading(true);
      await deleteSellerProduct(brandId, product.productId);
      alert("상품이 삭제 처리되었습니다.");
      await loadProducts();
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "상품 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
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
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditForm(toEditForm(product))}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil className="h-4 w-4" />
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">상품 수정</h2>
                <p className="mt-1 text-sm text-gray-500">수정 후 상품 상태는 관리자 승인 대기로 변경됩니다.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditForm(null)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상품명</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">판매가격</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">카테고리</label>
                  <input
                    value={editForm.categoryName}
                    onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                    placeholder="예: 상의, 아우터, 팬츠"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상품 이미지 URL</label>
                <input
                  value={editForm.thumbnailUrl}
                  onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">판매 유형</label>
                <select
                  value={editForm.saleType}
                  onChange={(e) => setEditForm({ ...editForm, saleType: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NORMAL">일반 상품</option>
                  <option value="FUNDING">펀딩 상품</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상품 설명</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                셀러가 상품 기본 정보를 수정하면 기존 판매중 상품도 다시 <strong>승인 대기</strong> 상태가 됩니다. 관리자 승인 후 사용자 상품 목록에 다시 노출됩니다.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setEditForm(null)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "저장 중..." : "수정 저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
