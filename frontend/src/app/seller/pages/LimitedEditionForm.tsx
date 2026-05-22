import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Award, ChevronLeft, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createSellerProduct } from "../../api/sellerProductApi";
import type { ProductOptionCreateRequest } from "../../api/adminProductApi";
import { ImageUploadField } from "../../components/ImageUploadField";

interface SizeOption {
  id: string;
  size: string;
  quantity: string;
}

interface LimitedEditionFormState {
  name: string;
  price: string;
  categoryName: string;
  description: string;
  thumbnailUrl: string;
  material: string;
  releaseDate: string;
  colorOptions: string;
  safetyStock: string;
  editionStory: string;
  designerNote: string;
}

const initialForm: LimitedEditionFormState = {
  name: "",
  price: "",
  categoryName: "",
  description: "",
  thumbnailUrl: "",
  material: "",
  releaseDate: "",
  colorOptions: "",
  safetyStock: "1",
  editionStory: "",
  designerNote: "",
};

const initialSizes: SizeOption[] = [{ id: "size-1", size: "Free", quantity: "1" }];

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

function inferColorHex(colorName: string): string {
  return COLOR_HEX_BY_NAME[colorName.trim().toLowerCase()] ?? "#9ca3af";
}

function splitOptions(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildOptions(sizeOptions: SizeOption[], colorText: string, safetyStockText: string): ProductOptionCreateRequest[] {
  const colors = splitOptions(colorText);
  const safeColors = colors.length > 0 ? colors : ["기본"];
  const safetyStock = Number(safetyStockText || 0);

  return sizeOptions.flatMap((sizeOption) => {
    const size = sizeOption.size.trim() || "Free";
    const stockQuantity = Number(sizeOption.quantity || 0);

    return safeColors.map((color) => ({
      size,
      color,
      colorHex: inferColorHex(color),
      stockQuantity,
      safetyStock,
      reservedQuantity: 0,
    }));
  });
}

function buildDescription(form: LimitedEditionFormState, totalEditions: number): string {
  const sections = [
    form.description.trim(),
    "",
    "[디자이너 한정판 정보]",
    `총 한정 수량: ${totalEditions.toLocaleString()}개`,
    form.material.trim() ? `소재/제작 방식: ${form.material.trim()}` : null,
    form.releaseDate ? `발매 예정일: ${form.releaseDate}` : null,
    form.editionStory.trim() ? `컬렉션 스토리: ${form.editionStory.trim()}` : null,
    form.designerNote.trim() ? `디자이너 코멘트: ${form.designerNote.trim()}` : null,
  ].filter((item): item is string => typeof item === "string");

  return sections.join("\n").trim();
}

export function LimitedEditionForm() {
  const navigate = useNavigate();
  const { brandId, roleType } = useAuth();
  const [form, setForm] = useState<LimitedEditionFormState>(initialForm);
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>(initialSizes);
  const [submitting, setSubmitting] = useState(false);

  const isDesigner = roleType === "DESIGNER";

  const totalEditions = useMemo(() => {
    return sizeOptions.reduce((sum, option) => {
      const quantity = Number(option.quantity || 0);
      return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
    }, 0);
  }, [sizeOptions]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateSizeOption = (id: string, field: keyof Omit<SizeOption, "id">, value: string) => {
    setSizeOptions((prev) =>
      prev.map((option) => (option.id === id ? { ...option, [field]: value } : option))
    );
  };

  const addSizeOption = () => {
    setSizeOptions((prev) => [...prev, { id: `size-${Date.now()}`, size: "", quantity: "1" }]);
  };

  const removeSizeOption = (id: string) => {
    setSizeOptions((prev) => (prev.length > 1 ? prev.filter((option) => option.id !== id) : prev));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDesigner) {
      alert("관리자에게 디자이너로 승인된 셀러만 한정판을 등록할 수 있습니다.");
      return;
    }

    const price = Number(form.price);
    const safetyStock = Number(form.safetyStock || 0);

    if (!form.name.trim()) {
      alert("한정판 상품명을 입력해주세요.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("판매가격을 올바르게 입력해주세요.");
      return;
    }

    if (!form.thumbnailUrl.trim()) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }

    if (totalEditions <= 0) {
      alert("한정 수량을 1개 이상 입력해주세요.");
      return;
    }

    if (!Number.isInteger(safetyStock) || safetyStock < 0) {
      alert("안전 재고 수량은 0개 이상 정수로 입력해주세요.");
      return;
    }

    const hasInvalidQuantity = sizeOptions.some((option) => {
      const quantity = Number(option.quantity || 0);
      return !Number.isInteger(quantity) || quantity < 0;
    });

    if (hasInvalidQuantity) {
      alert("사이즈별 한정 수량은 0개 이상 정수로 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const savedProduct = await createSellerProduct({
        brandId,
        name: form.name.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
        price,
        categoryName: form.categoryName || null,
        description: buildDescription(form, totalEditions),
        saleType: "DESIGNER_LIMITED",
        maxPurchasePerUser: 1,
        displaySortOrder: 0,
        options: buildOptions(sizeOptions, form.colorOptions, form.safetyStock),
      });

      alert(
        `디자이너 한정판이 등록되었습니다.\n현재 상태: ${savedProduct.status}\n관리자 승인 후 디자이너 스토어에 노출됩니다.`
      );
      navigate("/seller/limited-editions");
    } catch (error) {
      console.error("디자이너 한정판 등록 실패:", error);
      alert(error instanceof Error ? error.message : "디자이너 한정판 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isDesigner) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/seller/limited-editions")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          디자이너 한정판으로 돌아가기
        </button>

        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-10 text-center">
          <Sparkles className="mx-auto mb-4 h-14 w-14 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">디자이너 승인 필요</h1>
          <p className="text-gray-700">
            이 메뉴는 관리자가 디자이너 브랜드로 승인한 셀러만 사용할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/seller/limited-editions")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          한정판 목록으로 돌아가기
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">디자이너 한정판 등록</h1>
          <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            디자이너 전용
          </span>
        </div>
        <p className="mt-1 text-gray-500">
          관리자 승인 후 소비자 디자이너 스토어에 노출될 고가 한정판 상품을 등록합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" name="brand_id" value={brandId} />
        <input type="hidden" name="sale_type" value="DESIGNER_LIMITED" />

        <div className="rounded-xl border-2 border-amber-200 bg-white p-8">
          <div className="mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">기본 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                한정판 상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="예: 2026 Atelier Handcrafted Leather Jacket"
                className="w-full rounded-lg border border-amber-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-lg border border-amber-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryName"
                  required
                  value={form.categoryName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-amber-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">선택하세요</option>
                  <option value="아우터">아우터</option>
                  <option value="상의">상의</option>
                  <option value="하의">하의</option>
                  <option value="원피스">원피스</option>
                  <option value="가방">가방</option>
                  <option value="신발">신발</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">발매 예정일</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={form.releaseDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-amber-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <ImageUploadField
              label="대표 이미지 *"
              value={form.thumbnailUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, thumbnailUrl: url }))}
              helperText="등록된 이미지는 승인 후 디자이너 스토어 상품 카드와 상세 페이지에 표시됩니다."
              previewClassName="h-64"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                상품 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="상품의 특징, 핏, 제작 방식, 희소성 등을 설명해주세요."
                className="w-full resize-none rounded-lg border border-amber-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-white p-8">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">한정판 옵션</h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">총 한정 수량</span>
                <span className="text-2xl font-bold text-amber-700">{totalEditions.toLocaleString()}개</span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                사이즈별 수량 합계가 소비자에게 판매 가능한 전체 한정 수량이 됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">사이즈별 한정 수량</label>
                <button
                  type="button"
                  onClick={addSizeOption}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                >
                  <Plus className="h-4 w-4" />
                  사이즈 추가
                </button>
              </div>

              {sizeOptions.map((option) => (
                <div key={option.id} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                  <input
                    type="text"
                    value={option.size}
                    onChange={(event) => updateSizeOption(option.id, "size", event.target.value)}
                    placeholder="예: S, M, L, Free"
                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={option.quantity}
                    onChange={(event) => updateSizeOption(option.id, "quantity", event.target.value)}
                    placeholder="수량"
                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeOption(option.id)}
                    disabled={sizeOptions.length <= 1}
                    className="rounded-lg border border-gray-300 px-3 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="사이즈 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">색상 옵션</label>
                <input
                  type="text"
                  name="colorOptions"
                  value={form.colorOptions}
                  onChange={handleChange}
                  placeholder="예: 블랙, 아이보리, 네이비"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">여러 색상은 쉼표로 구분하세요.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">안전 재고</label>
                <input
                  type="number"
                  name="safetyStock"
                  min="0"
                  value={form.safetyStock}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-white p-8">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">프리미엄 소개 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">소재/제작 방식</label>
              <input
                type="text"
                name="material"
                value={form.material}
                onChange={handleChange}
                placeholder="예: 이탈리아산 울 100%, 국내 수작업 봉제"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">컬렉션 스토리</label>
              <textarea
                name="editionStory"
                rows={4}
                value={form.editionStory}
                onChange={handleChange}
                placeholder="왜 한정판으로 출시하는지, 어떤 컬렉션인지 작성해주세요."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">디자이너 코멘트</label>
              <textarea
                name="designerNote"
                rows={3}
                value={form.designerNote}
                onChange={handleChange}
                placeholder="소비자에게 전달하고 싶은 디자이너 메시지를 작성해주세요."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-6 w-6" />
            {submitting ? "등록 중..." : "디자이너 한정판 등록"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/seller/limited-editions")}
            className="rounded-xl border-2 border-gray-300 px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
