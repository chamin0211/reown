interface FundingCardProps {
  productId: string;
  brandName: string;
  name: string;
  fundingAchievementRate?: number;
  price: number;
  ogImageUrl: string;
}

export function FundingCard({
                              productId,
                              brandName,
                              name,
                              fundingAchievementRate = 80,
                              price,
                              ogImageUrl,
                            }: FundingCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
        <img
          src={ogImageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {fundingAchievementRate >= 100 && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            펀딩 성공
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500 truncate">{brandName}</p>
        <h3 className="text-base text-gray-900 truncate">{name}</h3>
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-semibold text-gray-900">{price.toLocaleString()}원</p>
          <p className="text-sm text-blue-600 font-medium whitespace-nowrap">{fundingAchievementRate}%</p>
        </div>
      </div>
    </div>
  );
}
