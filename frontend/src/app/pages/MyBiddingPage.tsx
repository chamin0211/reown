import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { getBuyerOffers, getBuyerResellTransactions } from '../api/resellApi';
import type { ResellOfferDetailResponse, ResellTransactionDetailResponse } from '../api/resellApi';
import { Gavel, Package, Trophy } from 'lucide-react';

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
    case 'REJECTED': return '거절';
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

export function MyBiddingPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<ResellOfferDetailResponse[]>([]);
  const [transactions, setTransactions] = useState<ResellTransactionDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'offers' | 'wins'>('offers');

  useEffect(() => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    Promise.all([getBuyerOffers(loginUser.userId), getBuyerResellTransactions(loginUser.userId)])
      .then(([offerData, transactionData]) => {
        setOffers(offerData);
        setTransactions(transactionData);
      })
      .catch((error) => {
        console.error('입찰 현황 조회 실패:', error);
        alert('입찰 현황을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const leadingCount = useMemo(() => offers.filter((offer) => offer.offerStatus === 'LEADING').length, [offers]);
  const outbidCount = useMemo(() => offers.filter((offer) => offer.offerStatus === 'OUTBID').length, [offers]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">MY BIDDING</p>
              <h1 className="text-4xl font-semibold mb-3" style={{ color: '#101828' }}>입찰 현황</h1>
              <p className="text-gray-500">프리미엄 리셀 상품에 입찰한 내역과 낙찰 내역을 확인합니다.</p>
            </div>
            <Link to="/resell" className="px-5 py-3 rounded-xl bg-[#101828] text-white text-sm font-semibold">리셀 마켓 보기</Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-gray-100 p-5"><p className="text-sm text-gray-500 mb-2">전체 입찰</p><p className="text-3xl font-bold">{offers.length}건</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm text-blue-700 mb-2">최고 입찰 중</p><p className="text-3xl font-bold text-blue-900">{leadingCount}건</p></div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5"><p className="text-sm text-green-700 mb-2">낙찰/구매 완료</p><p className="text-3xl font-bold text-green-900">{transactions.length}건</p></div>
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
                  <Link to={`/resell/${tx.resellId}`} key={tx.transactionId} className="block rounded-2xl border border-gray-200 p-5 hover:bg-gray-50">
                    <div className="flex gap-5">
                      <img src={getImageUrl(tx)} alt={tx.productName} className="w-24 h-28 object-cover rounded-xl bg-gray-100" />
                      <div className="flex-1">
                        <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold mb-2">거래 완료</span>
                        <h3 className="font-semibold text-gray-900 mb-1">{tx.productName}</h3>
                        <p className="text-sm text-gray-500 mb-3">{tx.color || '-'} / {tx.size || '-'}</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div><p className="text-gray-500">거래가</p><p className="font-bold text-gray-900">{formatPrice(tx.resellPrice)}</p></div>
                          <div><p className="text-gray-500">플랫폼 수수료</p><p className="font-bold text-gray-900">{formatPrice(tx.platformFee)}</p></div>
                          <div><p className="text-gray-500">등급</p><p className="font-bold text-purple-700">{tx.rarityGrade || 'ARCHIVE'}</p></div>
                          <div><p className="text-gray-500">거래일</p><p className="font-semibold text-gray-900">{formatDate(tx.createdAt)}</p></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {outbidCount > 0 && tab === 'offers' && <p className="mt-6 text-sm text-gray-500">상위 입찰이 발생한 내역은 리셀 상세 페이지에서 다시 입찰할 수 있습니다.</p>}
        </div>
      </main>
    </div>
  );
}
