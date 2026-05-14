import { Search, Filter } from "lucide-react";

export function OrderManagement() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">주문/출고 관리</h1>
        <p className="text-gray-500 mt-1">주문을 확인하고 출고 처리하세요</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="주문번호, 구매자명으로 검색"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
            필터
          </button>
        </div>

        <div className="text-center py-12 text-gray-500">
          주문 내역이 없습니다
        </div>
      </div>
    </div>
  );
}
