import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import {
  confirmResellPurchase,
  getBuyerOffers,
  getBuyerResellTransactions,
  payResellTransaction,
} from '../api/resellApi';
import type { ResellOfferDetailResponse, ResellTransactionDetailResponse } from '../api/resellApi';
import { Gavel, PackageCheck, Trophy } from 'lucide-react';

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function getImageUrl(item: { thumbnailUrl: string | null; productId: number }) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-bidding-${item.productId}/300/400`;
}

function getBidStatusLabel(status: string) {
  switch (status) {
    case 'LEADING': return '현재 최고 입찰';
    case 'OUTBID': return '상위 입찰 발생';
    case 'ACCEPTED': return '낙찰';
    case 'REJECTED': return '거래 종료';
    default: return status;
  }
}

function getBidStatusStyle(status: string) {
  switch (status) {
    case 'LEADING': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-200';
    case 'OUTBID': return 'bg-gray-50 text-gray-600 border-gray-200';
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
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

export function MyBiddingPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<ResellOfferDetailResponse[]>([]);
  const [transactions, setTransactions] = useState<ResellTransactionDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'offers' | 'wins'>('offers');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const load = async () => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const [offerData, transactionData] = await Promise.all([
        getBuyerOffers(loginUser.userId),
        getBuyerResellTransactions(loginUser.userId),
      ]);
      setOffers(offerData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('입찰 현황 조회 실패:', error);
      alert('입찰 현황을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [navigate]);

  const handlePay = async (tx: ResellTransactionDetailResponse) => {
    const loginUser = getLoginUser();
    if (!loginUser) return;
    if (!confirm('결제 완료 처리할까요? 테스트용으로 실제 결제 API 대신 상태만 변경합니다.')) return;
    setProcessingId(tx.transactionId);
    try {
      await payResellTransaction(tx.transactionId, loginUser.userId);
      await load();
    } catch (error) {
      console.error('결제 완료 처리 실패:', error);
      alert(error instanceof Error ? error.message : '결제 완료 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirm = async (tx: ResellTransactionDetailResponse) => {
    const loginUser = getLoginUser();
    if (!loginUser) return;
    if (!confirm('상품 수령을 확인하고 구매 확정 처리할까요?')) return;
    setProcessingId(tx.transactionId);
    try {
      await confirmResellPurchase(tx.transactionId, loginUser.userId);
      await load();
    } catch (error) {
      console.error('구매 확정 실패:', error);
      alert(error instanceof Error ? error.message : '구매 확정 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const leadingCount = useMemo(() => offers.filter((offer) => offer.offerStatus === 'LEADING').length, [offers]);
  const activeTransactionCount = useMemo(
    () => transactions.filter((tx) => !['SETTLED', 'CANCELED'].includes(tx.status)).length,
    [transactions],
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">MY BIDDING</p>
              <h1 className="text-4xl font-semibold mb-3" style={{ color: '#101828' }}>입찰 현황</h1>
              <p className="text-gray-500">프리미엄 리셀 상품에 입찰한 내역과 낙찰 이후 거래 진행 상태를 확인합니다.</p>
            </div>
            <Link to="/resell" className="px-5 py-3 rounded-xl bg-[#101828] text-white text-sm font-semibold">리셀 마켓 보기</Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-gray-100 p-5"><p className="text-sm text-gray-500 mb-2">전체 입찰</p><p className="text-3xl font-bold">{offers.length}건</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm text-blue-700 mb-2">최고 입찰 중</p><p className="text-3xl font-bold text-blue-900">{leadingCount}건</p></div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5"><p className="text-sm text-green-700 mb-2">거래 진행/완료</p><p className="text-3xl font-bold text-green-900">{activeTransactionCount}건</p></div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab('offers')} className={`px-5 py-2.5 rounded-lg font-semibold ${tab === 'offers' ? 'bg-[#101828] text-white' : 'border border-gray-200 text-gray-600'}`}>입찰 내역</button>
            <button onClick={() => setTab('wins')} className={`px-5 py-2.5 rounded-lg font-semibold ${tab === 'wins' ? 'bg-[#101828] text-white' : 'border border-gray-200 text-gray-600'}`}>낙찰/구매 내역</button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">입찰 현황을 불러오는 중입니다...</div>
          ) : tab === 'offers' ? (
            offers.length === 0 ? (
              <div className="text-center py-20 border border-gray-200 rounded-2xl"><Gavel className="w-14 h-14 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">아직 입찰한 리셀 상품이 없습니다.</p></div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <Link to={`/resell/${offer.resellId}`} key={offer.offerId} className="block rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
                    <div className="flex gap-5">
                      <img src={getImageUrl(offer)} alt={offer.productName} className="w-24 h-28 object-cover rounded-xl bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2"><span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getBidStatusStyle(offer.offerStatus)}`}>{getBidStatusLabel(offer.offerStatus)}</span><span className="text-xs text-purple-700 font-semibold">{offer.rarityGrade || 'ARCHIVE'}</span></div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{offer.productName}</h3>
                        <p className="text-sm text-gray-500 mb-3">{offer.color || '-'} / {offer.size || '-'}</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div><p className="text-gray-500">내 입찰가</p><p className="font-bold text-gray-900">{formatPrice(offer.offerPrice)}</p></div>
                          <div><p className="text-gray-500">현재 최고가</p><p className="font-bold text-blue-800">{formatPrice(offer.currentHighestBid || offer.startPrice)}</p></div>
                          <div><p className="text-gray-500">즉시 구매가</p><p className="font-bold text-gray-900">{formatPrice(offer.instantBuyPrice)}</p></div>
                          <div><p className="text-gray-500">입찰일</p><p className="font-semibold text-gray-900">{formatDate(offer.createdAt)}</p></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            transactions.length === 0 ? (
              <div className="text-center py-20 border border-gray-200 rounded-2xl"><Trophy className="w-14 h-14 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">낙찰 또는 즉시 구매한 내역이 없습니다.</p></div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.transactionId} className="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
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
                          <div><p className="text-gray-500">거래가</p><p className="font-bold text-gray-900">{formatPrice(tx.resellPrice)}</p></div>
                          <div><p className="text-gray-500">플랫폼 수수료</p><p className="font-bold text-gray-900">{formatPrice(tx.platformFee)}</p></div>
                          <div><p className="text-gray-500">송장</p><p className="font-semibold text-gray-900">{tx.trackingNumber || '-'}</p></div>
                          <div><p className="text-gray-500">거래일</p><p className="font-semibold text-gray-900">{formatDate(tx.createdAt)}</p></div>
                          <div className="flex justify-end items-end">
                            {tx.status === 'PAYMENT_WAITING' && (
                              <button disabled={processingId === tx.transactionId} onClick={() => handlePay(tx)} className="px-4 py-2 rounded-lg bg-[#101828] text-white text-sm font-semibold disabled:opacity-50">결제 완료</button>
                            )}
                            {tx.status === 'SHIPPING' && (
                              <button disabled={processingId === tx.transactionId} onClick={() => handleConfirm(tx)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-1"><PackageCheck className="w-4 h-4" />구매 확정</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
