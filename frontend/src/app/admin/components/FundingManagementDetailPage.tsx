import { useState } from 'react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Filter, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Funding {
  id: string;
  fundingId: string;
  brandName: string;
  fundingName: string;
  targetAmount: number;
  currentAmount: number;
  achievementRate: number;
  endDate: string;
  status: '진행중' | '조기종료' | '성공' | '실패';
  participantCount: number;
}

const mockFundings: Funding[] = [
  {
    id: '1',
    fundingId: 'FD-2024-001',
    brandName: '나이키',
    fundingName: '에어 조던 1 레트로 하이 리미티드 에디션',
    targetAmount: 50000000,
    currentAmount: 48500000,
    achievementRate: 97,
    endDate: '2024.03.31',
    status: '진행중',
    participantCount: 324,
  },
  {
    id: '2',
    fundingId: 'FD-2024-002',
    brandName: '구찌',
    fundingName: 'GG 마몽 컬렉션 한정 펀딩',
    targetAmount: 100000000,
    currentAmount: 125000000,
    achievementRate: 125,
    endDate: '2024.03.28',
    status: '성공',
    participantCount: 567,
  },
  {
    id: '3',
    fundingId: 'FD-2024-003',
    brandName: '아디다스',
    fundingName: 'Y-3 컬래버레이션 스니커즈',
    targetAmount: 30000000,
    currentAmount: 27500000,
    achievementRate: 92,
    endDate: '2024.04.05',
    status: '진행중',
    participantCount: 198,
  },
  {
    id: '4',
    fundingId: 'FD-2024-004',
    brandName: '루이비통',
    fundingName: '모노그램 캔버스 한정판',
    targetAmount: 150000000,
    currentAmount: 150000000,
    achievementRate: 100,
    endDate: '2024.03.25',
    status: '조기종료',
    participantCount: 789,
  },
  {
    id: '5',
    fundingId: 'FD-2024-005',
    brandName: '뉴발란스',
    fundingName: '990 시리즈 리미티드 컬러웨이',
    targetAmount: 40000000,
    currentAmount: 38200000,
    achievementRate: 96,
    endDate: '2024.04.10',
    status: '진행중',
    participantCount: 245,
  },
  {
    id: '6',
    fundingId: 'FD-2024-006',
    brandName: '에르메스',
    fundingName: '버킨 리미티드 에디션',
    targetAmount: 200000000,
    currentAmount: 85000000,
    achievementRate: 43,
    endDate: '2024.04.15',
    status: '진행중',
    participantCount: 134,
  },
];

type FilterStatus = 'all' | '진행중' | '조기종료' | '성공' | '실패';

export function FundingManagementDetailPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFundings = mockFundings.filter((funding) => {
    if (selectedFilter !== 'all' && funding.status !== selectedFilter) return false;
    if (
      searchQuery &&
      !funding.brandName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !funding.fundingName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '진행중': 'bg-blue-100 text-blue-700',
      '조기종료': 'bg-purple-100 text-purple-700',
      '성공': 'bg-green-100 text-green-700',
      '실패': 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 100) return 'bg-green-600';
    if (rate >= 80) return 'bg-blue-600';
    if (rate >= 50) return 'bg-yellow-600';
    return 'bg-gray-400';
  };

  const stats = {
    total: mockFundings.length,
    active: mockFundings.filter((f) => f.status === '진행중').length,
    successful: mockFundings.filter((f) => f.status === '성공' || f.status === '조기종료').length,
    totalParticipants: mockFundings.reduce((sum, f) => sum + f.participantCount, 0),
    totalFunded: mockFundings.reduce((sum, f) => sum + f.currentAmount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">펀딩 관리</h1>
              <p className="text-gray-500">진행 중인 펀딩 프로젝트를 관리하고 모니터링합니다</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-600" />
                <p className="text-sm text-gray-600">전체 펀딩</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-600" />
                <p className="text-sm text-gray-600">진행중</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <p className="text-sm text-gray-600">성공</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.successful}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">총 펀딩액</p>
              <p className="text-2xl font-bold text-purple-600">
                ₩{(stats.totalFunded / 100000000).toFixed(1)}억
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Search */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '진행중', '성공', '조기종료', '실패'] as FilterStatus[]).map((filter) => (
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
                    placeholder="브랜드명, 펀딩명 검색..."
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

          {/* Funding Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    펀딩 ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    브랜드명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    펀딩명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    목표액
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    달성률
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    참여자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    종료일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFundings.map((funding) => (
                  <tr key={funding.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/funding/${funding.fundingId}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {funding.fundingId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {funding.brandName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{funding.fundingName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ₩{(funding.targetAmount / 10000).toLocaleString()}만
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-48">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {funding.achievementRate}%
                          </span>
                          <span className="text-xs text-gray-600">
                            ₩{(funding.currentAmount / 10000).toLocaleString()}만
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${getProgressColor(
                              funding.achievementRate
                            )}`}
                            style={{ width: `${Math.min(funding.achievementRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {funding.participantCount}명
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {funding.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          funding.status
                        )}`}
                      >
                        {funding.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">총 {filteredFundings.length}개 펀딩</p>
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