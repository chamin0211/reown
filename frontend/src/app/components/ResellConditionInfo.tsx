import { CheckCircle } from 'lucide-react';

interface ResellConditionInfoProps {
  conditionDescription: string;
  isInspected: boolean;
  originalPrice?: number;
  currentPrice: number;
}

export function ResellConditionInfo({
  conditionDescription,
  isInspected,
  originalPrice,
  currentPrice,
}: ResellConditionInfoProps) {
  const discountRate = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-900">리셀 상품 정보</h3>
        {isInspected && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full">
            <CheckCircle className="w-3 h-3" />
            검수 완료
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* 상품 상태 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">상품 상태</span>
          <span className="text-gray-900 font-semibold">{conditionDescription}</span>
        </div>

        {/* 검수 상태 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">검수 상태</span>
          <span className="text-green-600 font-semibold">통과</span>
        </div>

        {/* 정품 보증 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">정품 보증</span>
          <span className="text-blue-900 font-semibold">re:own 인증</span>
        </div>

        {/* 가격 정보 */}
        {originalPrice && (
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600 font-medium">할인율</span>
            <span className="text-red-600 font-bold text-lg">{discountRate}% 할인</span>
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">리셀 상품 안내</span>
          <br />
          이 상품은 중고 상품으로 재판매가 불가능하며, 교환/환불 정책이 일반 상품과 다릅니다.
          모든 리셀 상품은 re:own의 전문 검수팀이 정품 여부 및 상태를 철저히 검증합니다.
        </p>
      </div>
    </div>
  );
}
