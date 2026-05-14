import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral';
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    icon: <DollarSign size={24} />,
    label: '오늘 매출',
    value: '₩8,340,000',
    change: '+12.5%',
    changeType: 'positive',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: <TrendingUp size={24} />,
    label: '신규 펀딩',
    value: '23건',
    change: '+8.2%',
    changeType: 'positive',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: <Clock size={24} />,
    label: '검수 대기',
    value: '47건',
    change: '+5건',
    changeType: 'neutral',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: <Users size={24} />,
    label: '가입 유저',
    value: '1,284명',
    change: '+34명',
    changeType: 'neutral',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 ${stat.iconBg} rounded-lg ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                stat.changeType === 'positive'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1.5 font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}