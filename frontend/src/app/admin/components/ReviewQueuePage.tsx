import { useState } from 'react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Filter, Eye } from 'lucide-react';

interface ReviewQueueItem {
  id: string;
  seller: string;
  productType: '일반' | '디자이너 한정판';
  productName: string;
  applicationDate: string;
  reviewStatus: '검토대기' | '검토중' | '추가정보필요';
}

const mockQueueItems: ReviewQueueItem[] = [
  {
    id: 'RQ-2024-047',
    seller: '김리셀',
    productType: '일반',
    productName: '나이키 에어포스 1 화이트',
    applicationDate: '2024.03.27 14:32',
    reviewStatus: '검토대기',
  },
  {
    id: 'RQ-2024-046',
    seller: '박셀러',
    productType: '디자이너 한정판',
    productName: '구찌 GG 마몽 크로스백',
    applicationDate: '2024.03.27 13:15',
    reviewStatus: '검토중',
  },
  {
    id: 'RQ-2024-045',
    seller: '이상품',
    productType: '일반',
    productName: '아디다스 삼바 OG 블랙',
    applicationDate: '2024.03.27 11:28',
    reviewStatus: '검토대기',
  },
  {
    id: 'RQ-2024-044',
    seller: '최명품',
    productType: '디자이너 한정판',
    productName: '루이비통 네버풀 MM',
    applicationDate: '2024.03.27 09:45',
    reviewStatus: '추가정보필요',
  },
  {
    id: 'RQ-2024-043',
    seller: '정운동화',
    productType: '일반',
    productName: '뉴발란스 990v6 그레이',
    applicationDate: '2024.03.26 18:20',
    reviewStatus: '검토대기',
  },
  {
    id: 'RQ-2024-042',
    seller: '한컬렉터',
    productType: '디자이너 한정판',
    productName: '에르메스 버킨 25 블랙',
    applicationDate: '2024.03.26 16:55',
    reviewStatus: '검토중',
  },
  {
    id: 'RQ-2024-041',
    seller: '송리미티드',
    productType: '디자이너 한정판',
    productName: '샤넬 클래식 플랩백 미디엄',
    applicationDate: '2024.03.26 15:10',
    reviewStatus: '검토대기',
  },
  {
    id: 'RQ-2024-040',
    seller: '윤스타일',
    productType: '일반',
    productName: '조던 1 레트로 하이 시카고',
    applicationDate: '2024.03.26 14:33',
    reviewStatus: '추가정보필요',
  },
];

type FilterStatus = 'all' | '검토대기' | '검토중' | '추가정보필요';

export function ReviewQueuePage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredItems = mockQueueItems.filter((item) => {
    if (selectedFilter !== 'all' && item.reviewStatus !== selectedFilter) return false;
    if (searchQuery && !item.productName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '검토대기': 'bg-yellow-100 text-yellow-700',
      '검토중': 'bg-blue-100 text-blue-700',
      '추가정보필요': 'bg-orange-100 text-orange-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">상품 검토 대기열</h1>
              <p className="text-gray-500">검수 대기 중인 상품을 관리합니다</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">총 대기 건수</p>
                <p className="text-2xl font-bold text-blue-600">{filteredItems.length}건</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Search Bar */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '검토대기', '검토중', '추가정보필요'] as FilterStatus[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      selectedFilter === filter
                        ? 'bg-[#1e40af] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all' ? '전체' : filter}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="상품명, 셀러명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <button className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
                  필터
                </button>
              </div>
            </div>
          </div>

          {/* Review Queue Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    검토 ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    셀러명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품 유형
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    신청일시
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    검토 상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600">{item.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {item.seller}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.productType === '디자이너 한정판'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.applicationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          item.reviewStatus
                        )}`}
                      >
                        {item.reviewStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/review-detail/${item.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Eye size={16} />
                        상세 검토
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              {selectedItems.size > 0 ? `${selectedItems.size}개 선택됨 / ` : ''}
              총 {filteredItems.length}개 항목
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-700">
                이전
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors">
                다음
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}