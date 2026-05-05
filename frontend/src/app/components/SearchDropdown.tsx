import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Burberry Trench Coat',
    'Gucci Loafer',
    'Chanel Classic Bag',
    'Hermès Birkin',
  ]);

  const recentBrands = [
    { id: 1, name: 'Gucci' },
    { id: 2, name: 'Prada' },
    { id: 3, name: 'Burberry' },
    { id: 4, name: 'Hermès' },
    { id: 5, name: 'Chanel' },
  ];

  const popularSearches = [
    { rank: 1, keyword: 'Burberry Trench Coat', trend: 'up' },
    { rank: 2, keyword: 'Gucci Loafer', trend: 'up' },
    { rank: 3, keyword: 'Prada Backpack', trend: 'down' },
    { rank: 4, keyword: 'Chanel Classic Bag', trend: 'stable' },
    { rank: 5, keyword: 'Hermès Birkin', trend: 'up' },
    { rank: 6, keyword: 'Louis Vuitton Monogram', trend: 'stable' },
    { rank: 7, keyword: 'Balenciaga Sneakers', trend: 'down' },
    { rank: 8, keyword: 'Dior Saddle Bag', trend: 'up' },
    { rank: 9, keyword: 'Fendi Baguette', trend: 'stable' },
    { rank: 10, keyword: 'Celine Triomphe', trend: 'up' },
  ];

  const trendingSearches = [
    { rank: 1, keyword: 'Balenciaga Triple S', trend: 'up' },
    { rank: 2, keyword: 'Off-White Hoodie', trend: 'up' },
    { rank: 3, keyword: 'Thom Browne Cardigan', trend: 'up' },
    { rank: 4, keyword: 'Acne Studios', trend: 'up' },
    { rank: 5, keyword: 'Maison Margiela Tabi', trend: 'up' },
    { rank: 6, keyword: 'Rick Owens Sneakers', trend: 'up' },
    { rank: 7, keyword: 'Arc\'teryx Backpack', trend: 'up' },
    { rank: 8, keyword: 'Diptyque Fragrance', trend: 'up' },
    { rank: 9, keyword: 'Golden Goose Sneakers', trend: 'up' },
    { rank: 10, keyword: 'Vetements Hoodie', trend: 'up' },
  ];

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches(recentSearches.filter((search) => search !== keyword));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-[#1e3a8a]"/>;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-gray-400" />;
    return <Minus className="w-3 h-3 text-gray-300" />;
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50" onClick={onClose}>
      {/* Top 2/3 White Section */}
      <div className="relative w-full" style={{ height: '66.67vh' }}>
        {/* Background Layer - Transparent Black Full Screen */}
        <div className="absolute inset-0 bg-black/0" />

        {/* Unified 1200px Column */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-white z-20" style={{ width: '1220px', height: '100%' }} onClick={(e) => e.stopPropagation()}>
          {/* Top Search Bar - Same 1220px Width */}
          <div className="flex items-center h-16 px-12 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by brand, product name, or serial number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 outline-none text-base text-gray-900 placeholder:text-gray-300"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={onClose} className="ml-6 hover:opacity-60 transition-opacity">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content Area - 1200px Width */}
          <div className="px-12 py-5 flex-1 overflow-hidden flex flex-col">
            {/* Recent Searches */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                <button
                  onClick={clearAllRecentSearches}
                  className="text-sm text-gray-400 hover:text-blue-900 transition-colors underline"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center gap-2 px-4 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <span
                      onClick={() => handleSearch(keyword)}
                      className="text-sm text-gray-600"
                    >
                      {keyword}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(keyword);
                      }}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Brands */}
            <div className="mb-4 pb-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Brands</h3>
              <div className="flex gap-2 flex-wrap">
                {recentBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleSearch(brand.name)}
                    className="px-4 py-1 rounded hover:bg-blue-50 transition-all cursor-pointer"
                    style={{ border: '0.5px solid #e5e7eb' }}
                  >
                    <span className="text-sm text-gray-700 whitespace-nowrap">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings - Two Columns */}
            <div className="grid grid-cols-2 gap-16 flex-1">
              {/* Top Searches */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Top Searches</h3>
                  <span className="text-xs text-gray-400">05.03 15:20</span>
                </div>
                <div className="space-y-2">
                  {popularSearches.map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => handleSearch(item.keyword)}
                      className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <span
                        className="w-3 text-center text-sm font-bold"
                        style={{ color: item.rank <= 3 ? '#1e3a8a' : '#9ca3af' }}
                      >
                        {item.rank}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">{item.keyword}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rising */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Rising</h3>
                  <span className="text-xs text-gray-400">05.03 15:20</span>
                </div>
                <div className="space-y-2">
                  {trendingSearches.map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => handleSearch(item.keyword)}
                      className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <span
                        className="w-3 text-center text-sm font-bold"
                        style={{ color: item.rank <= 3 ? '#1e3a8a' : '#9ca3af' }}
                      >
                        {item.rank}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">{item.keyword}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 1/3 Section - Transparent Black */}
      <div className="relative" style={{ height: '33.33vh' }}>
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </div>
  );
}
