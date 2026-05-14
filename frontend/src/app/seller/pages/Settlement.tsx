import { DollarSign, Download, Calendar } from "lucide-react";

export function Settlement() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">정산 내역</h1>
        <p className="text-gray-500 mt-1">판매 수익과 정산 내역을 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">이번 달 정산 예정</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩8,320,000</p>
          <p className="text-xs text-gray-500 mt-1">3월 31일 정산 예정</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">누적 정산 금액</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩45,890,000</p>
          <p className="text-xs text-gray-500 mt-1">2024년 1월 ~ 현재</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">다음 정산일</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3월 31일</p>
          <p className="text-xs text-gray-500 mt-1">매월 말일 정산</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">정산 내역</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>

        <div className="text-center py-12 text-gray-500">
          정산 내역이 없습니다
        </div>
      </div>
    </div>
  );
}
