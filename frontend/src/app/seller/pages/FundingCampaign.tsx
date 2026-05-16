import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Plus, RefreshCw, Target, TrendingUp } from 'lucide-react';
import { getSellerFundings, type FundingCampaignResponse } from '../../api/fundingApi';
import { useAuth } from '../contexts/AuthContext';

const statusTabs = [
  { label: '전체', value: '' },
  { label: '승인 대기', value: 'WAITING' },
  { label: '진행중', value: 'OPEN' },
  { label: '성공', value: 'SUCCESS' },
  { label: '실패', value: 'FAILED' },
  { label: '반려', value: 'REJECTED' },
];

function formatCurrency(value?: number | null) {
  return `₩${(value ?? 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function statusLabel(status?: string) {
  switch (status) {
    case 'WAITING': return '승인 대기';
    case 'OPEN': return '진행중';
    case 'SUCCESS': return '성공';
    case 'FAILED': return '실패';
    case 'REJECTED': return '반려';
    case 'CANCELED': return '취소';
    default: return status ?? '-';
  }
}

function statusClass(status?: string) {
  switch (status) {
    case 'WAITING': return 'bg-yellow-100 text-yellow-700';
    case 'OPEN': return 'bg-blue-100 text-blue-700';
    case 'SUCCESS': return 'bg-green-100 text-green-700';
    case 'FAILED': return 'bg-gray-200 text-gray-700';
    case 'REJECTED': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function FundingCampaign() {
  const { brandId } = useAuth();
  const [fundings, setFundings] = useState<FundingCampaignResponse[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFundings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSellerFundings(brandId);
      setFundings(data);
    } catch (err) {
      console.error('셀러 펀딩 조회 실패:', err);
      setError('펀딩 데이터를 불러오지 못했습니다. 백엔드가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const filtered = useMemo(() => {
    if (!status) return fundings;
    return fundings.filter((item) => item.fundingStatus === status);
  }, [fundings, status]);

  const summary = useMemo(() => ({
    total: fundings.length,
    waiting: fundings.filter((item) => item.fundingStatus === 'WAITING').length,
    open: fundings.filter((item) => item.fundingStatus === 'OPEN').length,
    success: fundings.filter((item) => item.fundingStatus === 'SUCCESS').length,
    failed: fundings.filter((item) => item.fundingStatus === 'FAILED').length,
    totalParticipants: fundings.reduce((sum, item) => sum + (item.participantCount ?? 0), 0),
    totalCurrentAmount: fundings.reduce((sum, item) => sum + (item.currentAmount ?? 0), 0),
  }), [fundings]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">펀딩 관리</h1>
          <p className="text-gray-500 mt-1">내 브랜드의 펀딩 상품 등록 상태와 진행률을 확인하세요</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadFundings}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> 새로고침
          </button>
          <Link
            to="/seller/funding/new"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Plus className="w-4 h-4" /> 펀딩 등록
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">전체 펀딩</p>
          <p className="mt-3 text-3xl font-bold text-gray-900">{summary.total}건</p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <p className="text-sm text-yellow-700">승인 대기</p>
          <p className="mt-3 text-3xl font-bold text-yellow-800">{summary.waiting}건</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-700">진행중</p>
          <p className="mt-3 text-3xl font-bold text-blue-800">{summary.open}건</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-700">현재 모금액</p>
          <p className="mt-3 text-3xl font-bold text-green-800">{formatCurrency(summary.totalCurrentAmount)}</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
          <p className="text-sm text-purple-700">참여자 수</p>
          <p className="mt-3 text-3xl font-bold text-purple-800">{summary.totalParticipants}명</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div className="flex gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value || 'all'}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`rounded-lg px-4 py-2 text-sm ${status === tab.value ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {loading && <span className="text-sm text-gray-500">불러오는 중...</span>}
        </div>

        {error && <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">펀딩</th>
                <th className="px-6 py-4 font-medium">목표/현재</th>
                <th className="px-6 py-4 font-medium">진행률</th>
                <th className="px-6 py-4 font-medium">참여자</th>
                <th className="px-6 py-4 font-medium">기간</th>
                <th className="px-6 py-4 font-medium">상태</th>
                <th className="px-6 py-4 font-medium">사용자 화면</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.campaignId}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.thumbnailUrl || `https://picsum.photos/seed/reown-funding-${item.productId}/120/160`}
                        alt={item.productName}
                        className="h-20 w-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">상품 ID {item.productId} · 캠페인 ID {item.campaignId}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.categoryName || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-900">{formatCurrency(item.currentAmount)}</p>
                    <p className="text-xs text-gray-500">목표 {formatCurrency(item.targetAmount)}</p>
                  </td>
                  <td className="px-6 py-5 min-w-[180px]">
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                      <span>달성률</span>
                      <span>{item.progressRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(item.progressRate, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-900">{item.participantCount ?? 0}명</p>
                    <p className="text-xs text-gray-500">1인 최대 {item.maxPurchasePerUser && item.maxPurchasePerUser > 0 ? `${item.maxPurchasePerUser}개` : '제한 없음'}</p>
                  </td>
                  <td className="px-6 py-5 text-gray-600">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(item.startDate)}</div>
                    <div className="mt-1 text-xs text-gray-500">~ {formatDate(item.endDate)}</div>
                    <div className="mt-1 text-xs text-gray-500">남은 기간 D-{item.remainingDays ?? 0}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.fundingStatus)}`}>
                      {statusLabel(item.fundingStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {item.fundingStatus === 'OPEN' || item.fundingStatus === 'SUCCESS' ? (
                      <Link to={`/funding/${item.campaignId}`} className="text-blue-700 hover:underline">보기</Link>
                    ) : (
                      <span className="text-xs text-gray-400">승인 후 노출</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-500">
              표시할 펀딩 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
