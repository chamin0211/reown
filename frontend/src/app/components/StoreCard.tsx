interface StoreCardProps {
  productId: string;
  brandName: string;
  name: string;
  price: number;
  ogImageUrl: string;
}

export function StoreCard({ productId, brandName, name, price, ogImageUrl }: StoreCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
        <img
          src={ogImageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500 truncate">{brandName}</p>
        <h3 className="text-base text-gray-900 truncate">{name}</h3>
        <p className="text-lg font-semibold text-gray-900 pt-1">{price.toLocaleString()}원</p>
      </div>
    </div>
  );
}
