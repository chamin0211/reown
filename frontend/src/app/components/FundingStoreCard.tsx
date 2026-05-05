import { Heart, Share2, Check } from 'lucide-react';

interface FundingStoreCardProps {
  productId: string;
  brandName: string;
  name: string;
  price: string;
  fundingAchievementRate: string;
  ogImageUrl: string;
}

export function FundingStoreCard({
  productId,
  brandName,
  name,
  price,
  fundingAchievementRate,
  ogImageUrl,
}: FundingStoreCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* 상품 이미지 */}
      <div className="relative aspect-square bg-gray-100">
        <img src={ogImageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          펀딩 진행중
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-6 space-y-4">
        {/* 브랜드 및 상품명 */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{`{brandName}`}</p>
          <h3 className="text-lg font-semibold text-gray-900">{`{name}`}</h3>
        </div>

        {/* 가격 및 달성률 */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-end justify-between mb-2">
            <p className="text-2xl font-bold text-gray-900">{`{price}`}</p>
            <p className="text-lg font-bold text-blue-900">{`{fundingAchievementRate}%`}</p>
          </div>

          {/* 달성률 게이지 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-900 h-3 rounded-full transition-all"
              style={{ width: '100%' }}
            />
          </div>
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

        {/* 생산 단계 타임라인 */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Production Timeline</h4>
          <div className="space-y-3">
            {[
              { stage: 'Fabric Sourcing', completed: true },
              { stage: 'Sewing', completed: true },
              { stage: 'QC', completed: true },
              { stage: 'Ready', completed: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-blue-900' : 'bg-gray-200'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    item.completed ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}
                >
                  {item.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 디지털 정품 보증서 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">디지털 정품 보증서</h4>
          <p className="text-xs text-blue-700">NFT 기반 블록체인 인증서 제공</p>
        </div>

        {/* 펀딩 참여 버튼 */}
        <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
          펀딩 참여하기
        </button>

        {/* 데이터 바인딩 정보 */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-mono break-all">
            {`{productId}: ${productId}`}
          </p>
          <p className="text-xs text-gray-400 font-mono">{`{ogImageUrl}`}</p>
        </div>
      </div>
    </div>
  );
}
