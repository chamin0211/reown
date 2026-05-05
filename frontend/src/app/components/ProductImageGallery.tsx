import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={`${productName} - 이미지 ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 썸네일 리스트 */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all ${
              selectedImage === index
                ? 'ring-2 ring-blue-900 ring-offset-2'
                : 'hover:opacity-75'
            }`}
          >
            <img
              src={image}
              alt={`${productName} 썸네일 ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
