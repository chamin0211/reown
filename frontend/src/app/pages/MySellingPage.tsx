import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { getSellerResells, getSellerResellTransactions } from '../api/resellApi';
import type { ResellResponse, ResellTransactionDetailResponse } from '../api/resellApi';
import { Package, ShieldCheck } from 'lucide-react';

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function getImageUrl(item: { thumbnailUrl: string | null; productId: number }) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-selling-${item.productId}/300/400`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'WAITING': return '검수 대기';
    case 'ON_SALE': return '입찰 진행중';
    case 'SOLD': return '거래 완료';
    case 'REJECTED': return '반려';
    case 'CANCELED': return '취소';
    case 'EXPIRED': return '마감';
    default: return status;
  }
}

export function MySellingPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ResellResponse[]>([]);
  const [transactions, setTransactions] = useState<ResellTransactionDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    Promise.all([getSellerResells(loginUser.userId), getSellerResellTransactions(loginUser.userId)])
      .then(([resells, tx]) => {
        setItems(resells);
        setTransactions(tx);
      })
      .catch((error) => {
        console.error('판매 리셀 조회 실패:', error);
        alert('판매 리셀 내역을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">MY ARCHIVE SALES</p>
            <h1 className="text-4xl font-semibold mb-3" style={{ color: '#101828' }}>프리미엄 리셀 판매 내역</h1>
            <p className="text-gray-500">입찰형 프리미엄 리셀은 일반 상품 중고 판매가 아니라 관리자 검수 상품 중심으로 운영됩니다.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-gray-100 p-5"><p className="text-sm text-gray-500 mb-2">등록 상품</p><p className="text-3xl font-bold">{items.length}건</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm text-blue-700 mb-2">입찰 진행</p><p className="text-3xl font-bold text-blue-900">{items.filter((i) => i.status === 'ON_SALE').length}건</p></div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5"><p className="text-sm text-green-700 mb-2">거래 완료</p><p className="text-3xl font-bold text-green-900">{transactions.length}건</p></div>
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
          )}
        </div>
      </main>
    </div>
  );
}
