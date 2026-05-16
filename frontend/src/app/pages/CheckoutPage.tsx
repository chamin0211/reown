import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { getCartItems } from '../api/cartApi';
import type { CartItemResponse } from '../api/cartApi';
import { createOrder, mockPayment } from '../api/orderApi';


function getCartImageUrl(productId: number) {
  return `https://picsum.photos/seed/reown-product-${productId}/600/800`;
}

export function CheckoutPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    detailedAddress: '',
    phone: '',
    message: 'doorbell',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'simple' | 'transfer'>('card');
  const [pointsToUse, setPointsToUse] = useState(0);

  useEffect(() => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    getCartItems(loginUser.userId)
        .then((items) => {
          if (items.length === 0) {
            alert('장바구니가 비어 있습니다.');
            navigate('/cart');
            return;
          }

          setCartItems(items);
        })
        .catch((error) => {
          console.error('주문 상품 조회 실패:', error);
          alert('주문 상품을 불러오지 못했습니다.');
          navigate('/cart');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [navigate]);

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // 현재 백엔드 주문 금액은 상품 금액 기준이라, 결제 시연에서는 배송비를 0원 처리
  const shippingFee = 0;

  const availablePoints = 5000;
  const finalTotal = Math.max(itemsTotal + shippingFee - pointsToUse, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setPointsToUse(Math.min(value, availablePoints, itemsTotal));
  };

  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'card') return 'MOCK_CARD';
    if (paymentMethod === 'simple') return 'MOCK_SIMPLE_PAY';
    return 'MOCK_BANK_TRANSFER';
  };

  const validateShipping = () => {
    if (!shippingData.name.trim()) {
      alert('수령인 이름을 입력해주세요.');
      return false;
    }

    if (!shippingData.address.trim()) {
      alert('주소를 입력해주세요.');
      return false;
    }

    if (!shippingData.detailedAddress.trim()) {
      alert('상세 주소를 입력해주세요.');
      return false;
    }

    if (!shippingData.phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handlePayment = () => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!validateShipping()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('주문할 상품이 없습니다.');
      navigate('/cart');
      return;
    }

    const shippingAddressSnapshot = JSON.stringify({
      recipientName: shippingData.name,
      address: shippingData.address,
      detailedAddress: shippingData.detailedAddress,
      phone: shippingData.phone,
      message: shippingData.message,
    });

    setPaying(true);

    createOrder({
      userId: loginUser.userId,
      shippingAddressSnapshot,
    })
        .then((order) => {
          return mockPayment({
            orderId: order.orderId,
            paymentMethod: getPaymentMethodLabel(),
          });
        })
        .then((payment) => {
          alert(`결제가 완료되었습니다.\n결제번호: ${payment.pgTid}`);
          navigate('/my/buying');
        })
        .catch((error) => {
          console.error('주문/결제 실패:', error);
          alert('주문 또는 결제 처리에 실패했습니다.');
        })
        .finally(() => {
          setPaying(false);
        });
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-white">
          <Header />
          <div className="pt-32 text-center text-gray-500">주문 정보를 불러오는 중입니다...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-24 pb-20">
          <div className="max-w-[1400px] mx-auto px-12">
            <h1 className="text-4xl font-light tracking-wider mb-16" style={{ color: '#101828' }}>
              Checkout
            </h1>

            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-7 space-y-12">
                <div>
                  <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                    Shipping Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Recipient Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          value={shippingData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          placeholder="Enter recipient name"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Address
                      </label>
                      <div className="flex gap-3">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingData.address}
                            onChange={handleInputChange}
                            className="flex-1 px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                            style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                            placeholder="Enter address"
                        />
                        <button
                            type="button"
                            onClick={() => alert('주소 검색은 시연용으로 직접 입력 방식입니다.')}
                            className="px-6 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                            style={{ border: '0.5px solid #101828', color: '#101828', height: '52px' }}
                        >
                          Search
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                          htmlFor="detailedAddress"
                          className="block text-sm font-light mb-2"
                          style={{ color: '#101828' }}
                      >
                        Detailed Address
                      </label>
                      <input
                          type="text"
                          id="detailedAddress"
                          name="detailedAddress"
                          value={shippingData.detailedAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          placeholder="Enter detailed address"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Phone Number
                      </label>
                      <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          placeholder="010-0000-0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Shipping Message
                      </label>
                      <select
                          id="message"
                          name="message"
                          value={shippingData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                      >
                        <option value="doorbell">Please ring the doorbell upon delivery</option>
                        <option value="door">Leave at the door</option>
                        <option value="security">Leave with security</option>
                        <option value="call">Please call before delivery</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                    Order Items
                  </h2>

                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                        <div key={item.cartId}>
                          <div className="flex gap-6">
                            <div className="flex-shrink-0 w-28 h-36 bg-gray-50 overflow-hidden">
                              <img
                                  src={getCartImageUrl(item.productId)}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1">
                                  RE:OWN
                                </p>
                                <h3 className="text-base font-light mb-2" style={{ color: '#101828' }}>
                                  {item.productName}
                                </h3>
                                <p className="text-sm text-gray-600 font-light">
                                  {item.color} / {item.size}
                                </p>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-light">Qty: {item.quantity}</span>
                                <p className="text-base font-light" style={{ color: '#101828' }}>
                                  ₩{(item.unitPrice * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {index < cartItems.length - 1 && (
                              <div className="mt-6" style={{ borderBottom: '0.5px solid #e5e7eb' }} />
                          )}
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className="p-6 text-center transition-all"
                        style={{
                          border: paymentMethod === 'card' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                          backgroundColor: paymentMethod === 'card' ? '#f9fafb' : 'transparent',
                        }}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                      <p className="text-sm font-light" style={{ color: '#101828' }}>
                        Credit/Debit Card
                      </p>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('simple')}
                        className="p-6 text-center transition-all"
                        style={{
                          border: paymentMethod === 'simple' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                          backgroundColor: paymentMethod === 'simple' ? '#f9fafb' : 'transparent',
                        }}
                    >
                      <Smartphone className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                      <p className="text-sm font-light" style={{ color: '#101828' }}>
                        Simple Pay
                      </p>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('transfer')}
                        className="p-6 text-center transition-all"
                        style={{
                          border: paymentMethod === 'transfer' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                          backgroundColor: paymentMethod === 'transfer' ? '#f9fafb' : 'transparent',
                        }}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                      <p className="text-sm font-light" style={{ color: '#101828' }}>
                        Bank Transfer
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-5">
                <div className="sticky top-24">
                  <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
                    <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                      Order Summary
                    </h2>

                    <div className="space-y-5 mb-8">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-gray-600">Items Price</span>
                        <span className="text-sm font-light" style={{ color: '#101828' }}>
                        ₩{itemsTotal.toLocaleString()}
                      </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-gray-600">Shipping Fee</span>
                        <span className="text-sm font-light" style={{ color: '#101828' }}>
                        Free
                      </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-light text-gray-600">Point Usage</span>
                          <span className="text-xs font-light text-gray-500">
                          Available: {availablePoints.toLocaleString()}P
                        </span>
                        </div>

                        <div className="flex gap-2">
                          <input
                              type="number"
                              value={pointsToUse || ''}
                              onChange={handlePointsChange}
                              className="flex-1 px-3 text-sm text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                              style={{ border: '0.5px solid #d1d5db', height: '44px' }}
                              placeholder="Enter points"
                              min="0"
                              max={availablePoints}
                          />
                          <button
                              onClick={() => setPointsToUse(Math.min(availablePoints, itemsTotal))}
                              className="px-4 text-xs font-light tracking-wide transition-opacity hover:opacity-80"
                              style={{ border: '0.5px solid #101828', color: '#101828' }}
                          >
                            Use All
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                        className="flex items-center justify-between py-6 mb-8"
                        style={{
                          borderTop: '0.5px solid #e5e7eb',
                          borderBottom: '0.5px solid #e5e7eb',
                        }}
                    >
                    <span className="text-base font-medium" style={{ color: '#101828' }}>
                      Total Amount
                    </span>
                      <span className="text-2xl font-medium" style={{ color: '#101828' }}>
                      ₩{finalTotal.toLocaleString()}
                    </span>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className="w-full text-sm text-white font-medium tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#101828', height: '64px' }}
                    >
                      {paying ? 'PROCESSING...' : `PAY ₩${finalTotal.toLocaleString()} NOW`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}