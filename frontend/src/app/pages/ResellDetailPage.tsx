import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock, Gavel, ShieldCheck, ShoppingBag, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { getResellDetail, getResellOffers, instantBuyResell, placeResellBid } from '../api/resellApi';
import type { ResellOfferResponse, ResellResponse } from '../api/resellApi';
import { subscribeResellRealtime } from '../api/resellRealtime';

function getImageUrl(item: ResellResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-premium-resell-${item.productId}/800/1000`;
}

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function getDisplayBid(item: ResellResponse) {
  return item.currentHighestBid && item.currentHighestBid > 0 ? item.currentHighestBid : item.startPrice;
}

function getMinNextBid(item: ResellResponse) {
  return getDisplayBid(item) + (item.minBidIncrement || 1000);
}

function getTimeLeft(date?: string | null) {
  if (!date) return '마감일 없음';
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return '입찰 마감';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

function getOfferLabel(status: string) {
  switch (status) {
    case 'LEADING': return '최고 입찰';
    case 'OUTBID': return '상위 입찰 발생';
    case 'ACCEPTED': return '낙찰';
    case 'REJECTED': return '거절';
    default: return status;
  }
}

export function ResellDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const resellId = Number(params.resellId);

  const [item, setItem] = useState<ResellResponse | null>(null);
  const [offers, setOffers] = useState<ResellOfferResponse[]>([]);
  const [bidPrice, setBidPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');

  const load = () => {
    if (!Number.isFinite(resellId)) return;
    setLoading(true);
    Promise.all([getResellDetail(resellId), getResellOffers(resellId)])
      .then(([detail, bids]) => {
        setItem(detail);
        setOffers(bids);
        setBidPrice(String(getMinNextBid(detail)));
      })
      .catch((error) => {
        console.error('리셀 상세 조회 실패:', error);
        alert('리셀 상품을 불러오지 못했습니다.');
        navigate('/resell');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [resellId, navigate]);

  useEffect(() => {
    if (!Number.isFinite(resellId)) return;

    return subscribeResellRealtime(
      resellId,
      (event) => {
        setItem((prev) => {
          if (!prev || prev.resellId !== event.resellId) return prev;
          return {
            ...prev,
            currentHighestBid: event.currentHighestBid ?? prev.currentHighestBid,
            currentHighestBidderId: event.currentHighestBidderId ?? prev.currentHighestBidderId,
            bidCount: event.bidCount ?? prev.bidCount,
            status: event.status ?? prev.status,
            auctionEndAt: event.auctionEndAt ?? prev.auctionEndAt,
          };
        });

        if (event.type === 'BID_PLACED') {
          getResellOffers(resellId)
            .then(setOffers)
            .catch((error) => console.error('실시간 입찰 내역 갱신 실패:', error));
        }
      },
      setRealtimeStatus,
    );
  }, [resellId]);

  const sortedOffers = useMemo(() => [...offers].sort((a, b) => b.offerPrice - a.offerPrice), [offers]);

  const handleBid = async () => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!item) return;
    if (item.sellerId === loginUser.userId) {
      alert('본인 리셀 상품에는 입찰할 수 없습니다.');
      return;
    }
    if (item.status !== 'ON_SALE') {
      alert('현재 입찰 가능한 상태가 아닙니다.');
      return;
    }

    const price = Number(bidPrice);
    const minBid = getMinNextBid(item);
    if (!Number.isFinite(price) || price < minBid) {
      alert(`최소 입찰가는 ${formatPrice(minBid)}입니다.`);
      return;
    }

    try {
      setSubmitting(true);
      await placeResellBid(item.resellId, { buyerId: loginUser.userId, offerPrice: price });
      alert('입찰이 등록되었습니다. 실시간 이벤트로 현재 최고가가 갱신됩니다.');
      getResellOffers(item.resellId).then(setOffers).catch(() => undefined);
    } catch (error) {
      console.error('입찰 실패:', error);
      alert(error instanceof Error ? error.message : '입찰에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInstantBuy = async () => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!item) return;
    if (item.sellerId === loginUser.userId) {
      alert('본인 리셀 상품은 구매할 수 없습니다.');
      return;
    }
    if (!confirm(`${formatPrice(item.instantBuyPrice)}에 즉시 구매 처리할까요? MVP에서는 mock 거래로 완료됩니다.`)) return;

    try {
      setSubmitting(true);
      await instantBuyResell(item.resellId, loginUser.userId);
      alert('즉시 구매가 완료되었습니다.');
      navigate('/my/bidding');
    } catch (error) {
      console.error('즉시 구매 실패:', error);
      alert(error instanceof Error ? error.message : '즉시 구매에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-28 text-center text-gray-500">리셀 상품을 불러오는 중입니다...</main>
      </div>
    );
  }

  if (!item) return null;

  const currentBid = getDisplayBid(item);
  const minBid = getMinNextBid(item);
  const canBid = item.status === 'ON_SALE';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <Link to="/resell" className="inline-flex items-center gap-2 text-sm text-gray-500 mb-8 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            리셀 마켓으로 돌아가기
          </Link>

          <div className="grid grid-cols-[1fr_0.9fr] gap-12">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden">
              <img src={getImageUrl(item)} alt={item.productName} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  관리자 검수 완료
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm">
                  {item.rarityGrade || 'ARCHIVE'}
                </span>
              </div>

              <h1 className="text-4xl font-semibold mb-3" style={{ color: '#101828' }}>{item.productName}</h1>
              <p className="text-gray-500 mb-3">{item.color || '-'} / {item.size || '-'} · Premium Bidding Resell</p>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
                <span className={`h-2 w-2 rounded-full ${realtimeStatus === 'connected' ? 'bg-green-500' : realtimeStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                {realtimeStatus === 'connected' && '실시간 입찰 연결됨'}
                {realtimeStatus === 'connecting' && '실시간 입찰 연결 중'}
                {realtimeStatus === 'disconnected' && '실시간 입찰 연결 종료'}
                {realtimeStatus === 'error' && '실시간 연결 실패 - 기본 조회로 이용 가능'}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-2">시작가</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(item.startPrice)}</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm text-blue-700 mb-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 현재 최고가</p>
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(currentBid)}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-2">입찰 수</p>
                  <p className="text-2xl font-bold text-gray-900">{item.bidCount ?? 0}건</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1"><Clock className="w-4 h-4" /> 남은 시간</p>
                  <p className="text-2xl font-bold text-gray-900">{getTimeLeft(item.auctionEndAt)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Gavel className="w-5 h-5" /> 입찰하기</h2>
                <p className="text-sm text-gray-500 mb-3">최소 입찰가: <b className="text-gray-900">{formatPrice(minBid)}</b></p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    disabled={!canBid || submitting}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900 disabled:bg-gray-100"
                    placeholder="입찰가 입력"
                  />
                  <button
                    onClick={handleBid}
                    disabled={!canBid || submitting}
                    className="px-6 py-3 rounded-xl bg-[#101828] text-white font-semibold disabled:bg-gray-400"
                  >
                    입찰 등록
                  </button>
                </div>
              </div>

              <button
                onClick={handleInstantBuy}
                disabled={!canBid || submitting}
                className="w-full py-4 rounded-xl bg-blue-700 text-white font-semibold mb-8 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                즉시 구매 {formatPrice(item.instantBuyPrice)}
              </button>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500 mb-2">프리미엄 사유</p>
                  <p className="text-sm text-gray-900 leading-6">{item.premiumReason || '한정 수량 또는 희소성이 확인된 상품입니다.'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500 mb-2">검수 메모</p>
                  <p className="text-sm text-gray-900 leading-6">{item.verificationNote || '관리자 검수 완료'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 font-semibold">입찰 내역</div>
                {sortedOffers.length === 0 ? (
                  <div className="px-5 py-8 text-center text-gray-500">아직 입찰 내역이 없습니다.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {sortedOffers.slice(0, 8).map((offer) => (
                      <div key={offer.offerId} className="px-5 py-4 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">구매자 ID {offer.buyerId}</p>
                          <p className="text-gray-500">{new Date(offer.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(offer.offerPrice)}</p>
                          <p className="text-xs text-blue-700">{getOfferLabel(offer.status)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
