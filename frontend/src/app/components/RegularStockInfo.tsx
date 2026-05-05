import { Package, CheckCircle } from 'lucide-react';

interface RegularStockInfoProps {
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number;
}

export function RegularStockInfo({ stockStatus, stockCount }: RegularStockInfoProps) {
  const statusConfig = {
    in_stock: {
      label: '재고 충분',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
    },
    low_stock: {
      label: '품절 임박',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: Package,
    },
    out_of_stock: {
      label: '품절',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: Package,
    },
  };

  const config = statusConfig[stockStatus];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">재고 및 배송 안내</h3>

      <div className="space-y-3">
        {/* 재고 상태 */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
        >
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
          </div>
          {stockCount !== undefined && stockStatus !== 'out_of_stock' && (
            <span className="text-sm text-gray-600">남은 수량: {stockCount}개</span>
          )}
        </div>

        {/* 배송 정보 */}
        <div className="pt-4 space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">배송 방법</span>
            <span className="text-gray-900 font-medium">일반 택배</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">배송비</span>
            <span className="text-gray-900 font-medium">무료 (5만원 이상 구매 시)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">배송 기간</span>
            <span className="text-gray-900 font-medium">주문 후 1-3일 (영업일 기준)</span>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">즉시 구매 가능</span>
          <br />
          이 상품은 재고가 확보되어 있어 주문 즉시 배송 준비가 시작됩니다.
          <br />
          평일 오후 2시 이전 주문 시 당일 발송됩니다.
        </p>
      </div>
    </div>
  );
}
