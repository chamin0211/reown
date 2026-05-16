import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import {
  getSellerResells,
  getSellerResellTransactions,
  prepareResellShipment,
  settleResellTransaction,
  shipResellTransaction,
} from '../api/resellApi';
import type { ResellResponse, ResellTransactionDetailResponse } from '../api/resellApi';
import { Package, ShieldCheck, Truck } from 'lucide-react';

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function getImageUrl(item: { thumbnailUrl: string | null; productId: number }) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-selling-${item.productId}/300/400`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'WAITING': return '검수 대기';
    case 'ON_SALE': return '입찰 진행중';
    case 'SOLD': return '거래 생성';
    case 'REJECTED': return '반려';
    case 'CANCELED': return '취소';
    case 'EXPIRED': return '마감';
    default: return status;
  }
}

function getTransactionStatusLabel(status: string) {
  switch (status) {
    case 'PAYMENT_WAITING': return '결제 대기';
    case 'PAID': return '결제 완료';
    case 'PREPARING_SHIPMENT': return '배송 준비 중';
    case 'SHIPPING': return '배송 중';
    case 'PURCHASE_CONFIRMED': return '구매 확정';
    case 'SETTLED': return '정산 완료';
    case 'CANCELED': return '거래 취소';
    case 'COMPLETED': return '거래 완료';
    default: return status;
  }
}

function getTransactionStatusStyle(status: string) {
  switch (status) {
    case 'PAYMENT_WAITING': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'PAID': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PREPARING_SHIPMENT': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'SHIPPING': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'PURCHASE_CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
    case 'SETTLED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CANCELED': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function MySellingPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ResellResponse[]>([]);
  const [transactions, setTransactions] = useState<ResellTransactionDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const load = async () => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const [resells, tx] = await Promise.all([
        getSellerResells(loginUser.userId),
        getSellerResellTransactions(loginUser.userId),
      ]);
      setItems(resells);
      setTransactions(tx);
    } catch (error) {
      console.error('판매 리셀 조회 실패:', error);
      alert('판매 리셀 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [navigate]);

  const handlePrepare = async (tx: ResellTransactionDetailResponse) => {
    const loginUser = getLoginUser();
    if (!loginUser) return;
    if (!confirm('배송 준비 상태로 변경할까요?')) return;
    setProcessingId(tx.transactionId);
    try {
      await prepareResellShipment(tx.transactionId, loginUser.userId);
      await load();
    } catch (error) {
      console.error('배송 준비 처리 실패:', error);
      alert(error instanceof Error ? error.message : '배송 준비 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleShip = async (tx: ResellTransactionDetailResponse) => {
    const loginUser = getLoginUser();
    if (!loginUser) return;
    const courierName = prompt('택배사를 입력하세요.', tx.courierName || 'CJ대한통운') || '';
    const trackingNumber = prompt('송장번호를 입력하세요.', tx.trackingNumber || '') || '';
    setProcessingId(tx.transactionId);
    try {
      await shipResellTransaction(tx.transactionId, { sellerId: loginUser.userId, courierName, trackingNumber });
      await load();
    } catch (error) {
      console.error('배송 중 처리 실패:', error);
      alert(error instanceof Error ? error.message : '배송 중 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSettle = async (tx: ResellTransactionDetailResponse) => {
    const loginUser = getLoginUser();
    if (!loginUser) return;
    if (!confirm('정산 완료 처리할까요?')) return;
    setProcessingId(tx.transactionId);
    try {
      await settleResellTransaction(tx.transactionId, loginUser.userId);
      await load();
    } catch (error) {
      console.error('정산 완료 처리 실패:', error);
      alert(error instanceof Error ? error.message : '정산 완료 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const soldCount = useMemo(() => items.filter((i) => i.status === 'SOLD').length, [items]);
  const settlementWaitingCount = useMemo(() => transactions.filter((tx) => tx.status === 'PURCHASE_CONFIRMED').length, [transactions]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">MY ARCHIVE SALES</p>
            <h1 className="text-4xl font-semibold mb-3" style={{ color: '#101828' }}>프리미엄 리셀 판매 내역</h1>
            <p className="text-gray-500">입찰형 프리미엄 리셀의 판매 상태, 배송 상태, 정산 상태를 관리합니다.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-gray-100 p-5"><p className="text-sm text-gray-500 mb-2">등록 상품</p><p className="text-3xl font-bold">{items.length}건</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm text-blue-700 mb-2">입찰 진행</p><p className="text-3xl font-bold text-blue-900">{items.filter((i) => i.status === 'ON_SALE').length}건</p></div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5"><p className="text-sm text-green-700 mb-2">정산 대기</p><p className="text-3xl font-bold text-green-900">{settlementWaitingCount}건</p></div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">판매 내역을 불러오는 중입니다...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border border-gray-200 rounded-2xl">
              <Package className="w-14 h-14 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">등록된 프리미엄 리셀 판매 내역이 없습니다</h2>
              <p className="text-gray-500">일반 구매 상품 리셀 등록은 MVP에서 제외했고, 관리자 검수 기반 입찰형 구조로 운영됩니다.</p>
            </div>
          ) : (
            <>
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">등록 상품 상태</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Link to={`/resell/${item.resellId}`} key={item.resellId} className="block rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
                      <div className="flex gap-5">
                        <img src={getImageUrl(item)} alt={item.productName} className="w-24 h-28 object-cover rounded-xl bg-gray-100" />
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold"><ShieldCheck className="w-3 h-3" /> {item.rarityGrade || 'ARCHIVE'}</span><span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold">{getStatusLabel(item.status)}</span></div>
                          <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                          <p className="text-sm text-gray-500 mb-3">{item.color || '-'} / {item.size || '-'}</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div><p className="text-gray-500">시작가</p><p className="font-bold">{formatPrice(item.startPrice)}</p></div>
                            <div><p className="text-gray-500">현재 최고가</p><p className="font-bold text-blue-800">{formatPrice(item.currentHighestBid || item.startPrice)}</p></div>
                            <div><p className="text-gray-500">즉시 구매가</p><p className="font-bold">{formatPrice(item.instantBuyPrice)}</p></div>
                            <div><p className="text-gray-500">입찰 수</p><p className="font-bold">{item.bidCount ?? 0}건</p></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">거래/배송/정산 관리</h2>
                  <span className="text-sm text-gray-500">거래 생성 {soldCount}건 · 거래내역 {transactions.length}건</span>
                </div>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 border border-gray-200 rounded-2xl text-gray-500">아직 생성된 리셀 거래가 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.transactionId} className="rounded-2xl border border-gray-200 p-5">
                        <div className="flex gap-5">
                          <Link to={`/resell/${tx.resellId}`}>
                            <img src={getImageUrl(tx)} alt={tx.productName} className="w-24 h-28 object-cover rounded-xl bg-gray-100" />
                          </Link>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getTransactionStatusStyle(tx.status)}`}>{getTransactionStatusLabel(tx.status)}</span>
                              {tx.rarityGrade && <span className="text-xs text-purple-700 font-semibold">{tx.rarityGrade}</span>}
                            </div>
                            <Link to={`/resell/${tx.resellId}`} className="font-semibold text-gray-900 mb-1 inline-block hover:underline">{tx.productName}</Link>
                            <p className="text-sm text-gray-500 mb-3">{tx.color || '-'} / {tx.size || '-'}</p>
                            <div className="grid grid-cols-5 gap-4 text-sm">
                              <div><p className="text-gray-500">거래가</p><p className="font-bold">{formatPrice(tx.resellPrice)}</p></div>
                              <div><p className="text-gray-500">수수료</p><p className="font-bold">{formatPrice(tx.platformFee)}</p></div>
                              <div><p className="text-gray-500">정산 예정액</p><p className="font-bold text-green-700">{formatPrice(tx.settlementAmount)}</p></div>
                              <div><p className="text-gray-500">송장</p><p className="font-semibold">{tx.trackingNumber || '-'}</p></div>
                              <div><p className="text-gray-500">거래일</p><p className="font-semibold">{formatDate(tx.createdAt)}</p></div>
                            </div>
                            <div className="mt-4 flex gap-2 justify-end">
                              {tx.status === 'PAID' && (
                                <button disabled={processingId === tx.transactionId} onClick={() => handlePrepare(tx)} className="px-4 py-2 rounded-lg bg-[#101828] text-white text-sm font-semibold disabled:opacity-50">배송 준비</button>
                              )}
                              {(tx.status === 'PAID' || tx.status === 'PREPARING_SHIPMENT') && (
                                <button disabled={processingId === tx.transactionId} onClick={() => handleShip(tx)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-1"><Truck className="w-4 h-4" />배송 중</button>
                              )}
                              {tx.status === 'PURCHASE_CONFIRMED' && (
                                <button disabled={processingId === tx.transactionId} onClick={() => handleSettle(tx)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50">정산 완료</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
