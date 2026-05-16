import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Plus, RefreshCw, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { cancelResell, createPremiumResell, getSellerResells } from '../../api/resellApi';
import type { CreatePremiumResellRequest, ResellResponse } from '../../api/resellApi';
import { getLoginUser } from '../../auth/session';

function formatPrice(value?: number | null) {
  return `₩${Number(value ?? 0).toLocaleString()}`;
}

function toLocalInputDateTime(value: Date) {
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
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

function getImageUrl(item: ResellResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) return item.thumbnailUrl;
  return `https://picsum.photos/seed/reown-seller-resell-${item.resellId}/300/400`;
}

type ResellFormState = Omit<CreatePremiumResellRequest, 'startPrice' | 'instantBuyPrice' | 'minBidIncrement'> & {
  startPrice: number | '';
  instantBuyPrice: number | '';
  minBidIncrement: number | '';
};

const initialForm = (): ResellFormState => ({
  sellerId: 0,
  brandId: 11,
  productName: '',
  thumbnailUrl: '',
  categoryName: '',
  size: '',
  color: '',
  colorHex: '',
  startPrice: '',
  instantBuyPrice: '',
  minBidIncrement: '',
  auctionEndAt: toLocalInputDateTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  rarityGrade: 'ARCHIVE',
  conditionDescription: '',
  verificationNote: '',
  premiumReason: '',
});

export function ResellManagement() {
  const loginUser = getLoginUser();
  const sellerId = loginUser?.userId ?? 0;
  const brandId = loginUser?.brandId ?? 11;

  const [items, setItems] = useState<ResellResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ResellFormState>(() => ({ ...initialForm(), sellerId, brandId }));

  const load = () => {
    if (!sellerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getSellerResells(sellerId)
      .then(setItems)
      .catch((error) => {
        console.error('셀러 리셀 목록 조회 실패:', error);
        alert('리셀 상품 목록을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [sellerId]);

  const stats = useMemo(() => ({
    total: items.length,
    waiting: items.filter((item) => item.status === 'WAITING').length,
    live: items.filter((item) => item.status === 'ON_SALE').length,
    sold: items.filter((item) => item.status === 'SOLD').length,
    highestBidSum: items.reduce((sum, item) => sum + Number(item.currentHighestBid || 0), 0),
  }), [items]);

  const handleChange = <K extends keyof ResellFormState>(key: K, value: ResellFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!sellerId) {
      alert('셀러 로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }
    if (!form.productName.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }
    if (!form.thumbnailUrl.trim()) {
      alert('상품 이미지 URL을 입력해주세요.');
      return;
    }
    if (!form.categoryName.trim()) {
      alert('카테고리를 입력해주세요.');
      return;
    }
    if (!form.size.trim()) {
      alert('사이즈를 입력해주세요.');
      return;
    }
    if (!form.color.trim()) {
      alert('컬러를 입력해주세요.');
      return;
    }
    if (form.startPrice === '' || form.startPrice <= 0) {
      alert('입찰 시작가는 1원 이상이어야 합니다.');
      return;
    }
    if (form.instantBuyPrice === '' || form.instantBuyPrice < form.startPrice) {
      alert('즉시 구매가는 입찰 시작가보다 낮을 수 없습니다.');
      return;
    }
    if (form.minBidIncrement === '' || form.minBidIncrement <= 0) {
      alert('최소 입찰 단위는 1원 이상이어야 합니다.');
      return;
    }

    setSaving(true);
    try {
      await createPremiumResell({
        ...form,
        sellerId,
        brandId,
        productName: form.productName.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
        categoryName: form.categoryName.trim(),
        size: form.size.trim(),
        color: form.color.trim(),
        colorHex: form.colorHex?.trim() || '',
        startPrice: form.startPrice,
        instantBuyPrice: form.instantBuyPrice,
        minBidIncrement: form.minBidIncrement,
      });
      alert('프리미엄 리셀 상품이 등록되었습니다. 관리자 검수 승인 후 리셀 마켓에 노출됩니다.');
      setForm({ ...initialForm(), sellerId, brandId });
      setShowForm(false);
      load();
    } catch (error) {
      console.error('리셀 등록 실패:', error);
      alert('리셀 상품 등록에 실패했습니다. 입력값을 확인해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (item: ResellResponse) => {
    if (!confirm(`${item.productName} 리셀 등록을 취소할까요?`)) return;
    try {
      await cancelResell(item.resellId, sellerId);
      load();
    } catch (error) {
      console.error('리셀 취소 실패:', error);
      alert('리셀 취소에 실패했습니다.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">프리미엄 리셀 관리</h1>
          <p className="text-gray-500 mt-2">희소 상품을 등록하면 관리자 검수 후 입찰형 리셀 마켓에 노출됩니다.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/seller/resell-sales" className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <Truck size={18} /> 거래/배송 관리
          </Link>
          <button onClick={load} className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw size={18} /> 새로고침
          </button>
          <button onClick={() => setShowForm((v) => !v)} className="px-5 py-3 rounded-xl bg-[#101828] text-white font-semibold flex items-center gap-2">
            <Plus size={18} /> 리셀 상품 등록
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="전체" value={`${stats.total}건`} />
        <StatCard label="검수 대기" value={`${stats.waiting}건`} color="text-yellow-600" />
        <StatCard label="입찰 진행" value={`${stats.live}건`} color="text-blue-600" />
        <StatCard label="거래 완료" value={`${stats.sold}건`} color="text-green-600" />
        <StatCard label="총 최고입찰액" value={formatPrice(stats.highestBidSum)} color="text-purple-600" />
      </div>

      {showForm && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">셀러 프리미엄 리셀 상품 등록</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="상품명" value={form.productName} onChange={(v) => handleChange('productName', v)} placeholder="예: RE:OWN 아카이브 한정 데님 자켓" />
            <Input label="상품 이미지 URL" value={form.thumbnailUrl} onChange={(v) => handleChange('thumbnailUrl', v)} placeholder="https://images.unsplash.com/..." />
            <Input label="카테고리" value={form.categoryName} onChange={(v) => handleChange('categoryName', v)} placeholder="예: 아우터" />
            <Input label="사이즈" value={form.size} onChange={(v) => handleChange('size', v)} placeholder="예: M" />
            <Input label="컬러" value={form.color} onChange={(v) => handleChange('color', v)} placeholder="예: 데님 블루" />
            <Input label="컬러 코드" value={form.colorHex ?? ''} onChange={(v) => handleChange('colorHex', v)} placeholder="비워두면 색상명 기준 자동 표시" />
            <NumberInput label="입찰 시작가" value={form.startPrice} onChange={(v) => handleChange('startPrice', v)} placeholder="예: 89000" />
            <NumberInput label="즉시 구매가" value={form.instantBuyPrice} onChange={(v) => handleChange('instantBuyPrice', v)} placeholder="예: 180000" />
            <NumberInput label="최소 입찰 단위" value={form.minBidIncrement} onChange={(v) => handleChange('minBidIncrement', v)} placeholder="예: 5000" />
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">입찰 마감일</span>
              <input type="datetime-local" value={form.auctionEndAt} onChange={(e) => handleChange('auctionEndAt', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">희소성 등급</span>
              <select value={form.rarityGrade} onChange={(e) => handleChange('rarityGrade', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white">
                <option value="ARCHIVE">ARCHIVE</option>
                <option value="LIMITED">LIMITED</option>
                <option value="RARE">RARE</option>
                <option value="COLLECTOR">COLLECTOR</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Textarea label="상품 상태 설명" value={form.conditionDescription} onChange={(v) => handleChange('conditionDescription', v)} />
            <Textarea label="검수 요청 메모" value={form.verificationNote} onChange={(v) => handleChange('verificationNote', v)} />
            <Textarea label="프리미엄 사유" value={form.premiumReason} onChange={(v) => handleChange('premiumReason', v)} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-gray-300">취소</button>
            <button disabled={saving} onClick={handleSubmit} className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50">
              {saving ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">내 리셀 상품</h2>
          <p className="text-sm text-gray-500 mt-1">검수 대기, 입찰 진행, 거래 완료 상태를 확인할 수 있습니다.</p>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">리셀 상품을 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">등록한 리셀 상품이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">상품</th>
                  <th className="px-6 py-3 text-left">가격/입찰</th>
                  <th className="px-6 py-3 text-left">입찰 마감</th>
                  <th className="px-6 py-3 text-left">상태</th>
                  <th className="px-6 py-3 text-left">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.resellId}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(item)} alt={item.productName} className="w-14 h-16 object-cover rounded-lg bg-gray-100" />
                        <div>
                          <div className="font-bold text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-500">리셀 ID {item.resellId} · {item.rarityGrade}</div>
                          <div className="text-xs text-gray-500">{item.color} / {item.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">현재 {formatPrice(item.currentHighestBid || item.startPrice)}</div>
                      <div className="text-xs text-gray-500">시작 {formatPrice(item.startPrice)} · 즉시 {formatPrice(item.instantBuyPrice)}</div>
                      <div className="text-xs text-blue-600">입찰 {item.bidCount ?? 0}건</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.auctionEndAt ? item.auctionEndAt.replace('T', ' ').slice(0, 16) : '-'}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></td>
                    <td className="px-6 py-4">
                      {item.status === 'WAITING' || item.status === 'REJECTED' ? (
                        <button onClick={() => handleCancel(item)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 size={14} /> 취소
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p></div>;
}

function Input({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="space-y-2"><span className="text-sm font-medium text-gray-700">{label}</span><input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-300" /></label>;
}

function NumberInput({ label, value, onChange, placeholder }: { label: string; value: number | ''; onChange: (value: number | '') => void; placeholder?: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-300"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return <label className="space-y-2"><span className="text-sm font-medium text-gray-700">{label}</span><textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" /></label>;
}
