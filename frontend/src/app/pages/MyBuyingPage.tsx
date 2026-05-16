import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { CheckCircle2, Clock, Package, Truck } from 'lucide-react';
import { getPurchasedOrderItems } from '../api/orderApi';
import type { PurchasedOrderItemResponse } from '../api/orderApi';

type OrderStatus = 'all' | 'payment' | 'preparing' | 'shipping' | 'delivered';

function getProductImageUrl(item: PurchasedOrderItemResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) {
    return item.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-product-${item.productId}/600/800`;
}

function formatDate(dateText?: string | null) {
  if (!dateText) return '-';
  return dateText.slice(0, 10);
}

function normalizeShippingStatus(status?: string | null): OrderStatus {
  switch (status) {
    case 'PREPARING':
      return 'preparing';
    case 'SHIPPED':
      return 'shipping';
    case 'DELIVERED':
      return 'delivered';
    case 'READY':
    case 'NOT_STARTED':
    default:
      return 'payment';
  }
}

function getStatusLabel(item: PurchasedOrderItemResponse) {
  switch (item.shippingStatus) {
    case 'READY':
      return '결제 완료 / 출고 대기';
    case 'PREPARING':
      return '상품 준비중';
    case 'SHIPPED':
      return '배송중';
    case 'DELIVERED':
      return '배송 완료';
    case 'CANCELED':
      return '주문 취소';
    default:
      return item.orderStatus === 'PAID' ? '결제 완료' : item.orderStatus;
  }
}

function getStatusStyle(item: PurchasedOrderItemResponse) {
  switch (item.shippingStatus) {
    case 'DELIVERED':
      return { backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#16a34a' };
    case 'SHIPPED':
      return { backgroundColor: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' };
    case 'PREPARING':
      return { backgroundColor: '#faf5ff', borderColor: '#d8b4fe', color: '#7e22ce' };
    default:
      return { backgroundColor: '#fff7ed', borderColor: '#fdba74', color: '#c2410c' };
  }
}

export function MyBuyingPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<PurchasedOrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    getPurchasedOrderItems(loginUser.userId)
      .then((items) => {
        setOrders(items.filter((item) => item.orderStatus !== 'CANCELED' && item.itemStatus !== 'CANCELED'));
      })
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
    { value: 'preparing' as OrderStatus, label: 'Preparing' },
    { value: 'shipping' as OrderStatus, label: 'Shipping' },
    { value: 'delivered' as OrderStatus, label: 'Delivered' },
  ];

  const filteredOrders = useMemo(
    () => orders.filter((order) => activeTab === 'all' || normalizeShippingStatus(order.shippingStatus) === activeTab),
    [activeTab, orders]
  );

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.all += 1;
        acc[normalizeShippingStatus(order.shippingStatus)] += 1;
        return acc;
      },
      { all: 0, payment: 0, preparing: 0, shipping: 0, delivered: 0 } as Record<OrderStatus, number>
    );
  }, [orders]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h1 className="text-4xl font-light tracking-wider mb-3" style={{ color: '#101828' }}>
                Buying History
              </h1>
              <p className="text-gray-500 font-light">DB에 저장된 내 주문과 배송 상태를 확인하세요</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-3 text-sm border border-gray-200 hover:bg-gray-50"
            >
              새로고침
            </button>
          </div>

          <div className="mb-10 grid grid-cols-5 gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="p-4 text-left transition-colors"
                style={{
                  border: activeTab === tab.value ? '1px solid #101828' : '1px solid #e5e7eb',
                  backgroundColor: activeTab === tab.value ? '#101828' : '#fff',
                  color: activeTab === tab.value ? '#fff' : '#101828',
                }}
              >
                <p className="text-xs opacity-70 mb-2">{tab.label}</p>
                <p className="text-2xl font-light">{counts[tab.value]}건</p>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                구매내역을 불러오는 중입니다...
              </h3>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 border border-gray-200">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                No orders found
              </h3>
              <p className="text-gray-500 font-light">아직 표시할 구매 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusStyle = getStatusStyle(order);

                return (
                  <div key={order.orderItemId} className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
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

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-light text-gray-600 mb-4">
                            <div>
                              <span className="text-xs text-gray-500">Order No:</span>{' '}
                              <span style={{ color: '#101828' }}>{order.orderNo || `ORD-${order.orderId}`}</span>
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
                                {order.color || '-'} / {order.size || '-'} / Qty {order.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div
                              className="inline-flex items-center gap-2 px-4 py-2"
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

                            <div
                              className="inline-flex items-center gap-2 px-4 py-2"
                              style={{
                                backgroundColor: statusStyle.backgroundColor,
                                border: `0.5px solid ${statusStyle.borderColor}`,
                              }}
                            >
                              {order.shippingStatus === 'SHIPPED' ? (
                                <Truck className="w-4 h-4" style={{ color: statusStyle.color }} />
                              ) : (
                                <Clock className="w-4 h-4" style={{ color: statusStyle.color }} />
                              )}
                              <span className="text-sm font-light" style={{ color: statusStyle.color }}>
                                {getStatusLabel(order)}
                              </span>
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <div className="text-sm font-light text-gray-600">
                              <span className="text-gray-500">Tracking:</span>{' '}
                              <span style={{ color: '#101828' }}>{order.trackingNumber}</span>
                            </div>
                          )}
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
                          onClick={() => navigate(`/orders/${order.orderId}`)}
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
