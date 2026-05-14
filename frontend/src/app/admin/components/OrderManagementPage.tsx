import { useState } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Download, Filter as FilterIcon } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  productThumbnail: string;
  buyer: string;
  paymentAmount: string;
  deliveryStatus: '결제완료' | '배송준비' | '배송중' | '배송완료';
  orderDate: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001234',
    productName: '나이키 에어포스 1 화이트',
    productThumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
    buyer: '홍길동',
    paymentAmount: '₩89,000',
    deliveryStatus: '결제완료',
    orderDate: '2024.03.27 14:32',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-001233',
    productName: '구찌 GG 마몽 크로스백',
    productThumbnail: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop',
    buyer: '김영희',
    paymentAmount: '₩1,240,000',
    deliveryStatus: '배송준비',
    orderDate: '2024.03.27 13:15',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-001232',
    productName: '아디다스 삼바 OG 블랙',
    productThumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop',
    buyer: '이철수',
    paymentAmount: '₩125,000',
    deliveryStatus: '배송중',
    orderDate: '2024.03.27 11:28',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-001231',
    productName: '루이비통 네버풀 MM',
    productThumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
    buyer: '박민수',
    paymentAmount: '₩1,850,000',
    deliveryStatus: '배송완료',
    orderDate: '2024.03.26 18:20',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-001230',
    productName: '뉴발란스 990v6 그레이',
    productThumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop',
    buyer: '최영수',
    paymentAmount: '₩189,000',
    deliveryStatus: '결제완료',
    orderDate: '2024.03.26 16:55',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-001229',
    productName: '에르메스 버킨 25 블랙',
    productThumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
    buyer: '정미희',
    paymentAmount: '₩8,500,000',
    deliveryStatus: '배송준비',
    orderDate: '2024.03.26 15:10',
  },
];

type FilterStatus = 'all' | '결제완료' | '배송준비' | '배송중' | '배송완료';

export function OrderManagementPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>('');

  const filteredOrders = mockOrders.filter((order) => {
    if (selectedFilter !== 'all' && order.deliveryStatus !== selectedFilter) return false;
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.productName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      '결제완료': 'bg-blue-100 text-blue-700',
      '배송준비': 'bg-yellow-100 text-yellow-700',
      '배송중': 'bg-purple-100 text-purple-700',
      '배송완료': 'bg-green-100 text-green-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(filteredOrders.map((order) => order.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedOrders(newSelected);
  };

  const handleBulkStatusChange = () => {
    if (selectedOrders.size === 0) {
      alert('변경할 주문을 선택해주세요.');
      return;
    }
    if (!bulkStatus) {
      alert('변경할 배송 상태를 선택해주세요.');
      return;
    }
    if (confirm(`선택한 ${selectedOrders.size}건의 주문 상태를 '${bulkStatus}'로 변경하시겠습니까?`)) {
      alert(`${selectedOrders.size}건의 주문 상태가 '${bulkStatus}'로 변경되었습니다.`);
      setSelectedOrders(new Set());
      setBulkStatus('');
    }
  };

  const stats = {
    total: mockOrders.length,
    paymentComplete: mockOrders.filter((o) => o.deliveryStatus === '결제완료').length,
    preparing: mockOrders.filter((o) => o.deliveryStatus === '배송준비').length,
    shipping: mockOrders.filter((o) => o.deliveryStatus === '배송중').length,
    delivered: mockOrders.filter((o) => o.deliveryStatus === '배송완료').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1.5">주문/배송 관리</h1>
              <p className="text-gray-500">주문 현황을 확인하고 배송 상태를 관리합니다</p>
            </div>
            
            <button className="px-5 py-3 bg-[#1e40af] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Download size={20} />
              엑셀 다운로드
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">전체 주문</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">결제완료</p>
              <p className="text-3xl font-bold text-blue-600">{stats.paymentComplete}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">배송준비</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.preparing}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">배송중</p>
              <p className="text-3xl font-bold text-purple-600">{stats.shipping}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">배송완료</p>
              <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Filter and Actions */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['all', '결제완료', '배송준비', '배송중', '배송완료'] as FilterStatus[]).map((filter) => (
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
                    placeholder="주문번호, 상품명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <button className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <FilterIcon size={18} />
                  필터
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.size > 0 && (
              <div className="px-6 pb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-900">
                    {selectedOrders.size}개 주문이 선택되었습니다
                  </p>
                  <div className="flex items-center gap-3">
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">배송 상태 선택</option>
                      <option value="배송준비">배송준비</option>
                      <option value="배송중">배송중</option>
                      <option value="배송완료">배송완료</option>
                    </select>
                    <button
                      onClick={handleBulkStatusChange}
                      className="px-4 py-2 bg-[#1e40af] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                      일괄 변경
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    주문번호
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상품
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    구매자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    결제금액
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    배송상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    주문일시
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.productThumbnail}
                          alt={order.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <span className="text-sm font-medium text-gray-900">{order.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {order.buyer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {order.paymentAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          order.deliveryStatus
                        )}`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.orderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              {selectedOrders.size > 0 ? `${selectedOrders.size}개 선택됨 / ` : ''}
              총 {filteredOrders.length}개 주문
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