import { Clock } from 'lucide-react';

interface AdaptiveProductCardProps {
  productId: string;
  brandName: string;
  name: string;
  price: number;
  ogImageUrl: string;
  isFunding?: boolean;
  fundingAchievementRate?: number;
  remainingDays?: number;
  gridColumns: 3 | 4 | 6;
}

export function AdaptiveProductCard({
  productId,
  brandName,
  name,
  price,
  ogImageUrl,
  isFunding = false,
  fundingAchievementRate,
  remainingDays,
  gridColumns,
}: AdaptiveProductCardProps) {
  // 그리드 크기에 따라 텍스트 크기 조정
  const isCompact = gridColumns === 6;
  const isMedium = gridColumns === 4;

  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-2">
        <img
          src={ogImageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isFunding && fundingAchievementRate && fundingAchievementRate >= 100 && (
          <div
            className={`absolute top-2 left-2 bg-blue-600 text-white rounded-full ${
              isCompact ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
            }`}
          >
            펀딩 성공
          </div>
        )}
      </div>

      <div className={`space-y-0.5 ${isCompact ? 'space-y-0' : ''}`}>
        <p
          className={`text-gray-500 truncate ${
            isCompact ? 'text-xs' : isMedium ? 'text-xs' : 'text-sm'
          }`}
        >
          {brandName}
        </p>
        <h3
          className={`text-gray-900 truncate ${
            isCompact ? 'text-xs' : isMedium ? 'text-sm' : 'text-base'
          }`}
        >
          {name}
        </h3>
        <p
          className={`font-semibold text-gray-900 pt-0.5 ${
            isCompact ? 'text-sm' : isMedium ? 'text-base' : 'text-lg'
          }`}
        >
          {price.toLocaleString()}원
        </p>

        {/* 펀딩 정보 */}
        {isFunding && (fundingAchievementRate || remainingDays) && (
          <div
            className={`flex items-center gap-2 pt-1 ${
              isCompact ? 'text-xs' : 'text-sm'
            }`}
          >
            {fundingAchievementRate && (
              <span className="text-blue-600 font-medium">{fundingAchievementRate}%</span>
            )}
            {remainingDays && (
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className={`${isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                {remainingDays}일 남음
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
