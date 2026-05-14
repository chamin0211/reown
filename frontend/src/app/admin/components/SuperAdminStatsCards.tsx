import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { getAdminProducts } from '../../api/adminProductApi';
import type { ProductListResponse } from '../../api/adminProductApi';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export function SuperAdminStatsCards() {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error('관리자 대시보드 상품 현황 조회 실패:', error);
      setErrorMessage(error instanceof Error ? error.message : '상품 현황을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const summary = useMemo(() => {
    return {
      total: products.length,
      waiting: products.filter((product) => product.status === 'WAITING').length,
      onSale: products.filter((product) => product.status === 'ON_SALE').length,
      rejected: products.filter((product) => product.status === 'REJECTED').length,
    };
  }, [products]);

  const stats: StatCard[] = [
    {
      icon: <Package size={24} />,
      label: '전체 상품',
      value: `${summary.total}개`,
      description: 'DELETED 제외, DB 기준',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Clock size={24} />,
      label: '검수 대기',
      value: `${summary.waiting}개`,
      description: '관리자 승인 필요',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <CheckCircle size={24} />,
      label: '판매중',
      value: `${summary.onSale}개`,
      description: '사용자 화면 노출',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <AlertTriangle size={24} />,
      label: '반려',
      value: `${summary.rejected}개`,
      description: '셀러 수정 필요',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="mb-8">
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.iconBg} rounded-lg ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                DB
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1.5 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
