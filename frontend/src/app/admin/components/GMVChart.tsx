import { BarChart3, Database } from 'lucide-react';

export function GMVChart() {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">플랫폼 거래액 현황</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            주문/결제 DB 연동 전이므로 임의 매출 그래프를 표시하지 않습니다.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
          <Database size={16} />
          Mock removed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">총 GMV</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">₩0</p>
          <p className="text-xs text-gray-500 mt-1">주문 데이터 연동 후 계산</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">일평균 거래액</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">₩0</p>
          <p className="text-xs text-gray-500 mt-1">주문 데이터 연동 후 계산</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-600">수수료 수익</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">₩0</p>
          <p className="text-xs text-gray-500 mt-1">정산 데이터 연동 후 계산</p>
        </div>
      </div>

      <div className="h-72 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
          <BarChart3 size={28} className="text-gray-400" />
        </div>
        <p className="text-base font-semibold text-gray-700">표시할 거래액 데이터가 없습니다</p>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          장바구니, 주문, 결제 기능이 DB와 연결되면 이 영역을 실제 거래액 그래프로 교체하면 됩니다.
        </p>
      </div>
    </div>
  );
}
