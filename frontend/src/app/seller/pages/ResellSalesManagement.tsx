import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Package, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { getLoginUser } from '../../auth/session';
import {
  getSellerResells,
  getSellerResellTransactions,
  prepareResellShipment,
  settleResellTransaction,
  shipResellTransaction,
} from '../../api/resellApi';
import type { ResellResponse, ResellTransactionDetailResponse } from '../../api/resellApi';

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

export function ResellSalesManagement() {
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

    setLoading(true);
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

  const liveCount = useMemo(() => items.filter((i) => i.status === 'ON_SALE').length, [items]);
  const soldCount = useMemo(() => items.filter((i) => i.status === 'SOLD').length, [items]);
  const paidCount = useMemo(() => transactions.filter((tx) => tx.status === 'PAID' || tx.status === 'PREPARING_SHIPMENT' || tx.status === 'SHIPPING').length, [transactions]);
  const settlementWaitingCount = useMemo(() => transactions.filter((tx) => tx.status === 'PURCHASE_CONFIRMED').length, [transactions]);
  const settledCount = useMemo(() => transactions.filter((tx) => tx.status === 'SETTLED').length, [transactions]);
  const settlementTotal = useMemo(() => transactions.reduce((sum, tx) => sum + Number(tx.settlementAmount || 0), 0), [transactions]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">RESELL TRANSACTION</p>
          <h1 className="text-3xl font-bold text-gray-900">리셀 거래/배송/정산 관리</h1>
          <p className="text-gray-500 mt-2">낙찰 이후 결제, 배송, 구매 확정, 정산 완료 상태를 셀러센터에서 관리합니다.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw size={18} /> 새로고침
          </button>
          <Link to="/seller/resell" className="px-5 py-3 rounded-xl bg-[#101828] text-white font-semibold flex items-center gap-2">
            리셀 상품 관리
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="등록 상품" value={`${items.length}건`} />
        <StatCard label="입찰 진행" value={`${liveCount}건`} color="text-blue-600" />
        <StatCard label="거래 생성" value={`${soldCount}건`} color="text-green-600" />
        <StatCard label="배송 처리 중" value={`${paidCount}건`} color="text-purple-600" />
        <StatCard label="정산 대기" value={`${settlementWaitingCount}건`} color="text-emerald-600" />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">판매 내역을 불러오는 중입니다...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Package className="w-14 h-14 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">등록된 프리미엄 리셀 판매 내역이 없습니다</h2>
          <p className="text-gray-500">리셀 관리 메뉴에서 상품을 등록하면 이곳에서 거래와 배송 상태를 관리할 수 있습니다.</p>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">등록 상품 상태</h2>
                <p className="text-sm text-gray-500 mt-1">검수, 입찰, 거래 생성 상태를 빠르게 확인합니다.</p>
              </div>
              <span className="text-sm text-gray-500">총 {items.length}건</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 text-left">상품</th>
                    <th className="px-6 py-3 text-left">가격/입찰</th>
                    <th className="px-6 py-3 text-left">상태</th>
                    <th className="px-6 py-3 text-left">바로가기</th>
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
                            <div className="text-xs text-gray-500">리셀 ID {item.resellId} · {item.rarityGrade || 'ARCHIVE'}</div>
                            <div className="text-xs text-gray-500">{item.color || '-'} / {item.size || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">현재 {formatPrice(item.currentHighestBid || item.startPrice)}</div>
                        <div className="text-xs text-gray-500">시작 {formatPrice(item.startPrice)} · 즉시 {formatPrice(item.instantBuyPrice)}</div>
                        <div className="text-xs text-blue-600">입찰 {item.bidCount ?? 0}건</div>
                      </td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full border text-xs font-semibold bg-gray-50 text-gray-700 border-gray-200">{getStatusLabel(item.status)}</span></td>
                      <td className="px-6 py-4"><Link to={`/resell/${item.resellId}`} className="text-blue-600 hover:underline">상세 보기</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">거래/배송/정산 관리</h2>
                <p className="text-sm text-gray-500 mt-1">결제 완료 이후 배송 처리와 구매 확정 이후 정산을 진행합니다.</p>
              </div>
              <span className="text-sm text-gray-500">거래내역 {transactions.length}건 · 정산완료 {settledCount}건 · 총 정산예정 {formatPrice(settlementTotal)}</span>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">아직 생성된 리셀 거래가 없습니다.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <div key={tx.transactionId} className="p-5">
                    <div className="flex gap-5">
                      <Link to={`/resell/${tx.resellId}`}>
                        <img src={getImageUrl(tx)} alt={tx.productName} className="w-24 h-28 object-cover rounded-xl bg-gray-100" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getTransactionStatusStyle(tx.status)}`}>{getTransactionStatusLabel(tx.status)}</span>
                          {tx.rarityGrade && <span className="text-xs text-purple-700 font-semibold">{tx.rarityGrade}</span>}
                        </div>
                        <Link to={`/resell/${tx.resellId}`} className="font-semibold text-gray-900 mb-1 inline-block hover:underline">{tx.productName}</Link>
                        <p className="text-sm text-gray-500 mb-3">{tx.color || '-'} / {tx.size || '-'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div><p className="text-gray-500">거래가</p><p className="font-bold">{formatPrice(tx.resellPrice)}</p></div>
                          <div><p className="text-gray-500">수수료</p><p className="font-bold">{formatPrice(tx.platformFee)}</p></div>
                          <div><p className="text-gray-500">정산 예정액</p><p className="font-bold text-green-700">{formatPrice(tx.settlementAmount)}</p></div>
                          <div><p className="text-gray-500">송장</p><p className="font-semibold">{tx.trackingNumber || '-'}</p></div>
                          <div><p className="text-gray-500">거래일</p><p className="font-semibold">{formatDate(tx.createdAt)}</p></div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
                          {tx.status === 'PAID' && (
                            <button disabled={processingId === tx.transactionId} onClick={() => handlePrepare(tx)} className="px-4 py-2 rounded-lg bg-[#101828] text-white text-sm font-semibold disabled:opacity-50">배송 준비</button>
                          )}
                          {(tx.status === 'PAID' || tx.status === 'PREPARING_SHIPMENT') && (
                            <button disabled={processingId === tx.transactionId} onClick={() => handleShip(tx)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-1"><Truck className="w-4 h-4" />배송 중</button>
                          )}
                          {tx.status === 'PURCHASE_CONFIRMED' && (
                            <button disabled={processingId === tx.transactionId} onClick={() => handleSettle(tx)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50">정산 완료</button>
                          )}
                          {tx.status !== 'PAID' && tx.status !== 'PREPARING_SHIPMENT' && tx.status !== 'PURCHASE_CONFIRMED' && (
                            <span className="text-xs text-gray-400 self-center">현재 단계에서 처리할 작업이 없습니다.</span>
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
  );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p></div>;
}
