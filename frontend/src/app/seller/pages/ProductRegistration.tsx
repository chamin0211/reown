import { useState } from "react";
import { ChevronLeft, Package, TrendingUp, Plus, X, Calendar, ImageIcon, Save } from "lucide-react";

type SaleType = "regular" | "funding";

interface ProductionStep {
  id: string;
  step_name: string;
  estimated_date: string;
}

export function ProductRegistration() {
  const [saleType, setSaleType] = useState<SaleType>("regular");
  const [productionSteps, setProductionSteps] = useState<ProductionStep[]>([
    { id: "1", step_name: "", estimated_date: "" }
  ]);

  const addProductionStep = () => {
    const newStep: ProductionStep = {
      id: Date.now().toString(),
      step_name: "",
      estimated_date: ""
    };
    setProductionSteps([...productionSteps, newStep]);
  };

  const removeProductionStep = (id: string) => {
    if (productionSteps.length > 1) {
      setProductionSteps(productionSteps.filter(step => step.id !== id));
    }
  };

  const updateProductionStep = (id: string, field: keyof ProductionStep, value: string) => {
    setProductionSteps(productionSteps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <a href="/seller/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4" />
          상품 목록으로 돌아가기
        </a>
        <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
        <p className="text-gray-500 mt-1">새로운 상품을 등록하고 판매를 시작하세요</p>
      </div>

      <form className="space-y-8">
        {/* Sale Type Selection - 최상단 */}
        <div className="bg-white rounded-xl p-8 border-2 border-blue-500 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-6">판매 유형 선택</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <label
              className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all ${
                saleType === "regular"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-blue-300"
              }`}
            >
              <input
                type="radio"
                name="sale_type"
                value="regular"
                checked={saleType === "regular"}
                onChange={(e) => setSaleType(e.target.value as SaleType)}
                className="absolute top-4 right-4 w-5 h-5 text-blue-600"
              />
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-lg ${saleType === "regular" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <Package className={`w-6 h-6 ${saleType === "regular" ? "text-blue-600" : "text-gray-500"}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${saleType === "regular" ? "text-blue-900" : "text-gray-700"}`}>
                    일반 판매
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                재고가 있는 상품을 바로 판매합니다.<br />
                주문 즉시 배송 처리가 가능합니다.
              </p>
            </label>

            <label
              className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all ${
                saleType === "funding"
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-green-300"
              }`}
            >
              <input
                type="radio"
                name="sale_type"
                value="funding"
                checked={saleType === "funding"}
                onChange={(e) => setSaleType(e.target.value as SaleType)}
                className="absolute top-4 right-4 w-5 h-5 text-green-600"
              />
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-lg ${saleType === "funding" ? "bg-green-100" : "bg-gray-100"}`}>
                  <TrendingUp className={`w-6 h-6 ${saleType === "funding" ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${saleType === "funding" ? "text-green-900" : "text-gray-700"}`}>
                    펀딩 진행
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                목표 금액 달성 시 제작을 시작합니다.<br />
                지속 가능한 생산이 가능합니다.
              </p>
            </label>
          </div>
        </div>

        {/* Hidden field for brand_id */}
        <input type="hidden" name="brand_id" value="1" />

        {/* Basic Product Information */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">기본 정보</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="예: 빈티지 워시 데님 재킷"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                  name="category"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="outer">아우터</option>
                  <option value="top">상의</option>
                  <option value="bottom">하의</option>
                  <option value="accessory">악세서리</option>
                  <option value="bag">가방</option>
                  <option value="shoes">신발</option>
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
                placeholder="상품의 특징, 소재, 사이즈 정보 등을 자세히 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 이미지 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">클릭하거나 이미지를 드래그하세요</p>
                <p className="text-xs text-gray-500">최대 10장, JPG/PNG 형식, 각 5MB 이하</p>
                <input type="file" name="images" multiple accept="image/*" className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* Conditional: Regular Sale Fields */}
        {saleType === "regular" && (
          <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">재고 및 배송 설정</h2>
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
                      name="stock"
                      required
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">현재 보유 중인 재고 수량을 입력하세요</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    안전 재고 수량
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="min_stock"
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">이 수량 이하로 떨어지면 알림을 받습니다</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="immediate_shipping"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">즉시 배송 가능</span>
                    <p className="text-xs text-gray-600">주문 즉시 당일/익일 배송이 가능한 상품입니다</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Conditional: Funding Fields */}
        {saleType === "funding" && (
          <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">펀딩 설정</h2>
            </div>

            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <p className="text-sm text-gray-700">
                  <strong className="text-green-700">펀딩 판매란?</strong><br />
                  목표 금액이 달성되면 제작을 시작하는 예약 판매 방식입니다. 
                  재고 부담 없이 고객 수요를 확인하고 지속 가능한 생산이 가능합니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 금액 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="target_amount"
                      required
                      min="0"
                      placeholder="5000000"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">달성해야 할 최소 판매 금액</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    펀딩 종료일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-2">펀딩을 종료할 날짜</p>
                </div>
              </div>

              {/* Production Steps Section */}
              <div className="bg-white rounded-lg p-6 border border-green-300">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">제작 공정 설정</h3>
                  <span className="text-xs text-gray-600">(고객에게 공개되는 타임라인)</span>
                </div>

                <div className="space-y-3 mb-4">
                  {productionSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        placeholder="단계명 (예: 원단 발주)"
                        value={step.step_name}
                        onChange={(e) => updateProductionStep(step.id, "step_name", e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        placeholder="예상 완료일"
                        value={step.estimated_date}
                        onChange={(e) => updateProductionStep(step.id, "estimated_date", e.target.value)}
                        className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {productionSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductionStep(step.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addProductionStep}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  단계 추가
                </button>

                <p className="text-xs text-gray-600 mt-4">
                  💡 팁: 각 공정 단계와 예상 완료일을 투명하게 공개하여 고객의 신뢰를 얻을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
          >
            <Save className="w-6 h-6" />
            상품 등록하기
          </button>
          <button
            type="button"
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
