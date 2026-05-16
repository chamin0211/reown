import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, TrendingUp, XCircle } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { approveFunding, getAdminFundings, rejectFunding, type FundingCampaignResponse } from '../../api/fundingApi';

const tabs = [
  { label: '전체', value: '' },
  { label: '승인 대기', value: 'WAITING' },
  { label: '진행중', value: 'OPEN' },
  { label: '성공', value: 'SUCCESS' },
  { label: '실패', value: 'FAILED' },
  { label: '반려', value: 'REJECTED' },
];

function isVisibleFunding(item: FundingCampaignResponse) {
  return item.fundingStatus !== 'CANCELED' && item.productStatus !== 'DELETED';
}

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

export function FundingManagementPage() {
  const [fundings, setFundings] = useState<FundingCampaignResponse[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadFundings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminFundings();
      setFundings(data);
    } catch (err) {
      console.error('관리자 펀딩 조회 실패:', err);
      setError('펀딩 데이터를 불러오지 못했습니다. 백엔드 실행 상태를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundings();
  }, []);

  const visibleFundings = useMemo(() => fundings.filter(isVisibleFunding), [fundings]);

  const filtered = useMemo(() => {
    if (!status) return visibleFundings;
    return visibleFundings.filter((item) => item.fundingStatus === status);
  }, [visibleFundings, status]);

  const summary = useMemo(() => ({
    total: visibleFundings.length,
    waiting: visibleFundings.filter((item) => item.fundingStatus === 'WAITING').length,
    open: visibleFundings.filter((item) => item.fundingStatus === 'OPEN').length,
    success: visibleFundings.filter((item) => item.fundingStatus === 'SUCCESS').length,
    failed: visibleFundings.filter((item) => item.fundingStatus === 'FAILED').length,
    participantCount: visibleFundings.reduce((sum, item) => sum + (item.participantCount ?? 0), 0),
    currentAmount: visibleFundings.reduce((sum, item) => sum + (item.currentAmount ?? 0), 0),
  }), [visibleFundings]);

  const handleApprove = async (campaignId: number) => {
    if (!confirm('이 펀딩 프로젝트를 승인하고 사용자 펀딩 목록에 노출할까요?')) return;
    try {
      setProcessingId(campaignId);
      await approveFunding(campaignId);
      await loadFundings();
    } catch (err) {
      console.error('펀딩 승인 실패:', err);
      alert('펀딩 승인에 실패했습니다. 백엔드 콘솔을 확인해주세요.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (campaignId: number) => {
    if (!confirm('이 펀딩 프로젝트를 반려할까요? 반려된 펀딩은 사용자 화면에 노출되지 않습니다.')) return;
    try {
      setProcessingId(campaignId);
      await rejectFunding(campaignId);
      await loadFundings();
    } catch (err) {
      console.error('펀딩 반려 실패:', err);
      alert('펀딩 반려에 실패했습니다. 백엔드 콘솔을 확인해주세요.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 min-h-screen p-8 space-y-8 overflow-x-hidden">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">펀딩 관리</h1>
            <p className="text-gray-500 mt-2">셀러가 등록한 펀딩 프로젝트를 조회하고 승인/반려합니다</p>
          </div>
          <button
            type="button"
            onClick={loadFundings}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> 새로고침
          </button>
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
            <p className="text-sm text-green-700">전체 모금액</p>
            <p className="mt-3 text-3xl font-bold text-green-800">{formatCurrency(summary.currentAmount)}</p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <p className="text-sm text-purple-700">참여자 수</p>
            <p className="mt-3 text-3xl font-bold text-purple-800">{summary.participantCount}명</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
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
            <table className="min-w-[1120px] w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="w-[340px] px-6 py-4 font-medium">펀딩 프로젝트</th>
                  <th className="px-6 py-4 font-medium">셀러/브랜드</th>
                  <th className="px-6 py-4 font-medium">목표/현재</th>
                  <th className="px-6 py-4 font-medium">진행률</th>
                  <th className="px-6 py-4 font-medium">참여자</th>
                  <th className="px-6 py-4 font-medium">기간</th>
                  <th className="px-6 py-4 font-medium">상태</th>
                  <th className="w-[140px] px-6 py-4 font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.campaignId}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.thumbnailUrl || `https://picsum.photos/seed/reown-funding-admin-${item.productId}/120/160`}
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
                      <p className="font-medium text-gray-900">{item.brandName || `Brand #${item.brandId ?? '-'}`}</p>
                      <p className="text-xs text-gray-500">brand_id {item.brandId ?? '-'}</p>
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
                      <p className="text-xs text-gray-500">남은 기간 D-{item.remainingDays ?? 0}</p>
                    </td>
                    <td className="px-6 py-5 text-gray-600">
                      {formatDate(item.startDate)}<br />
                      <span className="text-xs text-gray-500">~ {formatDate(item.endDate)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.fundingStatus)}`}>
                        {statusLabel(item.fundingStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {item.fundingStatus === 'WAITING' ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={processingId === item.campaignId}
                            onClick={() => handleApprove(item.campaignId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:bg-gray-300"
                          >
                            <CheckCircle2 className="w-3 h-3" /> 승인
                          </button>
                          <button
                            type="button"
                            disabled={processingId === item.campaignId}
                            onClick={() => handleReject(item.campaignId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:bg-gray-300"
                          >
                            <XCircle className="w-3 h-3" /> 반려
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <TrendingUp className="w-4 h-4" /> 처리 완료
                        </div>
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
      </main>
    </div>
  );
}
