/*
DB 관련 설명
- 이 화면은 trade_funding_participation 테이블에 저장된 내 펀딩 참여 내역만 조회합니다.
- GET /api/fundings/users/{userId}/participations
  → user_id 기준으로 참여 내역을 조회합니다.
- 각 참여 내역에는 campaign_id, option_id, quantity, unit_price, amount, status가 포함됩니다.
- 취소 버튼을 누르면 PATCH /api/fundings/participations/{participationId}/cancel?userId={userId} 호출
  → trade_funding_participation.status가 CANCELED로 변경됩니다.
  → trade_funding_campaign.current_amount가 참여 금액만큼 차감됩니다.
*/
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import {
  cancelFundingParticipation,
  getFunding,
  getFundingParticipationsByUser,
  type FundingCampaignResponse,
  type FundingParticipationResponse,
} from '../api/fundingApi';

interface LoginUser {
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

interface ParticipationWithCampaign extends FundingParticipationResponse {
  campaign?: FundingCampaignResponse;
}

function formatCurrency(value?: number | null) {
  return `${(value ?? 0).toLocaleString()}원`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status?: string) {
  switch (status) {
    case 'PARTICIPATED':
      return '참여완료';
    case 'CANCELED':
      return '참여취소';
    default:
      return status ?? '-';
  }
}

export function MyFundingPage() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [items, setItems] = useState<ParticipationWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const loadItems = async (userId: number) => {
    setLoading(true);

    try {
      const participations = await getFundingParticipationsByUser(userId);
      const withCampaign = await Promise.all(
        participations.map(async (participation) => {
          try {
            const campaign = await getFunding(participation.campaignId);
            return { ...participation, campaign };
          } catch (error) {
            console.error('펀딩 캠페인 조회 실패:', error);
            return participation;
          }
        })
      );

      setItems(withCampaign);
    } catch (error) {
      console.error('내 펀딩 참여 내역 조회 실패:', error);
      alert('내 펀딩 참여 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('loginUser');

    if (!savedUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(savedUser) as LoginUser;
    setLoginUser(parsedUser);
    loadItems(parsedUser.userId);
  }, [navigate]);

  const handleCancel = async (participationId: number) => {
    if (!loginUser) return;

    const ok = window.confirm('이 펀딩 참여를 취소할까요? 취소하면 캠페인 현재 금액과 달성률이 차감됩니다.');
    if (!ok) return;

    try {
      setCancelingId(participationId);
      await cancelFundingParticipation(participationId, loginUser.userId);
      alert('펀딩 참여가 취소되었습니다.');
      await loadItems(loginUser.userId);
    } catch (error) {
      console.error('펀딩 참여 취소 실패:', error);
      alert('펀딩 참여 취소에 실패했습니다. 이미 취소되었거나 취소할 수 없는 상태일 수 있습니다.');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">MY FUNDING</p>
              <h1 className="text-3xl font-bold text-gray-900">내 펀딩 참여 내역</h1>
              <p className="mt-2 text-sm text-gray-500">
                내가 참여한 펀딩만 조회하고, 진행 중인 참여 내역은 취소할 수 있습니다.
              </p>
            </div>
            <Link to="/category/funding" className="rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">
              펀딩 더 보기
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">참여 내역을 불러오는 중입니다...</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 py-20 text-center">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">아직 참여한 펀딩이 없습니다</h2>
              <p className="mb-6 text-gray-500">펀딩 프로젝트에 참여하면 이곳에서 내역을 확인할 수 있습니다.</p>
              <Link to="/category/funding" className="text-blue-900 underline">
                펀딩 목록으로 이동
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const campaign = item.campaign;
                const progressRate = campaign ? Math.min(campaign.progressRate, 100) : 0;
                const isCanceled = item.status === 'CANCELED';
                const canCancel = !isCanceled && campaign?.fundingStatus === 'OPEN';

                return (
                  <div key={item.participationId} className="rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">참여번호 #{item.participationId}</p>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {campaign?.productName ?? `캠페인 #${item.campaignId}`}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">참여일: {formatDate(item.createdAt)}</p>
                      </div>
                      <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${isCanceled ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-900'}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">내 참여 금액</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">수량</p>
                        <p className="font-semibold text-gray-900">{item.quantity ?? 1}개</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">단가</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.unitPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">옵션 ID</p>
                        <p className="font-semibold text-gray-900">{item.optionId ?? '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">펀딩 상태</p>
                        <p className="font-semibold text-blue-900">{campaign?.fundingStatus ?? '-'}</p>
                      </div>
                    </div>

                    {campaign && (
                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">현재 금액</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(campaign.currentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">목표 금액</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(campaign.targetAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">달성률</p>
                          <p className="font-semibold text-blue-900">{campaign.progressRate}%</p>
                        </div>
                      </div>
                    )}

                    {campaign && (
                      <div className="mt-5">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-blue-900" style={{ width: `${progressRate}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex justify-end gap-3">
                      <Link to={`/funding/${item.campaignId}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                        상세 보기
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleCancel(item.participationId)}
                        disabled={!canCancel || cancelingId === item.participationId}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {cancelingId === item.participationId ? '취소 처리 중...' : isCanceled ? '취소 완료' : '참여 취소'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
