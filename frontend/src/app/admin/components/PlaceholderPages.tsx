import { PlaceholderPage } from './PlaceholderPage';
import { useState } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Filter, FileText, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';

export function OrdersPage() {
  return <PlaceholderPage title="주문/배송 관리" description="주문 및 배송 현황을 관리합니다" />;
}

export function FundingManagementPage() {
  return <PlaceholderPage title="펀딩 관리" description="진행 중인 펀딩 프로젝트를 관리합니다" />;
}

export function ReviewPage() {
  return <PlaceholderPage title="리셀 검수" description="리셀 상품 검수를 진행합니다" />;
}

export function SettlementPage() {
  return <PlaceholderPage title="정산 관리" description="판매자 정산 내역을 관리합니다" />;
}

// Seller Management
interface OnboardingApplication {
  id: string;
  brandName: string;
  category: 'DOMESTIC' | 'DESIGNER';
  purpose: 'FUNDING_ONLY' | 'FULL_STORE';
  applicationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEWING';
}

const mockApplications: OnboardingApplication[] = [
  {
    id: 'APP-2024-012',
    brandName: 'Noir Archive',
    category: 'DESIGNER',
    purpose: 'FULL_STORE',
    applicationDate: '2024.03.27',
    status: 'PENDING',
  },
  {
    id: 'APP-2024-011',
    brandName: '무신사 스탠다드',
    category: 'DOMESTIC',
    purpose: 'FULL_STORE',
    applicationDate: '2024.03.26',
    status: 'REVIEWING',
  },
  {
    id: 'APP-2024-010',
    brandName: 'Atelier Seoul',
    category: 'DESIGNER',
    purpose: 'FUNDING_ONLY',
    applicationDate: '2024.03.25',
    status: 'APPROVED',
  },
  {
    id: 'APP-2024-009',
    brandName: '29CM 브랜드',
    category: 'DOMESTIC',
    purpose: 'FULL_STORE',
    applicationDate: '2024.03.24',
    status: 'APPROVED',
  },
  {
    id: 'APP-2024-008',
    brandName: 'Maison Kitsune Korea',
    category: 'DOMESTIC',
    purpose: 'FULL_STORE',
    applicationDate: '2024.03.23',
    status: 'REJECTED',
  },
  {
    id: 'APP-2024-007',
    brandName: 'Heritage Lab',
    category: 'DESIGNER',
    purpose: 'FUNDING_ONLY',
    applicationDate: '2024.03.22',
    status: 'PENDING',
  },
];

export function SellerOnboardingPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(mockApplications);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [domesticFee, setDomesticFee] = useState('15');
  const [designerFee, setDesignerFee] = useState('12');
  const [settlementCycle, setSettlementCycle] = useState('MONTHLY');

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { label: '심사 대기', style: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      REVIEWING: { label: '검토 중', style: 'bg-blue-100 text-blue-800 border-blue-300' },
      APPROVED: { label: '승인 완료', style: 'bg-green-100 text-green-800 border-green-300' },
      REJECTED: { label: '반려', style: 'bg-red-100 text-red-800 border-red-300' },
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const getCategoryBadge = (category: string) => {
    return category === 'DOMESTIC'
      ? { label: '국내', style: 'bg-blue-50 text-blue-700 border-blue-200' }
      : { label: '디자이너', style: 'bg-purple-50 text-purple-700 border-purple-200' };
  };

  const getPurposeBadge = (purpose: string) => {
    return purpose === 'FUNDING_ONLY'
      ? { label: '펀딩 전용', style: 'bg-green-50 text-green-700 border-green-200' }
      : { label: '정식 입점', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = 
      selectedFilter === 'ALL' || 
      (selectedFilter === 'PENDING' && app.status === 'PENDING') ||
      (selectedFilter === 'APPROVED' && app.status === 'APPROVED');
    
    const matchesSearch = 
      app.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleReview = (id: string) => {
    navigate(`/seller/onboarding/${id}`);
  };

  const handleSaveSettings = () => {
    alert(`설정이 저장되었습니다.\n국내 셀러: ${domesticFee}%\n디자이너: ${designerFee}%\n정산 주기: ${settlementCycle === 'WEEKLY' ? '주간' : '월간'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">신규 브랜드/셀러 입점 심사</h1>
          <p className="text-gray-600">Onboarding Review Queue - 브랜드 입점 신청을 검토하고 승인합니다</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="브랜드명 또는 신청 ID로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === 'ALL'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedFilter('PENDING')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === 'PENDING'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                심사 대기
              </button>
              <button
                onClick={() => setSelectedFilter('APPROVED')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedFilter === 'APPROVED'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                승인 완료
              </button>
            </div>
          </div>
        </div>

        {/* Onboarding Review Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredApplications.length && filteredApplications.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    신청 ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    브랜드명
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    구분
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    목적
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  const categoryBadge = getCategoryBadge(app.category);
                  const purposeBadge = getPurposeBadge(app.purpose);

                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(app.id)}
                          onChange={() => toggleSelect(app.id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-blue-600">{app.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{app.brandName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${categoryBadge.style}`}>
                          {categoryBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${purposeBadge.style}`}>
                          {purposeBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{app.applicationDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${statusBadge.style}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleReview(app.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                        >
                          <Eye size={16} />
                          검토하기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
            </div>
          )}
        </div>

        {/* Contracts & Fees Form */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">플랫폼 수수료 및 정산 설정</h2>
          </div>
          <p className="text-gray-600 mb-8">Contract & Fee Config - 셀러 카테고리별 수수료율과 정산 주기를 설정합니다</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Domestic Seller Fee */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                기본 국내 셀러 수수료 (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={domesticFee}
                  onChange={(e) => setDomesticFee(e.target.value)}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">일반 국내 브랜드에 적용되는 기본 수수료율입니다</p>
            </div>

            {/* Designer Seller Fee */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                프리미엄 디자이너 수수료 (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={designerFee}
                  onChange={(e) => setDesignerFee(e.target.value)}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-lg"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">디자이너 브랜드 우대 수수료율입니다 (일반보다 낮음)</p>
            </div>

            {/* Settlement Cycle */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                정산 주기 (Settlement Cycle)
              </label>
              <select
                value={settlementCycle}
                onChange={(e) => setSettlementCycle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg cursor-pointer"
              >
                <option value="WEEKLY">주간 정산 (Weekly Settlement)</option>
                <option value="MONTHLY">월간 정산 (Monthly Settlement)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                셀러에게 판매 대금을 지급하는 주기를 설정합니다. 주간 정산은 매주 금요일, 월간 정산은 매월 말일에 진행됩니다.
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">💡 수수료 정책 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
              <li>디자이너 브랜드는 특별 혜택으로 낮은 수수료가 적용됩니다</li>
              <li>수수료는 판매 완료 시점에 자동으로 차감되며, 정산 금액에 반영됩니다</li>
              <li>펀딩 프로젝트는 별도의 수수료 정책이 적용될 수 있습니다</li>
            </ul>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
          >
            <Save size={24} />
            설정 저장 (Save Settings)
          </button>
        </div>
      </main>
    </div>
  );
}

// Master Seller List Interface
interface MasterSeller {
  id: string;
  brandName: string;
  category: 'DOMESTIC' | 'DESIGNER';
  gmv: number;
  activeFundings: number;
  settlementStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  joinDate: string;
}

const mockMasterSellers: MasterSeller[] = [
  {
    id: 'SEL-2024-001',
    brandName: 'Ader Error',
    category: 'DESIGNER',
    gmv: 245000000,
    activeFundings: 3,
    settlementStatus: 'COMPLETED',
    joinDate: '2023.05.12',
  },
  {
    id: 'SEL-2024-002',
    brandName: 'Thisisneverthat',
    category: 'DESIGNER',
    gmv: 189500000,
    activeFundings: 2,
    settlementStatus: 'PENDING',
    joinDate: '2023.07.08',
  },
  {
    id: 'SEL-2024-003',
    brandName: 'Noir Archive',
    category: 'DESIGNER',
    gmv: 87600000,
    activeFundings: 1,
    settlementStatus: 'PROCESSING',
    joinDate: '2024.01.15',
  },
  {
    id: 'SEL-2024-004',
    brandName: '무신사 스탠다드',
    category: 'DOMESTIC',
    gmv: 512000000,
    activeFundings: 0,
    settlementStatus: 'COMPLETED',
    joinDate: '2022.11.20',
  },
  {
    id: 'SEL-2024-005',
    brandName: 'Atelier Seoul',
    category: 'DESIGNER',
    gmv: 63400000,
    activeFundings: 2,
    settlementStatus: 'PENDING',
    joinDate: '2024.02.22',
  },
  {
    id: 'SEL-2024-006',
    brandName: '29CM 브랜드',
    category: 'DOMESTIC',
    gmv: 324500000,
    activeFundings: 1,
    settlementStatus: 'COMPLETED',
    joinDate: '2023.03.14',
  },
  {
    id: 'SEL-2024-007',
    brandName: 'Heritage Lab',
    category: 'DESIGNER',
    gmv: 42100000,
    activeFundings: 1,
    settlementStatus: 'PROCESSING',
    joinDate: '2024.03.01',
  },
  {
    id: 'SEL-2024-008',
    brandName: 'Maison Kitsune Korea',
    category: 'DOMESTIC',
    gmv: 198700000,
    activeFundings: 0,
    settlementStatus: 'COMPLETED',
    joinDate: '2023.09.05',
  },
];

export function SellerListPage() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState(mockMasterSellers);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'DOMESTIC' | 'DESIGNER'>('ALL');

  const getSettlementBadge = (status: string) => {
    const badges = {
      COMPLETED: { label: '정산 완료', style: 'bg-green-100 text-green-800 border-green-300' },
      PENDING: { label: '정산 대기', style: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      PROCESSING: { label: '정산 진행중', style: 'bg-blue-100 text-blue-800 border-blue-300' },
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const getCategoryBadge = (category: string) => {
    return category === 'DOMESTIC'
      ? { label: '국내 브랜드', style: 'bg-blue-50 text-blue-700 border-blue-200' }
      : { label: '디자이너', style: 'bg-purple-50 text-purple-700 border-purple-200' };
  };

  const formatCurrency = (amount: number) => {
    return `₩${(amount / 10000).toFixed(0)}만원`;
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'DOMESTIC' && seller.category === 'DOMESTIC') ||
      (categoryFilter === 'DESIGNER' && seller.category === 'DESIGNER');

    const matchesSearch =
      seller.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">입점 브랜드/셀러 전체 목록</h1>
          <p className="text-gray-600">Master Seller List - 플랫폼에 입점한 모든 셀러를 관리합니다</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="브랜드명 또는 셀러 ID 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  categoryFilter === 'ALL'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setCategoryFilter('DOMESTIC')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  categoryFilter === 'DOMESTIC'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                국내 브랜드
              </button>
              <button
                onClick={() => setCategoryFilter('DESIGNER')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  categoryFilter === 'DESIGNER'
                    ? 'bg-[#1e40af] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                디자이너
              </button>
            </div>
          </div>
        </div>

        {/* Master Seller Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    셀러 ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    브랜드명
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    총 거래액 (GMV)
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    진행 펀딩 수
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    정산 상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    입점일
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSellers.map((seller) => {
                  const settlementBadge = getSettlementBadge(seller.settlementStatus);
                  const categoryBadge = getCategoryBadge(seller.category);

                  return (
                    <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-blue-600">{seller.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{seller.brandName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${categoryBadge.style}`}>
                          {categoryBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-lg text-gray-900">{formatCurrency(seller.gmv)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          seller.activeFundings > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {seller.activeFundings}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${settlementBadge.style}`}>
                          {settlementBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{seller.joinDate}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/seller/list`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                        >
                          <Eye size={16} />
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredSellers.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">전체 셀러 수</div>
            <div className="text-2xl font-bold text-gray-900">{sellers.length}개</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">총 거래액</div>
            <div className="text-2xl font-bold text-blue-600">
              ₩{(sellers.reduce((sum, s) => sum + s.gmv, 0) / 100000000).toFixed(1)}억원
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">진행중 펀딩</div>
            <div className="text-2xl font-bold text-green-600">
              {sellers.reduce((sum, s) => sum + s.activeFundings, 0)}건
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">정산 대기</div>
            <div className="text-2xl font-bold text-yellow-600">
              {sellers.filter((s) => s.settlementStatus === 'PENDING').length}건
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function SellerContractPage() {
  const [domesticFee, setDomesticFee] = useState('15');
  const [designerFee, setDesignerFee] = useState('12');
  const [settlementCycle, setSettlementCycle] = useState('MONTHLY');
  const [minSettlementAmount, setMinSettlementAmount] = useState('100000');

  const handleSaveSettings = () => {
    alert(
      `설정이 저장되었습니다.\n\n기본 입점 수수료: ${domesticFee}%\n디자이너 우대 수수료: ${designerFee}%\n정산 주기: ${settlementCycle === 'WEEKLY' ? '주간 정산' : '월간 정산'}\n최소 정산 금액: ₩${Number(minSettlementAmount).toLocaleString()}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">계약 및 수수료 설정</h1>
          <p className="text-gray-600">Global Fee & Contract Settings - 플랫폼 전체 수수료 및 정산 정책을 설정합니다</p>
        </div>

        {/* Main Settings Form */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={28} className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">플랫폼 수수료 관리</h2>
              <p className="text-sm text-gray-600">셀러 카테고리별 기본 수수료율을 설정합니다</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Domestic Seller Fee */}
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <label className="block text-base font-bold text-gray-800 mb-4">
                기본 입점 수수료 (%)
              </label>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={domesticFee}
                  onChange={(e) => setDomesticFee(e.target.value)}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-2xl"
                />
                <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">
                  %
                </span>
              </div>
              <p className="text-sm text-blue-800">
                일반 국내 브랜드에 적용되는 표준 수수료율입니다
              </p>
            </div>

            {/* Designer Seller Fee */}
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <label className="block text-base font-bold text-gray-800 mb-4">
                디자이너 우대 수수료 (%)
              </label>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={designerFee}
                  onChange={(e) => setDesignerFee(e.target.value)}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-bold text-2xl"
                />
                <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">
                  %
                </span>
              </div>
              <p className="text-sm text-purple-800">
                디자이너 브랜드 특별 혜택 수수료율 (일반보다 낮음)
              </p>
            </div>
          </div>

          {/* Settlement Settings */}
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <label className="block text-base font-bold text-gray-800 mb-4">
                정산 주기 설정
              </label>
              <select
                value={settlementCycle}
                onChange={(e) => setSettlementCycle(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg cursor-pointer"
              >
                <option value="WEEKLY">주간 정산 (매주 금요일)</option>
                <option value="MONTHLY">월간 정산 (매월 말일)</option>
              </select>
              <p className="text-sm text-gray-600 mt-3">
                셀러에게 판매 대금을 지급하는 주기를 설정합니다
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <label className="block text-base font-bold text-gray-800 mb-4">
                최소 정산 금액
              </label>
              <div className="relative mb-3">
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">
                  ₩
                </span>
                <input
                  type="number"
                  value={minSettlementAmount}
                  onChange={(e) => setMinSettlementAmount(e.target.value)}
                  min="0"
                  step="10000"
                  className="w-full pl-12 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-2xl"
                />
              </div>
              <p className="text-sm text-gray-600">
                이 금액 미만일 경우 다음 정산 주기로 이월됩니다
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 mb-8">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">💡 수수료 정책 안내</h4>
            <ul className="text-sm text-blue-800 space-y-2 ml-5 list-disc">
              <li>
                <strong>디자이너 브랜드</strong>는 플랫폼 성장 기여도에 따라 특별 혜택이 제공됩니다
              </li>
              <li>
                수수료는 <strong>판매 완료 확정 시점</strong>에 자동으로 차감되며, 정산 금액에 반영됩니다
              </li>
              <li>
                <strong>펀딩 프로젝트</strong>는 별도의 수수료 정책(성공 보수제)이 적용될 수 있습니다
              </li>
              <li>
                최소 정산 금액 미만인 경우, 수수료는 차감되지만 지급은 다음 주기로 이월됩니다
              </li>
            </ul>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="w-full px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-4 text-xl"
          >
            <Save size={28} />
            설정 내용 저장 (Save Changes)
          </button>
        </div>

        {/* Quick Reference Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 현재 설정 요약</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">국내 브랜드</div>
              <div className="text-3xl font-bold text-blue-600">{domesticFee}%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">디자이너</div>
              <div className="text-3xl font-bold text-purple-600">{designerFee}%</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">정산 주기</div>
              <div className="text-xl font-bold text-green-600">
                {settlementCycle === 'WEEKLY' ? '주간' : '월간'}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">최소 금액</div>
              <div className="text-xl font-bold text-orange-600">
                ₩{(Number(minSettlementAmount) / 10000).toFixed(0)}만
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// User Management
export function UsersAllPage() {
  return <PlaceholderPage title="전체 유저" description="플랫폼 전체 유저를 관리합니다" />;
}

export function UsersReportsPage() {
  return <PlaceholderPage title="신고/제재 목록" description="유저 신고 및 제재 내역을 관리합니다" />;
}

// Product Management
export function ProductCategoriesPage() {
  return <PlaceholderPage title="카테고리 설정" description="상품 카테고리를 관리합니다" />;
}

// Settlement
export function SettlementPayoutPage() {
  return <PlaceholderPage title="셀러 지급 목록" description="셀러 지급 내역을 관리합니다" />;
}

// Moderation
export function ModerationContentPage() {
  return <PlaceholderPage title="부적절 리뷰/게시글" description="신고된 콘텐츠를 검토합니다" />;
}

export function ModerationFakeReportsPage() {
  return <PlaceholderPage title="가품 판정 리포트" description="가품 판정 내역을 관리합니다" />;
}

// System Settings
export function SettingsBannersPage() {
  return <PlaceholderPage title="배너/팝업 관리" description="플랫폼 배너 및 팝업을 관리합니다" />;
}

export function SettingsNoticesPage() {
  return <PlaceholderPage title="공지사항" description="플랫폼 공지사항을 작성하고 관리합니다" />;
}

export function SettingsAdminsPage() {
  return <PlaceholderPage title="어드민 권한 관리" description="관리자 계정 및 권한을 관리합니다" />;
}