import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, Lock, Sparkles, RefreshCw, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { deleteSellerProduct, getSellerProduct, getSellerProducts, updateSellerProduct } from "../../api/sellerProductApi";
import type { ProductDetailResponse, ProductListResponse, ProductUpdateRequest } from "../../api/adminProductApi";


const COLOR_HEX_BY_NAME: Record<string, string> = {
  black: "#000000",
  블랙: "#000000",
  검정: "#000000",
  white: "#ffffff",
  화이트: "#ffffff",
  ivory: "#f8f1df",
  아이보리: "#f8f1df",
  gray: "#808080",
  grey: "#808080",
  그레이: "#808080",
  blue: "#2563eb",
  블루: "#2563eb",
  navy: "#1e3a8a",
  네이비: "#1e3a8a",
  red: "#dc2626",
  레드: "#dc2626",
  green: "#16a34a",
  그린: "#16a34a",
  beige: "#d6c4a8",
  베이지: "#d6c4a8",
  brown: "#8b5e3c",
  브라운: "#8b5e3c",
  charcoal: "#374151",
  차콜: "#374151",
  pink: "#f4a7b9",
  핑크: "#f4a7b9",
  yellow: "#facc15",
  옐로우: "#facc15",
  orange: "#f97316",
  오렌지: "#f97316",
  purple: "#7c3aed",
  퍼플: "#7c3aed",
};

function splitOptionText(value?: string | null, fallback = ""): string[] {
  if (!value || value.trim() === "") return fallback ? [fallback] : [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueOptionValues(values: Array<string | null | undefined>, fallback = ""): string[] {
  const map = new Map<string, string>();

  values.forEach((value) => {
    splitOptionText(value, fallback).forEach((item) => {
      map.set(item.toLowerCase(), item);
    });
  });

  return Array.from(map.values());
}

function inferColorHex(colorName: string, customHex?: string | null): string {
  const trimmedHex = customHex?.trim();
  const normalized = colorName.trim().toLowerCase();

  // 여러 색상 옵션을 저장할 때 이전 코드에서 #000000이 일괄 저장되던 문제를 막기 위해
  // 색상명이 블랙이 아니면 색상명 기준으로 자동 보정합니다.
  if (trimmedHex && trimmedHex !== "#000000" && trimmedHex !== "#000") {
    return trimmedHex;
  }

  return COLOR_HEX_BY_NAME[normalized] ?? trimmedHex ?? "#9ca3af";
}

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
  sizeOptions: string;
  colorOptions: string;
  colorHex: string;
  stockQuantity: string;
  safetyStock: string;
  reservedQuantity: number;
}

function toEditForm(product: ProductDetailResponse): ProductEditFormState {
  const primaryOption = product.options?.[0];
  const sizes = uniqueOptionValues(product.options?.map((option) => option.size) ?? [], "Free");
  const colors = uniqueOptionValues(product.options?.map((option) => option.color) ?? [], "기본");

  return {
    productId: product.productId,
    name: product.name ?? "",
    price: String(product.price ?? 0),
    categoryName: product.categoryName ?? "",
    description: product.description ?? "",
    thumbnailUrl: product.thumbnailUrl ?? "",
    saleType: product.saleType || "NORMAL",
    sizeOptions: sizes.join(", "),
    colorOptions: colors.join(", "),
    // 컬러 코드는 기본값을 비워둡니다.
    // 비워둔 상태로 저장하면 컬러 옵션명(예: 블루, 화이트, 아이보리)을 기준으로 자동 매핑됩니다.
    // 사용자가 단일 색상에 대해 직접 HEX 값을 넣고 싶을 때만 입력하도록 합니다.
    colorHex: "",
    stockQuantity: String(primaryOption?.stockQuantity ?? 0),
    safetyStock: primaryOption?.safetyStock == null ? "" : String(primaryOption.safetyStock),
    reservedQuantity: primaryOption?.reservedQuantity ?? 0,
  };
}

export function ProductManagement() {
  const navigate = useNavigate();
  const { roleType, brandId } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
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

  const handleOpenEdit = async (product: ProductListResponse) => {
    try {
      setEditingProductId(product.productId);
      const detail = await getSellerProduct(brandId, product.productId);
      setEditForm(toEditForm(detail));
    } catch (error) {
      console.error("상품 상세 조회 실패:", error);
      alert(error instanceof Error ? error.message : "상품 상세 정보를 불러오지 못했습니다.");
    } finally {
      setEditingProductId(null);
    }
  };

  const handleEditSubmit = async () => {
    if (!editForm) return;

    const trimmedName = editForm.name.trim();
    const price = Number(editForm.price);
    const stockQuantity = Number(editForm.stockQuantity);
    const safetyStock = editForm.safetyStock.trim() === "" ? null : Number(editForm.safetyStock);

    if (!trimmedName) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("판매가격은 0원 이상 숫자로 입력해주세요.");
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      alert("재고 수량은 0개 이상 정수로 입력해주세요.");
      return;
    }

    if (safetyStock !== null && (!Number.isInteger(safetyStock) || safetyStock < 0)) {
      alert("안전 재고 수량은 0개 이상 정수로 입력해주세요.");
      return;
    }

    const sizes = splitOptionText(editForm.sizeOptions, "Free");
    const colors = splitOptionText(editForm.colorOptions, "기본");
    const customColorHex = editForm.colorHex.trim() || null;

    const payload: ProductUpdateRequest = {
      name: trimmedName,
      price,
      categoryName: editForm.categoryName.trim() || null,
      description: editForm.description.trim() || null,
      thumbnailUrl: editForm.thumbnailUrl.trim() || null,
      saleType: editForm.saleType || "NORMAL",
      options: sizes.flatMap((size) =>
        colors.map((color) => ({
          size,
          color,
          colorHex: colors.length === 1 ? inferColorHex(color, customColorHex) : inferColorHex(color),
          stockQuantity,
          safetyStock,
          reservedQuantity: editForm.reservedQuantity,
        }))
      ),
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
                            onClick={() => handleOpenEdit(product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            disabled={editingProductId === product.productId}
                          >
                            <Pencil className="h-4 w-4" />
                            {editingProductId === product.productId ? "불러오는 중" : "수정"}
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

              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">재고 및 옵션 정보</h3>
                  <p className="mt-1 text-xs text-gray-500">사이즈/컬러는 쉼표로 여러 개 입력할 수 있습니다. 예: S, M, L / 블랙, 아이보리</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">재고 수량</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.stockQuantity}
                      onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">안전 재고 수량</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.safetyStock}
                      onChange={(e) => setEditForm({ ...editForm, safetyStock: e.target.value })}
                      placeholder="예: 5"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">사이즈 옵션</label>
                    <input
                      value={editForm.sizeOptions}
                      onChange={(e) => setEditForm({ ...editForm, sizeOptions: e.target.value })}
                      placeholder="예: M, L, Free"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">컬러 옵션</label>
                    <input
                      value={editForm.colorOptions}
                      onChange={(e) => setEditForm({ ...editForm, colorOptions: e.target.value })}
                      placeholder="예: 블랙, 아이보리"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">컬러 코드</label>
                    <p className="mb-2 text-xs text-gray-500">여러 색상을 입력하면 색상명 기준으로 자동 컬러 코드가 저장됩니다. 단일 색상만 직접 코드 지정이 가능합니다.</p>
                    <input
                      value={editForm.colorHex}
                      onChange={(e) => setEditForm({ ...editForm, colorHex: e.target.value })}
                      placeholder="단일 색상일 때만 직접 지정합니다. 예: #2563eb"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
                셀러가 상품 기본 정보, 재고, 옵션을 수정하면 기존 판매중 상품도 다시 <strong>승인 대기</strong> 상태가 됩니다. 관리자 승인 후 사용자 상품 목록에 다시 노출됩니다.
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
