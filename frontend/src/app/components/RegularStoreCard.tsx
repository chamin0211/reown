import { Heart, Share2, ShoppingCart } from 'lucide-react';

interface RegularStoreCardProps {
  productId: string;
  brandName: string;
  name: string;
  price: string;
  ogImageUrl: string;
}

export function RegularStoreCard({
  productId,
  brandName,
  name,
  price,
  ogImageUrl,
}: RegularStoreCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* 상품 이미지 */}
      <div className="relative aspect-square bg-gray-100">
        <img src={ogImageUrl} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* 상품 정보 */}
      <div className="p-6 space-y-4">
        {/* 브랜드 및 상품명 */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{`{brandName}`}</p>
          <h3 className="text-lg font-semibold text-gray-900">{`{name}`}</h3>
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

        {/* 사이즈 선택 칩 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">사이즈 선택</label>
          <div className="flex gap-2">
            {['S', 'M', 'L'].map((size) => (
              <button
                key={size}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-blue-900 hover:text-blue-900 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className="space-y-2 pt-4">
          <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            구매하기
          </button>
          <button className="w-full bg-white text-blue-900 py-3 rounded-lg font-semibold border-2 border-blue-900 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            장바구니
          </button>
        </div>

        {/* 데이터 바인딩 정보 */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-mono">{`{productId}: ${productId}`}</p>
        </div>
      </div>
    </div>
  );
}
