import { CheckCircle, Clock, Package, XCircle } from 'lucide-react';

const stats = [
  {
    icon: <Package size={24} />,
    label: '전체 상품',
    value: '0개',
    note: '상품 관리 페이지에서 DB 기준으로 확인',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: <Clock size={24} />,
    label: '승인 대기',
    value: '0개',
    note: '더미 데이터 제거 완료',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: <CheckCircle size={24} />,
    label: '판매중',
    value: '0개',
    note: 'DB 연동 화면 사용',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: <XCircle size={24} />,
    label: '반려',
    value: '0개',
    note: 'DB 연동 화면 사용',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 ${stat.iconBg} rounded-lg ${stat.iconColor}`}>{stat.icon}</div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Mock removed</span>
          </div>
          <p className="text-sm text-gray-600 mb-1.5 font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-2">{stat.note}</p>
        </div>
      ))}
    </div>
  );
}
