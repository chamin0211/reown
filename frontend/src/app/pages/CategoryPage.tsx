import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { FilterSidebar } from '../components/FilterSidebar';
import { GridLayoutSwitcher } from '../components/GridLayoutSwitcher';
import { AdaptiveProductCard } from '../components/AdaptiveProductCard';
import { ChevronDown } from 'lucide-react';
import { allProducts } from '../data/products';

// 카테고리에 표시할 상품 결정 (실제로는 백엔드 API에서 가져올 데이터)
const getCategoryProducts = (category: string | undefined) => {
  let filteredProducts = allProducts;

  // 카테고리별 필터링 로직
  switch (category) {
    case 'funding':
      // 펀딩 상품만 표시
      filteredProducts = allProducts.filter((p) => p.saleType === 'FUNDING');
      break;
    case 'brand-store':
      // 브랜드 스토어 상품만 표시 (REGULAR 타입 중 brand-로 시작하는 상품)
      filteredProducts = allProducts.filter(
        (p) => p.saleType === 'REGULAR' && p.productId.startsWith('brand-')
      );
      break;
    case 'designer-store':
      // 디자이너 스토어 상품만 표시 (REGULAR 타입 중 designer-로 시작하는 상품)
      filteredProducts = allProducts.filter(
        (p) => p.saleType === 'REGULAR' && p.productId.startsWith('designer-')
      );
      break;
    case 'resell':
      // 리셀 상품만 표시
      filteredProducts = allProducts.filter((p) => p.saleType === 'RESELL');
      break;
    default:
      // 기본값: 모든 상품 표시
      filteredProducts = allProducts;
  }

  // 모든 상품에 isFunding 속성 추가 (호환성 유지)
  return filteredProducts.map((p) => ({
    ...p,
    isFunding: p.saleType === 'FUNDING',
    remainingDays: p.remainingDays,
  }));
};

const categoryInfo: Record<string, { title: string; description: string }> = {
  'designer-store': {
    title: 'DESIGNER STORE',
    description: '신진 디자이너들의 독창적인 작품을 만나보세요',
  },
  funding: {
    title: 'FUNDING',
    description: '함께 만들어가는 패션 프로젝트',
  },
  'brand-store': {
    title: 'BRAND STORE',
    description: '검증된 브랜드의 프리미엄 컬렉션',
  },
  resell: {
    title: 'RESELL',
    description: '새로운 가치를 발견하는 리셀 마켓',
  },
};

export function CategoryPage() {
  const { category } = useParams();
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [sortBy, setSortBy] = useState('latest');

  const currentCategory = category || 'designer-store';
  const categoryData = categoryInfo[currentCategory] || categoryInfo['designer-store'];
  const mockProducts = getCategoryProducts(category);

  // 카테고리별 정렬 옵션 (펀딩 카테고리에서만 달성률 정렬 표시)
  const sortOptions =
    currentCategory === 'funding'
      ? [
          { label: '최신순', value: 'latest' },
          { label: '인기순', value: 'popular' },
          { label: '낮은 가격순', value: 'price-asc' },
          { label: '높은 가격순', value: 'price-desc' },
          { label: '펀딩 달성률순', value: 'funding' },
        ]
      : [
          { label: '최신순', value: 'latest' },
          { label: '인기순', value: 'popular' },
          { label: '낮은 가격순', value: 'price-asc' },
          { label: '높은 가격순', value: 'price-desc' },
        ];

  // 그리드 컬럼 클래스 매핑
  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-16 flex">
        {/* 좌측 필터 사이드바 */}
        <FilterSidebar />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1">
          {/* 상단 영역: Breadcrumb + 타이틀 */}
          <div className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <Breadcrumb
                items={[
                  { label: categoryData.title, href: `/category/${currentCategory}` },
                ]}
              />
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900">{categoryData.title}</h1>
                <p className="text-gray-600 mt-1">{categoryData.description}</p>
              </div>
            </div>
          </div>

          {/* 필터 & 그리드 스위처 바 */}
          <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* 상품 개수 & 정렬 */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    총 <span className="font-semibold text-gray-900">{mockProducts.length}</span>개
                  </p>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* 그리드 레이아웃 스위처 */}
                <GridLayoutSwitcher
                  currentColumns={gridColumns}
                  onColumnsChange={setGridColumns}
                />
              </div>
            </div>
          </div>

          {/* 상품 그리드 */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {mockProducts.length === 0 ? (
              /* Empty State: 상품이 없을 때 */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  현재 등록된 상품이 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  곧 새로운 상품이 등록될 예정입니다. 조금만 기다려주세요!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  메인으로 돌아가기
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid ${gridColsClass[gridColumns]} gap-6`}>
                  {mockProducts.map((product) => (
                    <Link to={`/product/${product.productId}`} key={product.productId}>
                      <AdaptiveProductCard {...product} gridColumns={gridColumns} />
                    </Link>
                  ))}
                </div>

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    이전
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        page === 1
                          ? 'bg-blue-900 text-white'
                          : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    다음
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}