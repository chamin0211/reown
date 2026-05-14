import { useState } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Filter, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Settlement {
  id: string;
  sellerName: string;
  totalSales: number;
  platformFee: number;
  finalSettlement: number;
  settlementDate: string;
  status: '정산대기' | '정산완료' | '보류';
  orderCount: number;
}

const mockSettlements: Settlement[] = [
  {
    id: '1',
    sellerName: '김리셀',
    totalSales: 5240000,
    platformFee: 524000,
    finalSettlement: 4716000,
    settlementDate: '2024.04.01',
    status: '정산대기',
    orderCount: 12,
  },
  {
    id: '2',
    sellerName: '박셀러',
    totalSales: 12480000,
    platformFee: 1248000,
    finalSettlement: 11232000,
    settlementDate: '2024.04.01',
    status: '정산대기',
    orderCount: 8,
  },
  {
    id: '3',
    sellerName: '이상품',
    totalSales: 3890000,
    platformFee: 389000,
    finalSettlement: 3501000,
    settlementDate: '2024.03.25',
    status: '정산완료',
    orderCount: 15,
  },
  {
    id: '4',
    sellerName: '최명품',
    totalSales: 28500000,
    platformFee: 2850000,
    finalSettlement: 25650000,
    settlementDate: '2024.04.01',
    status: '정산대기',
    orderCount: 6,
  },
  {
    id: '5',
    sellerName: '정운동화',
    totalSales: 7650000,
    platformFee: 765000,
    finalSettlement: 6885000,
    settlementDate: '2024.03.25',
    status: '정산완료',
    orderCount: 23,
  },
  {
    id: '6',
    sellerName: '한컬렉터',
    totalSales: 45200000,
    platformFee: 4520000,
    finalSettlement: 40680000,
    settlementDate: '2024.04.01',
    status: '보류',
    orderCount: 4,
  },
];

type FilterStatus = 'all' | '정산대기' | '정산완료' | '보류';

export function SettlementManagementPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSettlements, setSelectedSettlements] = useState<Set<string>>(new Set());

  const filteredSettlements = mockSettlements.filter((settlement) => {
    if (selectedFilter !== 'all' && settlement.status !== selectedFilter) return false;
    if (searchQuery && !settlement.sellerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '정산대기': 'bg-yellow-100 text-yellow-700',
      '정산완료': 'bg-green-100 text-green-700',
      '보류': 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSettlements(new Set(filteredSettlements.map((s) => s.id)));
    } else {
      setSelectedSettlements(new Set());
    }
  };

  const handleSelectSettlement = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedSettlements);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedSettlements(newSelected);
  };

  const handleBulkComplete = () => {
    if (selectedSettlements.size === 0) {
      alert('정산 완료 처리할 항목을 선택해주세요.');
      return;
    }
    if (confirm(`선택한 ${selectedSettlements.size}건의 정산을 완료 처리하시겠습니까?`)) {
      alert(`${selectedSettlements.size}건의 정산이 완료 처리되었습니다.`);
      setSelectedSettlements(new Set());
    }
  };

  const stats = {
    totalThisMonth: mockSettlements
      .filter((s) => s.status === '정산대기')
      .reduce((sum, s) => sum + s.finalSettlement, 0),
    pending: mockSettlements.filter((s) => s.status === '정산대기').length,
    completed: mockSettlements.filter((s) => s.status === '정산완료').length,
    totalPlatformFee: mockSettlements
      .filter((s) => s.status === '정산대기')
      .reduce((sum, s) => sum + s.platformFee, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">정산 관리</h1>
              <p className="text-gray-500">셀러 매출 정산을 관리합니다</p>
            </div>
          </div>

          {/* Main Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-2 font-medium">이번 달 총 정산 예정액</p>
                <p className="text-5xl font-bold text-white mb-2">
                  ₩{(stats.totalThisMonth / 10000).toLocaleString()}만
                </p>
                <p className="text-blue-100 text-sm">
                  {stats.pending}개 셀러 정산 대기 중
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-xl">
                <DollarSign size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-600" />
                <p className="text-sm text-gray-600">정산 대기</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <p className="text-sm text-gray-600">정산 완료</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-purple-600" />
                <p className="text-sm text-gray-600">플랫폼 수수료</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ₩{(stats.totalPlatformFee / 10000).toLocaleString()}만
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">수수료율</p>
              <p className="text-3xl font-bold text-blue-600">10%</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Actions */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '정산대기', '정산완료', '보류'] as FilterStatus[]).map((filter) => (
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
                    placeholder="셀러명 검색..."
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

            {/* Bulk Actions */}
            {selectedSettlements.size > 0 && (
              <div className="px-6 pb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-900">
                    {selectedSettlements.size}개 정산이 선택되었습니다
                  </p>
                  <button
                    onClick={handleBulkComplete}
                    className="px-4 py-2 bg-[#1e40af] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    일괄 정산 완료
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settlement Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedSettlements.size === filteredSettlements.length && filteredSettlements.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    셀러명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    주문 건수
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    총 매출
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    플랫폼 수수료 (10%)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    최종 정산액
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    정산예정일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSettlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSettlements.has(settlement.id)}
                        onChange={(e) => handleSelectSettlement(settlement.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{settlement.sellerName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {settlement.orderCount}건
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₩{settlement.totalSales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      -₩{settlement.platformFee.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      ₩{settlement.finalSettlement.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {settlement.settlementDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          settlement.status
                        )}`}
                      >
                        {settlement.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              {selectedSettlements.size > 0 ? `${selectedSettlements.size}개 선택됨 / ` : ''}
              총 {filteredSettlements.length}개 정산
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