import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MessageSquare, Plus, RefreshCw, Send, Target, TrendingUp, Users } from 'lucide-react';
import {
  createSellerFundingUpdate,
  getFundingParticipationsByCampaign,
  getFundingUpdates,
  getSellerFundings,
  updateSellerFundingProductionStage,
  type FundingCampaignResponse,
  type FundingParticipationResponse,
  type FundingUpdateResponse,
} from '../../api/fundingApi';
import { useAuth } from '../contexts/AuthContext';

const statusTabs = [
  { label: '전체', value: '' },
  { label: '승인 대기', value: 'WAITING' },
  { label: '진행중', value: 'OPEN' },
  { label: '성공', value: 'SUCCESS' },
  { label: '실패', value: 'FAILED' },
  { label: '반려', value: 'REJECTED' },
];

const productionStages = [
  { value: 'PRODUCTION_READY', label: '제작 준비' },
  { value: 'IN_PRODUCTION', label: '제작 중' },
  { value: 'SHIPPING_PREP', label: '배송 준비' },
  { value: 'SHIPPED', label: '배송 완료' },
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

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
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

function participationStatusLabel(status?: string) {
  switch (status) {
    case 'PARTICIPATED': return '참여완료';
    case 'CANCELED': return '참여취소';
    default: return status ?? '-';
  }
}

function productionStageLabel(stage?: string | null, fallback?: string | null) {
  if (fallback) return fallback;
  switch (stage) {
    case 'PRODUCTION_READY': return '제작 준비';
    case 'IN_PRODUCTION': return '제작 중';
    case 'SHIPPING_PREP': return '배송 준비';
    case 'SHIPPED': return '배송 완료';
    default: return '제작 전';
  }
}

function updateTypeLabel(type?: string | null) {
  switch (type) {
    case 'PRODUCTION': return '제작 업데이트';
    case 'SHIPPING': return '배송 업데이트';
    default: return '공지';
  }
}

export function FundingCampaign() {
  const { brandId } = useAuth();
  const [fundings, setFundings] = useState<FundingCampaignResponse[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stageProcessingId, setStageProcessingId] = useState<number | null>(null);
  const [participantCampaign, setParticipantCampaign] = useState<FundingCampaignResponse | null>(null);
  const [participants, setParticipants] = useState<FundingParticipationResponse[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [updateCampaign, setUpdateCampaign] = useState<FundingCampaignResponse | null>(null);
  const [updates, setUpdates] = useState<FundingUpdateResponse[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    updateType: 'PRODUCTION',
    title: '',
    content: '',
    productionStage: '',
  });

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

  const handleStageChange = async (campaignId: number, nextStage: string) => {
    try {
      setStageProcessingId(campaignId);
      await updateSellerFundingProductionStage(campaignId, brandId, nextStage);
      await loadFundings();
    } catch (err) {
      console.error('제작 단계 변경 실패:', err);
      alert(err instanceof Error ? err.message : '제작 단계 변경에 실패했습니다. 성공한 펀딩만 변경할 수 있습니다.');
    } finally {
      setStageProcessingId(null);
    }
  };

  const openParticipants = async (campaign: FundingCampaignResponse) => {
    try {
      setParticipantCampaign(campaign);
      setParticipantsLoading(true);
      const rows = await getFundingParticipationsByCampaign(campaign.campaignId);
      setParticipants(rows);
    } catch (err) {
      console.error('참여자 목록 조회 실패:', err);
      alert('참여자 목록을 불러오지 못했습니다.');
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };


  const openUpdates = async (campaign: FundingCampaignResponse) => {
    try {
      setUpdateCampaign(campaign);
      setUpdatesLoading(true);
      setUpdateForm({
        updateType: campaign.productionStage === 'SHIPPING_PREP' || campaign.productionStage === 'SHIPPED' ? 'SHIPPING' : 'PRODUCTION',
        title: '',
        content: '',
        productionStage: campaign.productionStage || '',
      });
      const rows = await getFundingUpdates(campaign.campaignId);
      setUpdates(rows);
    } catch (err) {
      console.error('펀딩 업데이트 조회 실패:', err);
      alert('공지/업데이트 목록을 불러오지 못했습니다.');
      setUpdates([]);
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleCreateUpdate = async () => {
    if (!updateCampaign) return;

    if (!updateForm.title.trim() || !updateForm.content.trim()) {
      alert('공지 제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setUpdateSubmitting(true);
      await createSellerFundingUpdate(updateCampaign.campaignId, brandId, {
        updateType: updateForm.updateType,
        title: updateForm.title,
        content: updateForm.content,
        productionStage: updateForm.productionStage || updateCampaign.productionStage || null,
      });
      const rows = await getFundingUpdates(updateCampaign.campaignId);
      setUpdates(rows);
      setUpdateForm((prev) => ({ ...prev, title: '', content: '' }));
      alert('펀딩 공지/제작 업데이트가 등록되었습니다.');
    } catch (err) {
      console.error('펀딩 업데이트 등록 실패:', err);
      alert(err instanceof Error ? err.message : '공지/업데이트 등록에 실패했습니다.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">펀딩 관리</h1>
          <p className="text-gray-500 mt-1">내 브랜드의 펀딩 상품 등록 상태와 제작 진행 단계를 확인하세요</p>
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
          <div className="flex flex-wrap gap-2">
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
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">펀딩</th>
                <th className="px-6 py-4 font-medium">목표/현재</th>
                <th className="px-6 py-4 font-medium">진행률</th>
                <th className="px-6 py-4 font-medium">참여자</th>
                <th className="px-6 py-4 font-medium">제작 단계</th>
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
                    <button
                      type="button"
                      onClick={() => openParticipants(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Users className="w-4 h-4" /> {item.participantCount ?? 0}명 보기
                    </button>
                    <p className="mt-2 text-xs text-gray-500">1인 최대 {item.maxPurchasePerUser && item.maxPurchasePerUser > 0 ? `${item.maxPurchasePerUser}개` : '제한 없음'}</p>
                    <button
                      type="button"
                      onClick={() => openUpdates(item)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                    >
                      <MessageSquare className="w-4 h-4" /> 공지/업데이트
                    </button>
                  </td>
                  <td className="px-6 py-5 min-w-[170px]">
                    {item.fundingStatus === 'SUCCESS' ? (
                      <select
                        value={item.productionStage || 'PRODUCTION_READY'}
                        disabled={stageProcessingId === item.campaignId}
                        onChange={(event) => handleStageChange(item.campaignId, event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                      >
                        {productionStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400">성공 후 변경 가능</span>
                    )}
                    <p className="mt-2 text-xs text-gray-500">현재: {productionStageLabel(item.productionStage, item.productionStageLabel)}</p>
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
            <div className="py-20 text-center text-gray-500">표시할 펀딩 상품이 없습니다.</div>
          )}
        </div>
      </div>

      {participantCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">펀딩 참여자 목록</h2>
                <p className="mt-1 text-sm text-gray-500">{participantCampaign.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => { setParticipantCampaign(null); setParticipants([]); }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto p-6">
              {participantsLoading ? (
                <div className="py-12 text-center text-gray-500">참여자 목록을 불러오는 중입니다...</div>
              ) : participants.length === 0 ? (
                <div className="py-12 text-center text-gray-500">아직 참여 내역이 없습니다.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">참여번호</th>
                      <th className="px-4 py-3 font-medium">사용자 ID</th>
                      <th className="px-4 py-3 font-medium">수량</th>
                      <th className="px-4 py-3 font-medium">금액</th>
                      <th className="px-4 py-3 font-medium">상태</th>
                      <th className="px-4 py-3 font-medium">참여일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {participants.map((row) => (
                      <tr key={row.participationId}>
                        <td className="px-4 py-3 font-semibold text-gray-900">#{row.participationId}</td>
                        <td className="px-4 py-3">{row.userId}</td>
                        <td className="px-4 py-3">{row.quantity ?? 1}개</td>
                        <td className="px-4 py-3">{formatCurrency(row.amount)}</td>
                        <td className="px-4 py-3">{participationStatusLabel(row.status)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDateTime(row.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}


      {updateCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">펀딩 공지/제작 업데이트</h2>
                <p className="mt-1 text-sm text-gray-500">{updateCampaign.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => { setUpdateCampaign(null); setUpdates([]); }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
            <div className="grid max-h-[74vh] grid-cols-1 gap-0 overflow-auto lg:grid-cols-[1fr_1.1fr]">
              <div className="border-b border-gray-200 p-6 lg:border-b-0 lg:border-r">
                <h3 className="mb-4 text-base font-bold text-gray-900">새 업데이트 등록</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">구분</label>
                    <select
                      value={updateForm.updateType}
                      onChange={(event) => setUpdateForm((prev) => ({ ...prev, updateType: event.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    >
                      <option value="NOTICE">공지</option>
                      <option value="PRODUCTION">제작 업데이트</option>
                      <option value="SHIPPING">배송 업데이트</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">현재 제작/배송 단계</label>
                    <select
                      value={updateForm.productionStage}
                      onChange={(event) => setUpdateForm((prev) => ({ ...prev, productionStage: event.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    >
                      <option value="">단계 연결 없음</option>
                      {productionStages.map((stage) => (
                        <option key={stage.value} value={stage.value}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
                    <input
                      value={updateForm.title}
                      onChange={(event) => setUpdateForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="예: 원단 발주가 완료되었습니다"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">내용</label>
                    <textarea
                      value={updateForm.content}
                      onChange={(event) => setUpdateForm((prev) => ({ ...prev, content: event.target.value }))}
                      rows={6}
                      placeholder="참여자에게 보여줄 제작 진행 상황이나 배송 안내를 입력하세요."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateUpdate}
                    disabled={updateSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-gray-300"
                  >
                    <Send className="h-4 w-4" /> {updateSubmitting ? '등록 중...' : '업데이트 등록'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-4 text-base font-bold text-gray-900">등록된 업데이트</h3>
                {updatesLoading ? (
                  <div className="py-12 text-center text-gray-500">업데이트를 불러오는 중입니다...</div>
                ) : updates.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">아직 등록된 공지/업데이트가 없습니다.</div>
                ) : (
                  <div className="space-y-3">
                    {updates.map((row) => (
                      <div key={row.updateId} className="rounded-xl border border-gray-200 p-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{row.updateTypeLabel || updateTypeLabel(row.updateType)}</span>
                          {row.productionStageLabel && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{row.productionStageLabel}</span>}
                          <span className="text-xs text-gray-400">{formatDateTime(row.createdAt)}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{row.title}</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">{row.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
