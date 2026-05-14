import { DollarSign, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export function SuperAdminStatsCards() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {/* Card 1: Total Platform Revenue */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
            +12.5%
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">누적 플랫폼 수익</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">₩24.8억</p>
        <p className="text-xs text-gray-500">수수료 수입: ₩2.48억</p>
      </div>

      {/* Card 2: Active Fundings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            진행중
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">활성 펀딩 총 수</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">23</p>
        <p className="text-xs text-gray-500">평균 달성률: 87.3%</p>
      </div>

      {/* Card 3: Pending Seller Applications */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users size={24} className="text-purple-600" />
          </div>
          <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
            긴급
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">입점 대기 브랜드</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
        <p className="text-xs text-gray-500">즉시 검토 필요: 3건</p>
      </div>

      {/* Card 4: Flagged Content */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
            주의
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">신고된 콘텐츠</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
        <p className="text-xs text-gray-500">대기 중인 모더레이션</p>
      </div>
    </div>
  );
}
