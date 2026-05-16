import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, CreditCard, Package, Truck, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { getOrder } from '../api/orderApi';
import type { OrderItemResponse, OrderResponse } from '../api/orderApi';

function getProductImageUrl(item: OrderItemResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) {
    return item.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-product-${item.productId}/600/800`;
}

function formatDate(dateText?: string | null) {
  if (!dateText) return '-';
  return new Date(dateText).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getShippingLabel(status?: string | null) {
  switch (status) {
    case 'READY':
      return '출고 대기';
    case 'PREPARING':
      return '상품 준비중';
    case 'SHIPPED':
      return '배송중';
    case 'DELIVERED':
      return '배송 완료';
    case 'CANCELED':
      return '주문 취소';
    default:
      return '결제 완료';
  }
}

function parseShippingSnapshot(snapshot?: string | null) {
  if (!snapshot) {
    return {
      recipient: 'RE:OWN 회원',
      phone: '-',
      address: '-',
      message: '-',
      raw: '-',
    };
  }

  const parts = snapshot.split('/').map((part) => part.trim()).filter(Boolean);

  return {
    recipient: parts[0] || 'RE:OWN 회원',
    phone: parts[1] || '-',
    address: parts[2] || snapshot,
    message: parts.slice(3).join(' / ') || '-',
    raw: snapshot,
  };
}

function isStepActive(currentStatus: string | null | undefined, step: 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED') {
  const order = ['READY', 'PREPARING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = order.indexOf(currentStatus || 'READY');

  if (step === 'PAID') return true;
  if (step === 'PREPARING') return currentIndex >= 1;
  if (step === 'SHIPPED') return currentIndex >= 2;
  if (step === 'DELIVERED') return currentIndex >= 3;

  return false;
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  const orderId = Number(params.orderId);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!Number.isFinite(orderId)) {
      alert('주문번호가 올바르지 않습니다.');
      navigate('/my/buying');
      return;
    }

    getOrder(orderId)
      .then((data) => {
        if (data.userId !== loginUser.userId && loginUser.role !== 'ADMIN') {
          alert('본인 주문만 확인할 수 있습니다.');
          navigate('/my/buying');
          return;
        }

        setOrder(data);
      })
      .catch((error) => {
        console.error('주문 상세 조회 실패:', error);
        alert('주문 상세를 불러오지 못했습니다.');
        navigate('/my/buying');
      })
      .finally(() => setLoading(false));
  }, [navigate, orderId]);

  const productsTotal = useMemo(() => {
    return order?.items.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  }, [order]);

  const shippingFee = 0;
  const totalAmount = order?.totalPaymentAmount ?? productsTotal + shippingFee;
  const shippingInfo = parseShippingSnapshot(order?.shippingAddressSnapshot);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-28 pb-20">
          <div className="max-w-[1180px] mx-auto px-8 text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">주문 상세를 불러오는 중입니다...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-28 pb-20">
          <div className="max-w-[1180px] mx-auto px-8 text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">주문 정보를 찾을 수 없습니다.</p>
          </div>
        </main>
      </div>
    );
  }

  const steps = [
    { key: 'PAID', title: 'Payment', desc: '결제 완료', icon: CreditCard },
    { key: 'PREPARING', title: 'Preparing', desc: '상품 준비', icon: Package },
    { key: 'SHIPPED', title: 'Shipping', desc: '배송 진행', icon: Truck },
    { key: 'DELIVERED', title: 'Delivered', desc: '배송 완료', icon: CheckCircle2 },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-[1180px] mx-auto px-8">
          <button
            onClick={() => navigate('/my/buying')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            구매내역으로 돌아가기
          </button>

          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-sm text-gray-500 mb-2">{order.orderNo}</p>
              <h1 className="text-4xl font-light tracking-wider text-gray-900">Order Detail</h1>
              <p className="text-gray-500 mt-3">주문일 {formatDate(order.createdAt)}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">배송 상태</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                <Clock className="w-4 h-4" />
                {getShippingLabel(order.shippingStatus)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-10">
            <div className="space-y-8">
              <section className="border border-gray-200 p-8">
                <h2 className="text-xl font-light text-gray-900 mb-6">Order Status</h2>

                <div className="grid grid-cols-4 gap-4">
                  {steps.map((step) => {
                    const active = isStepActive(order.shippingStatus, step.key);
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center p-6"
                        style={{
                          backgroundColor: active ? '#eff6ff' : '#f9fafb',
                          border: active ? '1px solid #93c5fd' : '1px solid #f3f4f6',
                        }}
                      >
                        <Icon className="w-8 h-8 mb-3" style={{ color: active ? '#1d4ed8' : '#9ca3af' }} />
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="border border-gray-200 p-8">
                <h2 className="text-xl font-light text-gray-900 mb-6">Ordered Items</h2>

                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.orderItemId} className="flex gap-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <Link to={`/product/${item.productId}`}>
                        <div className="w-28 h-36 bg-gray-100 overflow-hidden">
                          <img
                            src={getProductImageUrl(item)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="text-lg font-light text-gray-900 mb-2 hover:underline">{item.productName}</h3>
                        </Link>

                        <p className="text-sm text-gray-500 mb-2">
                          {item.color || '-'} / {item.size || '-'} / Qty {item.quantity}
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Payment Verified</span>
                        </div>

                        <p className="text-sm text-gray-500">Unit Price: ₩{item.unitPrice.toLocaleString()}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">₩{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-gray-200 p-8">
                <h2 className="text-xl font-light text-gray-900 mb-6">Shipping Information</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Recipient</span>
                    <span className="text-gray-900 text-right">{shippingInfo.recipient}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900 text-right">{shippingInfo.phone}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Address</span>
                    <span className="text-gray-900 text-right">{shippingInfo.address}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Message</span>
                    <span className="text-gray-900 text-right">{shippingInfo.message}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Tracking</span>
                    <span className="text-gray-900 text-right">{order.trackingNumber || '출고 처리 후 표시됩니다'}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Shipped At</span>
                    <span className="text-gray-900 text-right">{formatDate(order.shippedAt)}</span>
                  </div>

                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Delivered At</span>
                    <span className="text-gray-900 text-right">{formatDate(order.deliveredAt)}</span>
                  </div>
                </div>
              </section>
            </div>

            <aside className="border border-gray-200 p-8 h-fit sticky top-24">
              <h2 className="text-xl font-light text-gray-900 mb-6">Payment Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Products</span>
                  <span className="text-gray-900">₩{productsTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className="text-gray-900">₩{shippingFee.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-xl text-gray-900 font-medium">₩{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (order.trackingNumber) {
                    alert(`송장번호: ${order.trackingNumber}`);
                  } else {
                    alert('출고 처리 후 송장번호가 표시됩니다.');
                  }
                }}
                className="w-full mt-8 py-4 text-sm text-white tracking-widest font-light"
                style={{ backgroundColor: '#1e3a8a' }}
              >
                TRACK ORDER
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
