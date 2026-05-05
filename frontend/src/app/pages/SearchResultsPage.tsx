import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { FilterSidebar } from '../components/FilterSidebar';
import { GridLayoutSwitcher } from '../components/GridLayoutSwitcher';
import { AdaptiveProductCard } from '../components/AdaptiveProductCard';
import { ChevronDown, Search } from 'lucide-react';
import { allProducts } from '../data/products';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // 검색 결과 필터링
  const searchResults = allProducts
    .filter((product) => {
      const query = searchParams.get('q')?.toLowerCase() || '';
      if (!query) return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.brandName.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    })
    .map((p) => ({
      ...p,
      isFunding: p.saleType === 'FUNDING',
      remainingDays: p.remainingDays,
    }));

  const sortOptions = [
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-16 flex">
        {/* 좌측 필터 사이드바 */}
        <FilterSidebar />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1">
          {/* 대형 검색바 */}
          <div className="bg-white" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full px-6 py-4 pr-14 text-base text-gray-900 placeholder:text-gray-400 outline-none rounded-lg"
                  style={{ border: '0.5px solid #d1d5db' }}
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-500" />
                </button>
              </form>
            </div>
          </div>

          {/* 상단 영역: Breadcrumb */}
          <div className="bg-white" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
            <div className="max-w-7xl mx-auto px-6 py-6">
              <Breadcrumb
                items={[
                  { label: '검색 결과', href: '/search' },
                ]}
              />
              {searchParams.get('q') && (
                <div className="mt-4">
                  <h1 className="text-3xl font-light text-gray-900">
                    "{searchParams.get('q')}" 검색 결과
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* 필터 & 그리드 스위처 바 */}
          <div className="bg-white sticky top-16 z-40" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* 검색 결과 개수 & 정렬 */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 font-light">
                    검색 결과{' '}
                    <span className="font-medium text-gray-900" style={{ color: '#1e3a8a' }}>
                      {searchResults.length}
                    </span>
                    건
                  </p>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white px-4 py-2 pr-10 text-sm text-gray-700 font-light focus:outline-none rounded"
                      style={{ border: '0.5px solid #d1d5db' }}
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

          {/* 검색 결과 그리드 */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {searchResults.length === 0 ? (
              /* Empty State: 검색 결과가 없을 때 */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 font-light mb-6">
                  다른 검색어로 다시 시도해보세요
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm text-white font-light tracking-wide transition-colors"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  메인으로 돌아가기
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid ${gridColsClass[gridColumns]} gap-6`}>
                  {searchResults.map((product) => (
                    <Link to={`/product/${product.productId}`} key={product.productId}>
                      <AdaptiveProductCard {...product} gridColumns={gridColumns} />
                    </Link>
                  ))}
                </div>

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    className="px-4 py-2 text-gray-700 font-light hover:bg-gray-50 transition-colors rounded"
                    style={{ border: '0.5px solid #d1d5db' }}
                  >
                    이전
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 rounded transition-colors font-light ${
                        page === 1
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={
                        page === 1
                          ? { backgroundColor: '#1e3a8a' }
                          : { border: '0.5px solid #d1d5db' }
                      }
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="px-4 py-2 text-gray-700 font-light hover:bg-gray-50 transition-colors rounded"
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
