interface ResellCardProps {
  resellId: string;
  name: string;
  resellPrice: number;
  conditionDescription: string;
  ogImageUrl: string;
}

export function ResellCard({
  resellId,
  name,
  resellPrice,
  conditionDescription,
  ogImageUrl,
}: ResellCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
        <img
          src={ogImageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
          리셀
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded truncate">
            {conditionDescription}
          </span>
        </div>
        <h3 className="text-base text-gray-900 truncate">{name}</h3>
        <p className="text-lg font-semibold text-gray-900 pt-1">{resellPrice.toLocaleString()}원</p>
      </div>
    </div>
  );
}
