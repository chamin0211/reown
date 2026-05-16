import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { FilterSidebar } from '../components/FilterSidebar';
import { GridLayoutSwitcher } from '../components/GridLayoutSwitcher';
import { AdaptiveProductCard } from '../components/AdaptiveProductCard';
import { ChevronDown, Search } from 'lucide-react';
import { getProducts } from '../api/productApi';
import type { Product } from '../data/products';
import { applyProductFilters, type StoreFilters } from '../utils/productFilters';

function getProductNumber(productId: string) {
  const value = Number(productId);
  return Number.isNaN(value) ? 0 : value;
}

function searchProducts(products: Product[], query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return products;
  }

  return products.filter((product) => {
    const name = product.name.toLowerCase();
    const brandName = product.brandName.toLowerCase();
    const saleType = product.saleType.toLowerCase();

    return (
        name.includes(keyword) ||
        brandName.includes(keyword) ||
        saleType.includes(keyword)
    );
  });
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

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [sortBy, setSortBy] = useState('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<StoreFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);

    getProducts()
        .then(setProducts)
        .catch((error) => {
          console.error('검색 상품 조회 실패:', error);
          alert('검색 결과를 불러오지 못했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextQuery = searchInput.trim();

    if (!nextQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: nextQuery });
  };

  const sortedProducts = useMemo(() => {
    const searchedProducts = searchProducts(products, query).map((product) => ({
      ...product,
      isFunding: product.saleType === 'FUNDING',
      remainingDays: product.remainingDays,
    }));

    return sortProducts(applyProductFilters(searchedProducts, filters), sortBy);
  }, [products, query, filters, sortBy]);

  const sortOptions = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '낮은 가격순', value: 'price-asc' },
    { label: '높은 가격순', value: 'price-desc' },
    { label: '펀딩 달성률순', value: 'funding' },
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
          <FilterSidebar onFilterChange={setFilters} />

          <main className="flex-1">
            <div className="border-b border-gray-200 bg-white">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <Breadcrumb
                    items={[
                      {
                        label: 'SEARCH',
                        href: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
                      },
                    ]}
                />

                <div className="mt-4">
                  <h1 className="text-3xl font-bold text-gray-900">SEARCH</h1>
                  <p className="text-gray-600 mt-1">
                    {query ? `"${query}" 검색 결과입니다` : '상품명 또는 브랜드명을 검색해보세요'}
                  </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl">
                  <div className="relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="상품명 또는 브랜드명을 입력하세요"
                        className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </form>
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
                    <p className="text-gray-500">검색 결과를 불러오는 중입니다...</p>
                  </div>
              ) : sortedProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      조건에 맞는 상품이 없습니다
                    </h3>

                    <p className="text-gray-600 mb-6">
                      검색어 또는 필터 조건을 변경해보세요.
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
                          <Link to={`/product/${product.productId}`} key={product.productId}>
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