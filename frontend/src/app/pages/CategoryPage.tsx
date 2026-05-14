import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { FilterSidebar } from '../components/FilterSidebar';
import { GridLayoutSwitcher } from '../components/GridLayoutSwitcher';
import { AdaptiveProductCard } from '../components/AdaptiveProductCard';
import { ChevronDown } from 'lucide-react';
import { getProducts } from '../api/productApi';
import { getFundingProducts } from '../api/fundingApi';
import type { Product } from '../data/products';

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

function getProductNumber(productId: string) {
  const value = Number(productId);
  return Number.isNaN(value) ? 0 : value;
}

function filterProductsByCategory(products: Product[], category: string) {
  switch (category) {
    case 'funding':
      return products.filter((product) => product.saleType === 'FUNDING');

    case 'resell':
      return products.filter((product) => product.saleType === 'RESELL');

    case 'brand-store':
      // 현재 백엔드 상품 응답에 브랜드/디자이너 구분값이 없어서 임시로 짝수 상품을 브랜드 스토어에 표시
      return products.filter(
          (product) =>
              product.saleType === 'REGULAR' && getProductNumber(product.productId) % 2 === 0
      );

    case 'designer-store':
      // 현재 백엔드 상품 응답에 브랜드/디자이너 구분값이 없어서 임시로 홀수 상품을 디자이너 스토어에 표시
      return products.filter(
          (product) =>
              product.saleType === 'REGULAR' && getProductNumber(product.productId) % 2 === 1
      );

    default:
      return products;
  }
}

function sortProducts(products: Product[], sortBy: string) {
  const copiedProducts = [...products];

  switch (sortBy) {
    case 'price-asc':
      return copiedProducts.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return copiedProducts.sort((a, b) => b.price - a.price);

    case 'funding':
      return copiedProducts.sort(
          (a, b) => (b.fundingAchievementRate ?? 0) - (a.fundingAchievementRate ?? 0)
      );

    case 'popular':
      // 실제 인기 지표가 없으므로 임시로 상품 ID 역순 처리
      return copiedProducts.sort(
          (a, b) => getProductNumber(b.productId) - getProductNumber(a.productId)
      );

    case 'latest':
    default:
      return copiedProducts.sort(
          (a, b) => getProductNumber(b.productId) - getProductNumber(a.productId)
      );
  }
}

export function CategoryPage() {
  const { category } = useParams();

  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [sortBy, setSortBy] = useState('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = category || 'designer-store';
  const categoryData = categoryInfo[currentCategory] || categoryInfo['designer-store'];

  useEffect(() => {
    setLoading(true);

    const loadProducts = currentCategory === 'funding'
        ? getFundingProducts()
        : getProducts();

    loadProducts
        .then(setProducts)
        .catch((error) => {
          console.error('카테고리 상품 조회 실패:', error);
          alert('상품 목록을 불러오지 못했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [currentCategory]);

  const filteredProducts = filterProductsByCategory(products, currentCategory).map((product) => ({
    ...product,
    isFunding: product.saleType === 'FUNDING',
    remainingDays: product.remainingDays,
  }));

  const sortedProducts = sortProducts(filteredProducts, sortBy);

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

  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-16 flex">
          <FilterSidebar />

          <main className="flex-1">
            <div className="border-b border-gray-200 bg-white">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <Breadcrumb
                    items={[
                      {
                        label: categoryData.title,
                        href: `/category/${currentCategory}`,
                      },
                    ]}
                />

                <div className="mt-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {categoryData.title}
                  </h1>
                  <p className="text-gray-600 mt-1">{categoryData.description}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                      총{' '}
                      <span className="font-semibold text-gray-900">
                      {sortedProducts.length}
                    </span>
                      개
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

                  <GridLayoutSwitcher
                      currentColumns={gridColumns}
                      onColumnsChange={setGridColumns}
                  />
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
              {loading ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500">상품 목록을 불러오는 중입니다...</p>
                  </div>
              ) : sortedProducts.length === 0 ? (
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
                      다른 카테고리를 확인해보세요.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      메인으로 돌아가기
                    </Link>
                  </div>
              ) : (
                  <>
                    <div className={`grid ${gridColsClass[gridColumns]} gap-6`}>
                      {sortedProducts.map((product) => (
                          <Link
                            to={product.saleType === 'FUNDING' && product.fundingCampaignId ? `/funding/${product.fundingCampaignId}` : `/product/${product.productId}`}
                            key={product.productId}
                          >
                            <AdaptiveProductCard
                                {...product}
                                isFunding={product.saleType === 'FUNDING'}
                                gridColumns={gridColumns}
                            />
                          </Link>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                          className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                          style={{ border: '0.5px solid #d1d5db' }}
                      >
                        이전
                      </button>

                      {[1].map((page) => (
                          <button
                              key={page}
                              className="w-10 h-10 rounded-lg transition-colors bg-blue-900 text-white"
                          >
                            {page}
                          </button>
                      ))}

                      <button
                          className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                          style={{ border: '0.5px solid #d1d5db' }}
                      >
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