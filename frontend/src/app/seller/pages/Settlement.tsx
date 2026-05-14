import { Calendar, DollarSign, Download } from "lucide-react";

export function Settlement() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">정산 내역</h1>
        <p className="text-gray-500 mt-1">
          주문/결제 DB 연동 전이므로 임의 정산 금액을 표시하지 않습니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">이번 달 정산 예정</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩0</p>
          <p className="text-xs text-gray-500 mt-1">주문/결제 연동 후 자동 계산</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">누적 정산 금액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩0</p>
          <p className="text-xs text-gray-500 mt-1">정산 이력 연동 전</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">다음 정산일</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">-</p>
          <p className="text-xs text-gray-500 mt-1">정산 정책 설정 후 표시</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">정산 내역</h2>
            <p className="text-sm text-gray-500 mt-1">실제 정산 데이터가 생성되면 이 목록에 표시됩니다</p>
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          정산 내역이 없습니다
        </div>
      </div>
    </div>
  );
}
