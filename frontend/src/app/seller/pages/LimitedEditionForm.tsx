import { useState, useMemo } from "react";
import { ChevronLeft, Sparkles, Plus, X, ImageIcon, Save, Award, Edit3, Package, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface SizeOption {
  id: string;
  size: string;
  quantity: number;
}

export function LimitedEditionForm() {
  const { brandId } = useAuth();
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([
    { id: "1", size: "", quantity: 0 }
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  // 등록 가능 횟수 (실제로는 API에서 가져와야 함)
  const availableRegistrations = 5;

  // 오늘 날짜 (최소 선택 가능 날짜)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 사이즈별 수량 합계 자동 계산
  const totalEditions = useMemo(() => {
    return sizeOptions.reduce((sum, option) => sum + (option.quantity || 0), 0);
  }, [sizeOptions]);

  const addSizeOption = () => {
    const newSize: SizeOption = {
      id: Date.now().toString(),
      size: "",
      quantity: 0
    };
    setSizeOptions([...sizeOptions, newSize]);
  };

  const removeSizeOption = (id: string) => {
    if (sizeOptions.length > 1) {
      setSizeOptions(sizeOptions.filter(option => option.id !== id));
    }
  };

  const updateSizeOption = (id: string, field: keyof SizeOption, value: string | number) => {
    setSizeOptions(sizeOptions.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    ));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <a href="/seller/limited-editions" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4" />
          한정판 목록으로 돌아가기
        </a>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            디자이너 한정판 등록
          </h1>
          <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium rounded-full border border-amber-300">
            디자이너 전용
          </span>
        </div>
        <p className="text-gray-500 mt-1">특별한 에디션을 세상에 선보이세요</p>
      </div>

      <form className="space-y-8">
        {/* Hidden fields */}
        <input type="hidden" name="brand_id" value={brandId} />
        <input type="hidden" name="sale_type" value="limited_edition" />
        <input type="hidden" name="total_editions" value={totalEditions} />

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl p-6 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">디자이너 한정판이란?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✨ 에디션 넘버링으로 희소성과 가치 보장</li>
                <li>✨ 디자이너 친필 서명으로 진품 인증</li>
                <li>✨ 특별 제작 패키지로 프리미엄 경험 제공</li>
                <li>✨ 컬렉터블 아이템으로 브랜드 가치 상승</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Basic Product Information */}
        <div className="bg-white rounded-xl p-8 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">한정판 기본 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                한정판 컬렉션명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="예: 2024 Spring Heritage Collection"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1.5">컬렉터들의 관심을 끌 수 있는 특별한 이름을 지어주세요</p>
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
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                컬렉션 스토리 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={6}
                placeholder="이 한정판의 특별한 스토리, 디자인 철학, 제작 과정의 특별함을 고객에게 전달하세요"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                컬렉션 이미지 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer bg-amber-50">
                <ImageIcon className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">클릭하거나 이미지를 드래그하세요</p>
                <p className="text-xs text-gray-500">최대 10장, JPG/PNG 형식, 각 5MB 이하</p>
                <input type="file" name="images" multiple accept="image/*" className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* Release Date & Time */}
        <div className="bg-white rounded-xl p-8 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">발매 일시</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발매 날짜 및 시간 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between"
                  >
                    <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
                      {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko }) : '날짜를 선택하세요'}
                    </span>
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <input
                    type="hidden"
                    name="release_date"
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1.5">발매 날짜 (년/월/일)</p>
                  
                  {showCalendar && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowCalendar(false)}
                      />
                      <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-2xl border-2 border-amber-300 p-4">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setShowCalendar(false);
                          }}
                          disabled={{ before: today }}
                          fromMonth={today}
                          locale={ko}
                          modifiersClassNames={{
                            selected: 'bg-amber-500 text-white hover:bg-amber-600',
                            today: 'font-bold text-amber-600'
                          }}
                          className="rdp-custom"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <input
                    type="time"
                    name="release_time"
                    placeholder="00:00"
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">발매 시간 (미입력 시 00시00분 발매)</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-gray-700">
                  💡 <strong>발매 시간 팁:</strong> 오후 8시~10시 사이가 가장 많은 고객이 접속하는 시간대입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Size & Quantity Management */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">사이즈 및 수량 설정</h2>
          </div>

          <div className="bg-white rounded-lg p-6 border border-amber-300">
            <div className="space-y-3 mb-4">
              {sizeOptions.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="사이즈 (예: S, M, L, XL 또는 250, 260)"
                    value={option.size}
                    onChange={(e) => updateSizeOption(option.id, "size", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="relative w-40">
                    <input
                      type="number"
                      placeholder="수량"
                      min="0"
                      value={option.quantity || ""}
                      onChange={(e) => updateSizeOption(option.id, "quantity", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">개</span>
                  </div>
                  {sizeOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeOption(option.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSizeOption}
              className="flex items-center gap-2 px-4 py-2.5 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              사이즈 추가
            </button>

            {/* Total Count Display */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-2 border-amber-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">총 에디션 수량 (자동 계산)</span>
                <span className="text-2xl font-bold text-amber-700">{totalEditions}개</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                각 제품에는 1/{totalEditions}, 2/{totalEditions} 형태로 에디션 넘버가 부여됩니다
              </p>
            </div>
          </div>
        </div>

        {/* Limited Edition Exclusive Settings */}
        <div className="bg-white rounded-xl p-8 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">한정판 전용 설정</h2>
          </div>

          <div className="space-y-6">
            {/* Edition Numbering Format */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-300">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900">에디션 넘버링 형식</h3>
              </div>

              <select
                name="edition_format"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="standard">표준 형식 (001/{totalEditions.toString().padStart(3, '0')})</option>
                <option value="simple">간단 형식 (1/{totalEditions})</option>
                <option value="roman">로마자 형식 (I/C)</option>
              </select>
            </div>

            {/* Designer Signature */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-300">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900">디자이너 친필 서명</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    서명 이미지 업로드 <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer">
                    <Edit3 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">투명 배경의 서명 이미지를 업로드하세요</p>
                    <p className="text-xs text-gray-500">PNG 형식 권장, 최대 2MB</p>
                    <input type="file" name="signature_image" accept="image/png,image/jpeg" className="hidden" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    서명 위치
                  </label>
                  <select
                    name="signature_position"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="tag">제품 태그</option>
                    <option value="inside">제품 내부</option>
                    <option value="certificate">인증서</option>
                    <option value="package">패키지</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Packaging */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-300">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900">프리미엄 패키징</h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    name="premium_package"
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">한정판 전용 패키지 사용</span>
                    <p className="text-xs text-gray-600 mt-1">
                      특별 제작된 프리미엄 박스, 인증서, 보호 포장재가 포함됩니다
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    name="include_certificate"
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">진품 인증서 포함</span>
                    <p className="text-xs text-gray-600 mt-1">
                      에디션 넘버와 디자이너 서명이 기재된 공식 인증서 제공
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    name="include_photocard"
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">디자이너 포토카드 포함</span>
                    <p className="text-xs text-gray-600 mt-1">
                      컬렉션 제작 과정이나 디자이너 메시지가 담긴 포토카드
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-6 h-6" />
            한정판 등록하기
            <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              등록 가능 {availableRegistrations}회
            </span>
          </button>
          <a
            href="/seller/limited-editions"
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </a>
        </div>

        {/* Registration Limit Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ 등록 제한 안내:</strong> 디자이너 한정판 등록은 매출 실적과 브랜드 인지도에 따라 제한됩니다. 
            현재 {availableRegistrations}회의 등록 기회가 남아있습니다. 
            추가 등록이 필요하신 경우 고객센터로 문의해주세요.
          </p>
        </div>
      </form>
    </div>
  );
}