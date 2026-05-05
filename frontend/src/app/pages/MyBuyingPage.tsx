import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { CheckCircle2, Package } from 'lucide-react';
import { getPurchasedOrderItems } from '../api/orderApi';
import type { PurchasedOrderItemResponse } from '../api/orderApi';

type OrderStatus = 'all' | 'payment' | 'inspection' | 'shipping' | 'delivered';

interface LoginUser {
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

function getProductImageUrl(item: PurchasedOrderItemResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) {
    return item.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-product-${item.productId}/600/800`;
}

function formatDate(dateText: string) {
  return dateText ? dateText.slice(0, 10) : '-';
}

export function MyBuyingPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<PurchasedOrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('loginUser');

    if (!savedUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const loginUser = JSON.parse(savedUser) as LoginUser;

    getPurchasedOrderItems(loginUser.userId)
        .then(setOrders)
        .catch((error) => {
          console.error('구매내역 조회 실패:', error);
          alert('구매내역을 불러오지 못했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [navigate]);

  const tabs = [
    { value: 'all' as OrderStatus, label: 'All' },
    { value: 'payment' as OrderStatus, label: 'Payment' },
    { value: 'inspection' as OrderStatus, label: 'Inspection' },
    { value: 'shipping' as OrderStatus, label: 'Shipping' },
    { value: 'delivered' as OrderStatus, label: 'Delivered' },
  ];

  // 현재 백엔드는 결제 완료 후 itemStatus가 ORDERED로 남아 있어서,
  // 구매내역 화면에서는 payment 단계로 보여준다.
  const getFrontStatus = (_item: PurchasedOrderItemResponse): OrderStatus => {
    return 'payment';
  };

  const filteredOrders = orders.filter((order) =>
      activeTab === 'all' ? true : getFrontStatus(order) === activeTab
  );

  const getStatusLabel = (status: OrderStatus) => {
    const statusMap = {
      all: 'All',
      payment: 'Payment Completed',
      inspection: 'Under Inspection',
      shipping: 'In Transit',
      delivered: 'Delivered',
    };

    return statusMap[status] || status;
  };

  return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-24 pb-20">
          <div className="max-w-[1200px] mx-auto px-12">
            <h1 className="text-4xl font-light tracking-wider mb-12" style={{ color: '#101828' }}>
              Buying History
            </h1>

            <div className="mb-12">
              <div className="flex gap-2" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className="px-6 pb-4 text-sm font-light tracking-wide transition-colors relative"
                        style={{
                          color: activeTab === tab.value ? '#101828' : '#9ca3af',
                        }}
                    >
                      {tab.label}
                      {activeTab === tab.value && (
                          <div
                              className="absolute bottom-0 left-0 right-0"
                              style={{ height: '2px', backgroundColor: '#101828' }}
                          />
                      )}
                    </button>
                ))}
              </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                    구매내역을 불러오는 중입니다...
                  </h3>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                    No orders found
                  </h3>
                  <p className="text-gray-500 font-light">
                    You haven't made any purchases yet
                  </p>
                </div>
            ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const frontStatus = getFrontStatus(order);

                    return (
                        <div
                            key={order.orderItemId}
                            className="p-8"
                            style={{ border: '0.5px solid #e5e7eb' }}
                        >
                          <div className="flex gap-8">
                            <div className="flex-shrink-0 w-32 h-40 bg-gray-50 overflow-hidden">
                              <img
                                  src={getProductImageUrl(order)}
                                  alt={order.productName}
                                  className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                                  RE:OWN
                                </p>

                                <h3 className="text-lg font-light mb-3 truncate" style={{ color: '#101828' }}>
                                  {order.productName}
                                </h3>

                                <div className="flex items-center gap-6 text-sm font-light text-gray-600 mb-4">
                                  <div>
                                    <span className="text-xs text-gray-500">Order ID:</span>{' '}
                                    <span style={{ color: '#101828' }}>ORD-{order.orderId}</span>
                                  </div>

                                  <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />

                                  <div>
                                    <span className="text-xs text-gray-500">Date:</span>{' '}
                                    <span style={{ color: '#101828' }}>{formatDate(order.orderedAt)}</span>
                                  </div>

                                  <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />

                                  <div>
                                    <span className="text-xs text-gray-500">Option:</span>{' '}
                                    <span style={{ color: '#101828' }}>
                                {order.color} / {order.size} / Qty {order.quantity}
                              </span>
                                  </div>
                                </div>

                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-4"
                                    style={{
                                      backgroundColor: '#f0fdf4',
                                      border: '0.5px solid #86efac',
                                    }}
                                >
                                  <CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} />
                                  <span className="text-sm font-light" style={{ color: '#16a34a' }}>
                              Payment Verified
                            </span>
                                </div>

                                <div className="text-sm font-light">
                                  <span className="text-gray-500">Status:</span>{' '}
                                  <span style={{ color: '#101828' }}>{getStatusLabel(frontStatus)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-end justify-between">
                              <div className="text-right">
                                <p className="text-xl font-light" style={{ color: '#101828' }}>
                                  ₩{order.totalPrice.toLocaleString()}
                                </p>
                              </div>

                              <button
                                  className="px-6 py-3 text-sm font-light tracking-wide transition-all hover:opacity-80"
                                  style={{ border: '0.5px solid #101828', color: '#101828' }}
                                  onClick={() => alert('배송 조회는 관리자 배송 처리 후 연결됩니다.')}
                              >
                                Order Detail
                              </button>
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}