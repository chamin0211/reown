import { useState } from 'react';
import { Star, User } from 'lucide-react';

interface Review {
  reviewId: string;
  authorName: string;
  rating: number;
  height: number;
  weight: number;
  content: string;
  createdAt: string;
  images?: string[];
}

interface ProductTabsProps {
  description: string;
  sizeGuide: {
    label: string;
    shoulder: string;
    chest: string;
    sleeve: string;
    length: string;
  }[];
  reviews: Review[];
}

export function ProductTabs({ description, sizeGuide, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'size' | 'review' | 'inquiry'>('detail');

  const tabs = [
    { id: 'detail' as const, label: '상세 설명' },
    { id: 'size' as const, label: '사이즈 정보' },
    { id: 'review' as const, label: `리뷰 (${reviews.length})` },
    { id: 'inquiry' as const, label: '문의' },
  ];

  return (
    <div className="border-t border-gray-200">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900" />
            )}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="py-8">
        {activeTab === 'detail' && (
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        )}

        {activeTab === 'size' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">사이즈 가이드</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                      사이즈
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                      어깨
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                      가슴
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                      소매
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">
                      기장
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((size) => (
                    <tr key={size.label}>
                      <td className="border border-gray-200 px-4 py-3 font-semibold">
                        {size.label}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">{size.shoulder}</td>
                      <td className="border border-gray-200 px-4 py-3">{size.chest}</td>
                      <td className="border border-gray-200 px-4 py-3">{size.sleeve}</td>
                      <td className="border border-gray-200 px-4 py-3">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.reviewId} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.authorName}</p>
                      <p className="text-sm text-gray-500">
                        {review.height}cm / {review.weight}kg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-2">{review.content}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2">{review.createdAt}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'inquiry' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">상품에 대해 궁금한 점이 있으신가요?</p>
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                문의하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
