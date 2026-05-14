import { useState } from 'react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Filter, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResellInspection {
  id: string;
  inspectionNumber: string;
  productName: string;
  productThumbnail: string;
  seller: string;
  brand: string;
  applicationDate: string;
  inspectionStatus: '검수대기' | '검수중' | '정품승인' | '가품판정';
  priority: 'normal' | 'urgent';
}

const mockInspections: ResellInspection[] = [
  {
    id: '1',
    inspectionNumber: 'INS-2024-0087',
    productName: '나이키 에어 조던 1 레트로 하이 시카고',
    productThumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
    seller: '홍길동',
    brand: 'Nike',
    applicationDate: '2024.03.27 14:32',
    inspectionStatus: '검수대기',
    priority: 'urgent',
  },
  {
    id: '2',
    inspectionNumber: 'INS-2024-0086',
    productName: '구찌 GG 마몽 벨트백',
    productThumbnail: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop',
    seller: '김영희',
    brand: 'Gucci',
    applicationDate: '2024.03.27 13:15',
    inspectionStatus: '검수중',
    priority: 'normal',
  },
  {
    id: '3',
    inspectionNumber: 'INS-2024-0085',
    productName: '루이비통 모노그램 스피디 30',
    productThumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
    seller: '이철수',
    brand: 'Louis Vuitton',
    applicationDate: '2024.03.27 11:28',
    inspectionStatus: '정품승인',
    priority: 'normal',
  },
  {
    id: '4',
    inspectionNumber: 'INS-2024-0084',
    productName: '샤넬 클래식 플랩백 미디엄',
    productThumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop',
    seller: '박민수',
    brand: 'Chanel',
    applicationDate: '2024.03.27 09:45',
    inspectionStatus: '검수대기',
    priority: 'urgent',
  },
  {
    id: '5',
    inspectionNumber: 'INS-2024-0083',
    productName: '아디다스 이지 부스트 350 V2',
    productThumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop',
    seller: '최영수',
    brand: 'Adidas',
    applicationDate: '2024.03.26 18:20',
    inspectionStatus: '가품판정',
    priority: 'normal',
  },
  {
    id: '6',
    inspectionNumber: 'INS-2024-0082',
    productName: '에르메스 켈리백 28',
    productThumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
    seller: '정미희',
    brand: 'Hermès',
    applicationDate: '2024.03.26 16:55',
    inspectionStatus: '검수중',
    priority: 'urgent',
  },
  {
    id: '7',
    inspectionNumber: 'INS-2024-0081',
    productName: '발렌시아가 트리플 S 스니커즈',
    productThumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop',
    seller: '송준호',
    brand: 'Balenciaga',
    applicationDate: '2024.03.26 15:10',
    inspectionStatus: '정품승인',
    priority: 'normal',
  },
];

type FilterStatus = 'all' | '검수대기' | '검수중' | '정품승인' | '가품판정';

export function ResellInspectionQueuePage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredInspections = mockInspections.filter((inspection) => {
    if (selectedFilter !== 'all' && inspection.inspectionStatus !== selectedFilter) return false;
    if (
      searchQuery &&
      !inspection.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inspection.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inspection.seller.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '검수대기': 'bg-yellow-100 text-yellow-700',
      '검수중': 'bg-blue-100 text-blue-700',
      '정품승인': 'bg-green-100 text-green-700',
      '가품판정': 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredInspections.map((item) => item.id)));
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

  const stats = {
    total: mockInspections.length,
    pending: mockInspections.filter((i) => i.inspectionStatus === '검수대기').length,
    inProgress: mockInspections.filter((i) => i.inspectionStatus === '검수중').length,
    approved: mockInspections.filter((i) => i.inspectionStatus === '정품승인').length,
    rejected: mockInspections.filter((i) => i.inspectionStatus === '가품판정').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">리셀 검수 관리</h1>
              <p className="text-gray-500">리셀 상품의 정품 여부를 검수하고 승인합니다</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <AlertTriangle size={20} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">
                긴급 검수 {mockInspections.filter((i) => i.priority === 'urgent').length}건 대기중
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">전체 검수</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">검수 대기</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">검수 중</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">정품 승인</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">가품 판정</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Search */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '검수대기', '검수중', '정품승인', '가품판정'] as FilterStatus[]).map((filter) => (
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="검수번호, 상품명, 판매자 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <button className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <Filter size={18} />
                  필터
                </button>
              </div>
            </div>
          </div>

          {/* Inspection Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredInspections.length && filteredInspections.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    검수번호
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    브랜드
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    판매자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    검수신청일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    검수상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInspections.map((inspection) => (
                  <tr
                    key={inspection.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      inspection.priority === 'urgent' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(inspection.id)}
                        onChange={(e) => handleSelectItem(inspection.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {inspection.priority === 'urgent' && (
                          <AlertTriangle size={16} className="text-yellow-600" />
                        )}
                        <span className="text-sm font-semibold text-blue-600">
                          {inspection.inspectionNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inspection.productThumbnail}
                          alt={inspection.productName}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                        <span className="text-sm font-medium text-gray-900">{inspection.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {inspection.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {inspection.seller}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inspection.applicationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          inspection.inspectionStatus
                        )}`}
                      >
                        {inspection.inspectionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/resell-inspection/${inspection.inspectionNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Eye size={16} />
                        상세 검수
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
              총 {filteredInspections.length}개 검수
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