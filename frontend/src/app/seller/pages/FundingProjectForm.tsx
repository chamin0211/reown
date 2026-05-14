import { useState } from "react";
import { ChevronLeft, TrendingUp, Plus, X, Calendar, ImageIcon, Save, Target, DollarSign } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProductionStep {
  id: string;
  step_name: string;
  estimated_date: string;
}

export function FundingProjectForm() {
  const { brandId } = useAuth();
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
        <a href="/funding" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4" />
          펀딩 캠페인으로 돌아가기
        </a>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">신규 펀딩 프로젝트 시작</h1>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            디자이너 전용
          </span>
        </div>
        <p className="text-gray-500 mt-1">목표 달성 시 제작하는 지속 가능한 판매를 시작하세요</p>
      </div>

      <form className="space-y-8">
        {/* Hidden fields */}
        <input type="hidden" name="brand_id" value={brandId} />
        <input type="hidden" name="sale_type" value="funding" />

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">펀딩 판매가 특별한 이유</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ 재고 부담 없이 고객 수요를 먼저 확인</li>
                <li>✅ 목표 달성 후 제작으로 지속 가능한 생산</li>
                <li>✅ 제작 과정을 투명하게 공개하여 고객 신뢰 확보</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Basic Product Information */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">프로젝트 기본 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 (상품명) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="예: 리사이클 데님으로 만드는 지속가능한 백팩"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1.5">고객의 참여를 이끌어낼 수 있는 매력적인 프로젝트명을 작성하세요</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품 판매가 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                프로젝트 소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={6}
                placeholder="이 프로젝트의 스토리, 지속가능성, 특별한 가치를 고객에게 전달하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 이미지 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">클릭하거나 이미지를 드래그하세요</p>
                <p className="text-xs text-gray-500">최대 10장, JPG/PNG 형식, 각 5MB 이하</p>
                <input type="file" name="images" multiple accept="image/*" className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* Funding Goal Settings */}
        <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">목표 설정</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 펀딩 금액 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="target_amount"
                    required
                    min="0"
                    placeholder="5000000"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">제작을 시작하기 위한 최소 목표 금액</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 생산 수량 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="min_quantity"
                    required
                    min="1"
                    placeholder="50"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">제작을 위한 최소 주문 수량</p>
              </div>
            </div>
          </div>
        </div>

        {/* Period Setting */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">펀딩 기간</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                펀딩 시작일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
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
              <p className="text-xs text-gray-600 mt-2">권장: 30~45일</p>
            </div>
          </div>
        </div>

        {/* Production Timeline */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">제작 공정 타임라인</h2>
            <span className="text-xs text-gray-600">(고객 페이지에 공개)</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            펀딩 종료 후 제작 과정을 단계별로 설정하세요. 
            투명한 공정 공개는 고객의 신뢰를 높이고 참여를 이끌어냅니다.
          </p>

          <div className="bg-white rounded-lg p-6 border border-green-300">
            <div className="space-y-3 mb-4">
              {productionSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="단계명 (예: 원단 발주 및 검수)"
                    value={step.step_name}
                    onChange={(e) => updateProductionStep(step.id, "step_name", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      placeholder="예상 완료일"
                      value={step.estimated_date}
                      onChange={(e) => updateProductionStep(step.id, "estimated_date", e.target.value)}
                      className="w-44 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {productionSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductionStep(step.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addProductionStep}
              className="flex items-center gap-2 px-4 py-2.5 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              공정 단계 추가
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>💡 타임라인 작성 팁:</strong><br />
                원단 발주 → 패턴 제작 → 샘플 확인 → 본 생산 → 품질 검수 → 포장 및 배송 준비 순서로 
                실제 제작 흐름에 맞춰 작성하면 좋습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
          >
            <Save className="w-6 h-6" />
            펀딩 프로젝트 시작하기
          </button>
          <a
            href="/funding"
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </a>
        </div>
      </form>
    </div>
  );
}
