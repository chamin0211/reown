import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Package, ImageIcon, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createSellerProduct } from "../../api/sellerProductApi";
import type { ProductOptionCreateRequest } from "../../api/adminProductApi";

interface ProductFormState {
  name: string;
  price: string;
  categoryName: string;
  description: string;
  thumbnailUrl: string;
  stockQuantity: string;
  safetyStock: string;
  sizeOptions: string;
  colorOptions: string;
}

const initialForm: ProductFormState = {
  name: "",
  price: "",
  categoryName: "",
  description: "",
  thumbnailUrl: "",
  stockQuantity: "",
  safetyStock: "10",
  sizeOptions: "",
  colorOptions: "",
};

function splitOptions(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildOptions(form: ProductFormState): ProductOptionCreateRequest[] {
  const sizes = splitOptions(form.sizeOptions);
  const colors = splitOptions(form.colorOptions);
  const stockQuantity = Number(form.stockQuantity || 0);
  const safetyStock = Number(form.safetyStock || 0);

  if (sizes.length === 0 && colors.length === 0) {
    return [
      {
        size: "Free",
        color: "기본",
        colorHex: "#000000",
        stockQuantity,
        safetyStock,
        reservedQuantity: 0,
      },
    ];
  }

  const safeSizes = sizes.length > 0 ? sizes : ["Free"];
  const safeColors = colors.length > 0 ? colors : ["기본"];

  return safeSizes.flatMap((size) =>
    safeColors.map((color) => ({
      size,
      color,
      colorHex: "#000000",
      stockQuantity,
      safetyStock,
      reservedQuantity: 0,
    }))
  );
}

export function RegularProductForm() {
  const navigate = useNavigate();
  const { brandId } = useAuth();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const previewImage = useMemo(() => {
    if (form.thumbnailUrl.startsWith("http")) return form.thumbnailUrl;
    return "https://picsum.photos/seed/reown-new-product/600/800";
  }, [form.thumbnailUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (!form.name.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("판매가격을 올바르게 입력해주세요.");
      return;
    }

    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      alert("재고 수량을 올바르게 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const savedProduct = await createSellerProduct({
        brandId,
        name: form.name.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        price,
        categoryName: form.categoryName || null,
        description: form.description.trim() || null,
        saleType: "NORMAL",
        options: buildOptions(form),
      });

      alert(`상품이 등록되었습니다.\n현재 상태: ${savedProduct.status}\n관리자 승인 후 사용자 상품 목록에 노출됩니다.`);
      navigate("/seller/products");
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert(error instanceof Error ? error.message : "상품 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          상품 목록으로 돌아가기
        </button>
        <h1 className="text-2xl font-bold text-gray-900">일반 상품 등록</h1>
        <p className="text-gray-500 mt-1">등록한 상품은 MySQL에 저장되고 관리자 승인 대기 상태가 됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" name="brand_id" value={brandId} />
        <input type="hidden" name="sale_type" value="NORMAL" />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">상품 기본 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="예: 빈티지 워시 데님 재킷"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1.5">고객이 검색하기 쉬운 명확한 상품명을 입력하세요</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  판매가격 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryName"
                  required
                  value={form.categoryName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="아우터">아우터</option>
                  <option value="상의">상의</option>
                  <option value="하의">하의</option>
                  <option value="악세서리">악세서리</option>
                  <option value="가방">가방</option>
                  <option value="신발">신발</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="상품의 특징, 소재, 사이즈 정보 등을 자세히 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-[1fr_160px] gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품 이미지 URL
                </label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={form.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1.5">현재 MVP에서는 파일 업로드 대신 이미지 URL을 MySQL에 저장합니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img src={previewImage} alt="상품 이미지 미리보기" className="w-full h-40 object-cover" />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">실제 파일 업로드는 추후 S3/서버 저장소 연결 시 활성화하면 됩니다.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">재고 관리</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재고 수량 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="stockQuantity"
                    required
                    min="0"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  안전 재고 수량
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="safetyStock"
                    min="0"
                    value={form.safetyStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">옵션 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이즈 옵션
              </label>
              <input
                type="text"
                name="sizeOptions"
                value={form.sizeOptions}
                onChange={handleChange}
                placeholder="예: S, M, L, XL (쉼표로 구분)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                컬러 옵션
              </label>
              <input
                type="text"
                name="colorOptions"
                value={form.colorOptions}
                onChange={handleChange}
                placeholder="예: 블랙, 화이트, 네이비 (쉼표로 구분)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-bold text-lg shadow-lg"
          >
            <Save className="w-6 h-6" />
            {submitting ? "등록 중..." : "상품 등록하기"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/seller/products")}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
