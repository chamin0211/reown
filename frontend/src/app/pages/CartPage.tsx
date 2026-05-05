import { Trash2, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { deleteCartItem, getCartItems } from '../api/cartApi';
import type { CartItemResponse } from '../api/cartApi';

interface LoginUser {
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

function getCartImageUrl(productId: number) {
  return `https://picsum.photos/seed/reown-product-${productId}/600/800`;
}

export function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('loginUser');

    if (!savedUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const loginUser = JSON.parse(savedUser) as LoginUser;

    getCartItems(loginUser.userId)
        .then((items) => {
          setCartItems(items);
          setSelectedItems(new Set(items.map((item) => item.cartId)));
        })
        .catch((error) => {
          console.error('장바구니 조회 실패:', error);
          alert('장바구니를 불러오지 못했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [navigate]);

  const toggleItemSelection = (cartId: number) => {
    const newSelected = new Set(selectedItems);

    if (newSelected.has(cartId)) {
      newSelected.delete(cartId);
    } else {
      newSelected.add(cartId);
    }

    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.cartId)));
    }
  };

  const updateQuantity = (cartId: number, delta: number) => {
    setCartItems((prevItems) =>
        prevItems.map((item) =>
            item.cartId === cartId
                ? {
                  ...item,
                  quantity: Math.max(1, item.quantity + delta),
                  totalPrice: item.unitPrice * Math.max(1, item.quantity + delta),
                }
                : item
        )
    );
  };

  const removeItem = (cartId: number) => {
    deleteCartItem(cartId)
        .then(() => {
          setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));

          const newSelected = new Set(selectedItems);
          newSelected.delete(cartId);
          setSelectedItems(newSelected);

          alert('장바구니에서 삭제했습니다.');
        })
        .catch((error) => {
          console.error('장바구니 삭제 실패:', error);
          alert('장바구니 삭제에 실패했습니다.');
        });
  };

  const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.cartId));

  const totalPrice = selectedCartItems.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const shippingFee = totalPrice > 0 ? 3000 : 0;
  const estimatedPoints = Math.floor(totalPrice * 0.01);

  return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-28 pb-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-500 font-light">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {loading ? (
                <div className="text-center py-32">
                  <p className="text-gray-500 text-lg font-light">장바구니를 불러오는 중입니다...</p>
                </div>
            ) : cartItems.length > 0 ? (
                <div className="grid grid-cols-10 gap-8">
                  <div className="col-span-7">
                    <div
                        className="flex items-center gap-3 mb-6 pb-4"
                        style={{ borderBottom: '0.5px solid #e5e7eb' }}
                    >
                      <input
                          type="checkbox"
                          checked={cartItems.length > 0 && selectedItems.size === cartItems.length}
                          onChange={toggleSelectAll}
                          className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                          style={{ accentColor: '#1e3a8a' }}
                      />
                      <span className="text-sm font-light text-gray-700">Select All</span>
                    </div>

                    <div className="space-y-6">
                      {cartItems.map((item) => (
                          <div
                              key={item.cartId}
                              className="flex items-center gap-6 pb-6"
                              style={{ borderBottom: '0.5px solid #e5e7eb' }}
                          >
                            <div className="flex-shrink-0">
                              <input
                                  type="checkbox"
                                  checked={selectedItems.has(item.cartId)}
                                  onChange={() => toggleItemSelection(item.cartId)}
                                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                                  style={{ accentColor: '#1e3a8a' }}
                              />
                            </div>

                            <div className="flex-shrink-0 w-32 h-40 bg-gray-50 overflow-hidden">
                              <img
                                  src={getCartImageUrl(item.productId)}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                                RE:OWN
                              </p>

                              <h3 className="text-sm text-gray-900 font-light mb-2 truncate">
                                {item.productName}
                              </h3>

                              <p className="text-xs text-gray-500 mb-3">
                                {item.color} / {item.size}
                              </p>

                              <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>

                                <span className="text-sm text-gray-900 font-light w-8 text-center">
                            {item.quantity}
                          </span>

                                <button
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            <div className="flex-shrink-0 text-right">
                              <p className="text-base text-gray-900 font-light">
                                ₩{(item.unitPrice * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex-shrink-0">
                              <button
                                  onClick={() => removeItem(item.cartId)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="sticky top-28">
                      <div className="bg-gray-50 p-8">
                        <h2 className="text-xl font-light text-gray-900 mb-8 tracking-wide">
                          Order Summary
                        </h2>

                        <div className="space-y-5 mb-8">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-light text-gray-600">Total Price</span>
                            <span className="text-sm text-gray-900 font-light">
                          ₩{totalPrice.toLocaleString()}
                        </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-light text-gray-600">Shipping Fee</span>
                            <span className="text-sm text-gray-900 font-light">
                          {shippingFee === 0 ? 'Free' : `₩${shippingFee.toLocaleString()}`}
                        </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-light text-gray-600">Estimated Points</span>
                            <span className="text-sm text-blue-900 font-light">
                          {estimatedPoints.toLocaleString()}P
                        </span>
                          </div>
                        </div>

                        <div
                            className="flex items-center justify-between py-5 mb-8"
                            style={{
                              borderTop: '0.5px solid #d1d5db',
                              borderBottom: '0.5px solid #d1d5db',
                            }}
                        >
                          <span className="text-base font-medium text-gray-900">Total</span>
                          <span className="text-lg font-medium text-gray-900">
                        ₩{(totalPrice + shippingFee).toLocaleString()}
                      </span>
                        </div>

                        <Link
                            to="/checkout"
                            className={`w-full py-4 text-sm text-white tracking-widest font-light transition-opacity text-center block ${
                                selectedItems.size === 0
                                    ? 'opacity-40 pointer-events-none'
                                    : 'hover:opacity-90'
                            }`}
                            style={{ backgroundColor: '#1e3a8a' }}
                        >
                          CHECKOUT
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="text-center py-32">
                  <p className="text-gray-400 text-xl font-light tracking-wide mb-4">
                    Your cart is empty
                  </p>
                  <Link
                      to="/"
                      className="inline-block px-8 py-3 text-sm text-white tracking-widest font-light"
                      style={{ backgroundColor: '#1e3a8a' }}
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}