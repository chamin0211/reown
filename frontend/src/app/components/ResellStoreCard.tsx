import { Heart, Share2, CheckCircle } from 'lucide-react';

interface ResellStoreCardProps {
  productId: string;
  brandName: string;
  name: string;
  price: string;
  conditionDescription: string;
  ogImageUrl: string;
}

export function ResellStoreCard({
  productId,
  brandName,
  name,
  price,
  conditionDescription,
  ogImageUrl,
}: ResellStoreCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* 상품 이미지 */}
      <div className="relative aspect-square bg-gray-100">
        <img src={ogImageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          RESELL
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-6 space-y-4">
        {/* 브랜드 및 상품명 */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{`{brandName}`}</p>
          <h3 className="text-lg font-semibold text-gray-900">{`{name}`}</h3>
        </div>

        {/* 검수 완료 배지 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full">
            <CheckCircle className="w-3 h-3" />
            검수 완료
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {`{conditionDescription}`}
          </span>
        </div>

        {/* 가격 */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{`{price}`}</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 판매자 상태 설명 */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">상품 상태</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">컨디션</span>
              <span className="font-medium text-gray-900">{`{conditionDescription}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">검수 상태</span>
              <span className="font-medium text-green-600">통과</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">정품 보증</span>
              <span className="font-medium text-blue-900">re:own 인증</span>
            </div>
          </div>
        </div>

        {/* 리셀 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">리셀 상품 안내</span>
            <br />
            중고 상품으로 교환/환불 정책이 일반 상품과 다릅니다.
          </p>
        </div>

        {/* 즉시 구매 버튼 */}
        <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
          즉시 구매하기
        </button>

        {/* 데이터 바인딩 정보 */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-mono">{`{productId}: ${productId}`}</p>
        </div>
      </div>
    </div>
  );
}
