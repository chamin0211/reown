import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, CreditCard, Package, Truck } from 'lucide-react';
import { Header } from '../components/Header';
import { getPurchasedOrderItems } from '../api/orderApi';
import type { PurchasedOrderItemResponse } from '../api/orderApi';

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

function getOrderStatusLabel(status: string) {
    switch (status) {
        case 'ORDERED':
            return 'Payment Completed';
        case 'PAID':
            return 'Payment Completed';
        case 'SHIPPING':
            return 'Shipping';
        case 'DELIVERED':
            return 'Delivered';
        case 'CANCELED':
            return 'Canceled';
        default:
            return status || 'Payment Completed';
    }
}

export function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState<PurchasedOrderItemResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('loginUser');

        if (!savedUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const numericOrderId = Number(orderId);

        if (Number.isNaN(numericOrderId)) {
            alert('주문 정보를 찾을 수 없습니다.');
            navigate('/my/buying');
            return;
        }

        const loginUser = JSON.parse(savedUser) as LoginUser;

        getPurchasedOrderItems(loginUser.userId)
            .then((orderItems) => {
                const matchedItems = orderItems.filter((item) => item.orderId === numericOrderId);

                if (matchedItems.length === 0) {
                    alert('주문 상세 정보를 찾을 수 없습니다.');
                    navigate('/my/buying');
                    return;
                }

                setItems(matchedItems);
            })
            .catch((error) => {
                console.error('주문 상세 조회 실패:', error);
                alert('주문 상세 정보를 불러오지 못했습니다.');
                navigate('/my/buying');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [orderId, navigate]);

    const firstItem = items[0];
    const productsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingFee = items.length > 0 ? 3000 : 0;
    const totalAmount = productsTotal + shippingFee;

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center text-gray-500">
                    주문 상세 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    if (!firstItem) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center text-gray-500">
                    주문 정보가 없습니다.
                </div>
            </div>
        );
    }

    const statusLabel = getOrderStatusLabel(firstItem.itemStatus);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-28 pb-20">
                <div className="max-w-[1200px] mx-auto px-8">
                    <Link
                        to="/my/buying"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        구매내역으로 돌아가기
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-3">
                            Order Detail
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Order ID: ORD-{firstItem.orderId}</span>
                            <span style={{ width: '1px', height: '14px', backgroundColor: '#d1d5db' }} />
                            <span>Date: {formatDate(firstItem.orderedAt)}</span>
                            <span style={{ width: '1px', height: '14px', backgroundColor: '#d1d5db' }} />
                            <span>Status: {statusLabel}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_360px] gap-10">
                        <div className="space-y-8">
                            <section className="border border-gray-200 p-8">
                                <h2 className="text-xl font-light text-gray-900 mb-6">
                                    Order Status
                                </h2>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center text-center p-6 bg-blue-50">
                                        <CreditCard className="w-8 h-8 text-blue-900 mb-3" />
                                        <p className="text-sm font-medium text-gray-900">Payment</p>
                                        <p className="text-xs text-gray-500 mt-1">결제 완료</p>
                                    </div>

                                    <div className="flex flex-col items-center text-center p-6 bg-gray-50">
                                        <Package className="w-8 h-8 text-gray-400 mb-3" />
                                        <p className="text-sm font-medium text-gray-900">Preparing</p>
                                        <p className="text-xs text-gray-500 mt-1">상품 준비</p>
                                    </div>

                                    <div className="flex flex-col items-center text-center p-6 bg-gray-50">
                                        <Truck className="w-8 h-8 text-gray-400 mb-3" />
                                        <p className="text-sm font-medium text-gray-900">Shipping</p>
                                        <p className="text-xs text-gray-500 mt-1">배송 진행</p>
                                    </div>
                                </div>
                            </section>

                            <section className="border border-gray-200 p-8">
                                <h2 className="text-xl font-light text-gray-900 mb-6">
                                    Ordered Items
                                </h2>

                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div
                                            key={item.orderItemId}
                                            className="flex gap-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                                        >
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
                                                    <h3 className="text-lg font-light text-gray-900 mb-2 hover:underline">
                                                        {item.productName}
                                                    </h3>
                                                </Link>

                                                <p className="text-sm text-gray-500 mb-2">
                                                    {item.color} / {item.size} / Qty {item.quantity}
                                                </p>

                                                <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 mb-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-green-600">
                            Payment Verified
                          </span>
                                                </div>

                                                <p className="text-sm text-gray-500">
                                                    Unit Price: ₩{item.unitPrice.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-medium text-gray-900">
                                                    ₩{item.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="border border-gray-200 p-8">
                                <h2 className="text-xl font-light text-gray-900 mb-6">
                                    Shipping Information
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Recipient</span>
                                        <span className="text-gray-900">RE:OWN 회원</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Address</span>
                                        <span className="text-gray-900">배송지 정보는 추후 연결 예정</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tracking</span>
                                        <span className="text-gray-900">관리자 배송 처리 후 표시됩니다</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="border border-gray-200 p-8 h-fit sticky top-24">
                            <h2 className="text-xl font-light text-gray-900 mb-6">
                                Payment Summary
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Products</span>
                                    <span className="text-gray-900">
                    ₩{productsTotal.toLocaleString()}
                  </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping Fee</span>
                                    <span className="text-gray-900">
                    ₩{shippingFee.toLocaleString()}
                  </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-xl text-gray-900 font-medium">
                    ₩{totalAmount.toLocaleString()}
                  </span>
                                </div>
                            </div>

                            <button
                                onClick={() => alert('배송 조회는 관리자 배송 처리 후 연결됩니다.')}
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