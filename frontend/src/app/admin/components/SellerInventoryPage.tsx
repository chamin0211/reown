import { useState } from 'react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Plus, Sparkles, Edit, Eye, TrendingUp } from 'lucide-react';

interface SellerProduct {
  id: string;
  thumbnail: string;
  name: string;
  productType: '일반' | '디자이너 한정판';
  price: string;
  status: '판매중' | '품절' | '심사중' | '반려';
  registeredDate: string;
  views: number;
  likes: number;
}

const mockSellerProducts: SellerProduct[] = [
  {
    id: 'SP-2024-012',
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
    name: '나이키 에어포스 1 화이트',
    productType: '일반',
    price: '₩89,000',
    status: '판매중',
    registeredDate: '2024.03.20',
    views: 1234,
    likes: 45,
  },
  {
    id: 'SP-2024-011',
    thumbnail: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop',
    name: '구찌 GG 마몽 크로스백',
    productType: '디자이너 한정판',
    price: '₩1,240,000',
    status: '심사중',
    registeredDate: '2024.03.18',
    views: 892,
    likes: 67,
  },
  {
    id: 'SP-2024-010',
    thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop',
    name: '아디다스 삼바 OG 블랙',
    productType: '일반',
    price: '₩125,000',
    status: '판매중',
    registeredDate: '2024.03.15',
    views: 2341,
    likes: 89,
  },
  {
    id: 'SP-2024-009',
    thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
    name: '루이비통 네버풀 MM',
    productType: '디자이너 한정판',
    price: '₩1,850,000',
    status: '품절',
    registeredDate: '2024.03.10',
    views: 3456,
    likes: 156,
  },
  {
    id: 'SP-2024-008',
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop',
    name: '뉴발란스 990v6 그레이',
    productType: '일반',
    price: '₩189,000',
    status: '반려',
    registeredDate: '2024.03.08',
    views: 234,
    likes: 12,
  },
  {
    id: 'SP-2024-007',
    thumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
    name: '에르메스 버킨 25 블랙',
    productType: '디자이너 한정판',
    price: '₩8,500,000',
    status: '판매중',
    registeredDate: '2024.03.05',
    views: 5678,
    likes: 234,
  },
];

type FilterStatus = 'all' | '판매중' | '품절' | '심사중' | '반려';

export function SellerInventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockSellerProducts.filter((product) => {
    if (selectedFilter !== 'all' && product.status !== selectedFilter) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '판매중': 'bg-green-100 text-green-700',
      '품절': 'bg-gray-100 text-gray-700',
      '심사중': 'bg-yellow-100 text-yellow-700',
      '반려': 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const stats = {
    total: mockSellerProducts.length,
    active: mockSellerProducts.filter((p) => p.status === '판매중').length,
    pending: mockSellerProducts.filter((p) => p.status === '심사중').length,
    soldOut: mockSellerProducts.filter((p) => p.status === '품절').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">내 상품 관리</h1>
              <p className="text-gray-500">등록한 상품을 관리하고 새 상품을 등록합니다</p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-5 py-3 bg-white border-2 border-[#1e40af] text-[#1e40af] rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={20} />
                일반 상품 등록
              </button>
              <button className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2 shadow-sm">
                <Sparkles size={20} />
                디자이너 한정판 등록
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">전체 상품</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">판매중</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">심사중</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">품절</p>
              <p className="text-3xl font-bold text-gray-600">{stats.soldOut}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Search */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '판매중', '품절', '심사중', '반려'] as FilterStatus[]).map((filter) => (
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
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="상품명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품 ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    썸네일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품 유형
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    판매 상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    찜
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600">{product.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          product.productType === '디자이너 한정판'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {product.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Eye size={14} className="text-gray-500" />
                        {product.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <TrendingUp size={14} className="text-gray-500" />
                        {product.likes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.registeredDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <Link
                          to={`/seller/product/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              총 {filteredProducts.length}개 상품
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