import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { ChevronDown, Clock, Gavel, ShieldCheck, TrendingUp } from 'lucide-react';
import { getResells } from '../api/resellApi';
import type { ResellResponse } from '../api/resellApi';

function getImageUrl(item: ResellResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-premium-resell-${item.productId}/600/800`;
}

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function getDisplayBid(item: ResellResponse) {
  return item.currentHighestBid && item.currentHighestBid > 0 ? item.currentHighestBid : item.startPrice;
}

function getDaysLeft(date?: string | null) {
  if (!date) return '-';
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return '마감';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}일 ${hours}시간`;
  return `${hours}시간`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'ON_SALE': return '입찰 진행중';
    case 'SOLD': return '거래 완료';
    case 'EXPIRED': return '입찰 마감';
    default: return status;
  }
}

function sortItems(items: ResellResponse[], sortBy: string) {
  const copied = [...items];
  switch (sortBy) {
    case 'bid-desc':
      return copied.sort((a, b) => getDisplayBid(b) - getDisplayBid(a));
    case 'end-soon':
      return copied.sort((a, b) => new Date(a.auctionEndAt ?? '9999-12-31').getTime() - new Date(b.auctionEndAt ?? '9999-12-31').getTime());
    case 'popular':
      return copied.sort((a, b) => (b.bidCount ?? 0) - (a.bidCount ?? 0));
    case 'latest':
    default:
      return copied.sort((a, b) => b.resellId - a.resellId);
  }
}

export function ResellMarketPage() {
  const [items, setItems] = useState<ResellResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ON_SALE' | 'SOLD'>('all');

  useEffect(() => {
    getResells()
      .then(setItems)
      .catch((error) => {
        console.error('프리미엄 리셀 조회 실패:', error);
        alert('리셀 마켓 상품을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => statusFilter === 'all' || item.status === statusFilter);
    return sortItems(filtered, sortBy);
  }, [items, sortBy, statusFilter]);

  const liveCount = items.filter((i) => i.status === 'ON_SALE').length;
  const totalBids = items.reduce((sum, item) => sum + (item.bidCount ?? 0), 0);
  const highestBid = items.reduce((max, item) => Math.max(max, getDisplayBid(item)), 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <section className="border-b border-gray-100 bg-[#f8fafc]">
          <div className="max-w-[1280px] mx-auto px-8 py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 text-sm mb-5">
              <ShieldCheck className="w-4 h-4" />
              Archive Zone · Premium Bidding Resell
            </div>
            <h1 className="text-4xl font-semibold tracking-tight mb-3" style={{ color: '#101828' }}>
              프리미엄 리셀 마켓
            </h1>
            <p className="text-gray-600 max-w-2xl leading-7">
              관리자 검수를 통과한 희소 상품만 입찰 방식으로 거래됩니다. 시작가, 현재 최고 입찰가, 마감 시간을 확인하고 경쟁 입찰에 참여하세요.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-3xl">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-2">진행 중 경매</p>
                <p className="text-2xl font-bold text-gray-900">{liveCount}건</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-2">누적 입찰</p>
                <p className="text-2xl font-bold text-gray-900">{totalBids}건</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-500 mb-2">최고 입찰가</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(highestBid)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              {[
                { value: 'all', label: '전체' },
                { value: 'ON_SALE', label: '입찰 진행중' },
                { value: 'SOLD', label: '거래 완료' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value as typeof statusFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusFilter === filter.value ? 'bg-[#101828] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="latest">최신 등록순</option>
                <option value="end-soon">마감 임박순</option>
                <option value="popular">입찰 많은순</option>
                <option value="bid-desc">현재가 높은순</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24 text-gray-500">프리미엄 리셀 상품을 불러오는 중입니다...</div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-24 border border-gray-200 rounded-2xl">
              <Gavel className="w-14 h-14 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">표시할 리셀 상품이 없습니다</h3>
              <p className="text-gray-500">관리자 검수 완료 후 리셀 마켓에 노출됩니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {visibleItems.map((item) => {
                const displayBid = getDisplayBid(item);
                return (
                  <Link to={`/resell/${item.resellId}`} key={item.resellId} className="group block">
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                      <img src={getImageUrl(item)} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-semibold">
                        {item.rarityGrade || 'ARCHIVE'}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-gray-900 text-xs font-semibold">
                        {getStatusLabel(item.status)}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">RE:OWN ARCHIVE</p>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">{item.productName}</h3>
                    <p className="text-xs text-gray-500 mb-3">{item.color || '-'} / {item.size || '-'}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 현재 최고가</span>
                        <span className="font-bold text-gray-900">{formatPrice(displayBid)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">즉시 구매가</span>
                        <span className="font-semibold text-gray-900">{formatPrice(item.instantBuyPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span>{item.bidCount ?? 0} bids</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getDaysLeft(item.auctionEndAt)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
