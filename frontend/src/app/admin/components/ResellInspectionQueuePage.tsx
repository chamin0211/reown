import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Gavel, RefreshCw, Search, Trophy, XCircle } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { approveResell, closeResellAuction, getAdminResells, rejectResell } from '../../api/resellApi';
import type { ResellResponse } from '../../api/resellApi';

type FilterStatus = 'all' | 'WAITING' | 'ON_SALE' | 'SOLD' | 'REJECTED' | 'EXPIRED' | 'CANCELED';

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function getImageUrl(item: ResellResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-admin-resell-${item.productName || item.productId}/300/400`;
}

function statusLabel(status: string) {
  switch (status) {
    case 'WAITING': return '검수 대기';
    case 'ON_SALE': return '입찰 진행';
    case 'SOLD': return '거래 완료';
    case 'REJECTED': return '반려';
    case 'CANCELED': return '취소';
    case 'EXPIRED': return '마감';
    default: return status;
  }
}

function statusClass(status: string) {
  switch (status) {
    case 'WAITING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'ON_SALE': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'SOLD': return 'bg-green-50 text-green-700 border-green-200';
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
    case 'CANCELED': return 'bg-gray-50 text-gray-600 border-gray-200';
    case 'EXPIRED': return 'bg-gray-50 text-gray-600 border-gray-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

export function ResellInspectionQueuePage() {
  const [items, setItems] = useState<ResellResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    getAdminResells()
      .then(setItems)
      .catch((error) => {
        console.error('리셀 검수 목록 조회 실패:', error);
        alert('리셀 검수 목록을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (!q) return true;
      return [item.productName, item.status, item.rarityGrade ?? '', String(item.resellId), String(item.sellerId)]
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [items, filter, search]);

  const stats = useMemo(() => ({
    total: items.length,
    waiting: items.filter((item) => item.status === 'WAITING').length,
    live: items.filter((item) => item.status === 'ON_SALE').length,
    sold: items.filter((item) => item.status === 'SOLD').length,
    totalBidAmount: items.reduce((sum, item) => sum + Number(item.currentHighestBid || 0), 0),
  }), [items]);

  const handleApprove = async (item: ResellResponse) => {
    if (!confirm(`${item.productName} 리셀 상품을 승인할까요?`)) return;
    await approveResell(item.resellId);
    load();
  };

  const handleReject = async (item: ResellResponse) => {
    if (!confirm(`${item.productName} 리셀 상품을 반려할까요?`)) return;
    await rejectResell(item.resellId);
    load();
  };

  const handleClose = async (item: ResellResponse) => {
    if ((item.bidCount ?? 0) <= 0) {
      alert('입찰 내역이 있어야 낙찰 처리할 수 있습니다.');
      return;
    }
    if (!confirm(`${item.productName}의 최고 입찰자를 낙찰 처리할까요?`)) return;
    await closeResellAuction(item.resellId);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">프리미엄 리셀 검수</h1>
            <p className="text-gray-500 mt-2">셀러가 등록한 희소 리셀 상품을 승인/반려하고 낙찰을 처리합니다.</p>
          </div>
          <button onClick={load} className="px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw size={18} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard label="전체" value={`${stats.total}건`} />
          <StatCard label="검수 대기" value={`${stats.waiting}건`} color="text-yellow-600" />
          <StatCard label="입찰 진행" value={`${stats.live}건`} color="text-blue-600" />
          <StatCard label="거래 완료" value={`${stats.sold}건`} color="text-green-600" />
          <StatCard label="총 최고입찰액" value={formatPrice(stats.totalBidAmount)} color="text-purple-600" />
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {([
                ['all', '전체'],
                ['WAITING', '검수 대기'],
                ['ON_SALE', '입찰 진행'],
                ['SOLD', '거래 완료'],
                ['REJECTED', '반려'],
                ['EXPIRED', '마감'],
              ] as [FilterStatus, string][]).map(([value, label]) => (
                <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-xl border text-sm ${filter === value ? 'bg-[#101828] text-white border-[#101828]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="상품명, 셀러 ID, 리셀 ID 검색" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300" />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">리셀 검수 목록을 불러오는 중입니다...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">표시할 리셀 상품이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 text-left">리셀 상품</th>
                    <th className="px-6 py-3 text-left">셀러</th>
                    <th className="px-6 py-3 text-left">가격/입찰</th>
                    <th className="px-6 py-3 text-left">검수 정보</th>
                    <th className="px-6 py-3 text-left">상태</th>
                    <th className="px-6 py-3 text-left">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.resellId}>
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <img src={getImageUrl(item)} alt={item.productName} className="w-16 h-20 object-cover rounded-xl bg-gray-100" />
                          <div>
                            <div className="font-bold text-gray-900">{item.productName}</div>
                            <div className="text-xs text-gray-500">리셀 ID {item.resellId} · 상품 ID {item.productId}</div>
                            <div className="text-xs text-purple-600 font-semibold mt-1">{item.rarityGrade ?? 'ARCHIVE'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">seller_id {item.sellerId}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold">현재 {formatPrice(item.currentHighestBid || item.startPrice)}</div>
                        <div className="text-xs text-gray-500">시작 {formatPrice(item.startPrice)} · 즉시 {formatPrice(item.instantBuyPrice)}</div>
                        <div className="text-xs text-blue-600">입찰 {item.bidCount ?? 0}건</div>
                      </td>
                      <td className="px-6 py-4 max-w-[280px] text-xs text-gray-600">
                        <div className="line-clamp-2">{item.conditionDescription || '-'}</div>
                        <div className="line-clamp-2 mt-1 text-gray-400">{item.premiumReason || '-'}</div>
                      </td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {item.status === 'WAITING' && (
                            <>
                              <button title="승인" onClick={() => handleApprove(item)} className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"><CheckCircle size={16} /></button>
                              <button title="반려" onClick={() => handleReject(item)} className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"><XCircle size={16} /></button>
                            </>
                          )}
                          {item.status === 'ON_SALE' && (
                            <button title="낙찰 처리" onClick={() => handleClose(item)} className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"><Trophy size={16} /></button>
                          )}
                          {item.status !== 'WAITING' && item.status !== 'ON_SALE' && (
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Gavel size={14} /> 처리 완료</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p></div>;
}
