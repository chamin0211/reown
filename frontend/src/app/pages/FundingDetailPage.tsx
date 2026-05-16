/*
DB 관련 설명
- 이 화면은 더미 배열이 아니라 실제 MySQL 데이터를 백엔드 API로 조회합니다.
- 조회 DB 흐름
  1) GET /api/fundings/{campaignId}
     → trade_funding_campaign에서 목표 금액/current_amount/상태 조회
     → catalog_product에서 상품명/가격/이미지 조회
  2) GET /api/products/{productId}
     → catalog_product_option에서 색상/사이즈 옵션 조회
- 참여 DB 흐름
  1) 옵션과 수량을 선택합니다.
  2) 참여 금액 = catalog_product.price × quantity로 계산합니다.
  3) POST /api/fundings/{campaignId}/participate 호출
  4) trade_funding_participation에 user_id, option_id, quantity, unit_price, amount 저장
  5) trade_funding_campaign.current_amount 증가 후 달성률 갱신
*/
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Calendar, CheckCircle2, Clock, Minus, Plus, TrendingUp, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { getProduct } from '../api/productApi';
import type { Product } from '../data/products';
import {
  calculateRemainingDays,
  getFunding,
  getFundingUpdates,
  participateFunding,
  type FundingCampaignResponse,
  type FundingUpdateResponse,
} from '../api/fundingApi';


type FundingOption = NonNullable<Product['options']>[number];

function formatCurrency(value: number | undefined) {
  return `${(value ?? 0).toLocaleString()}원`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

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
    case 'OPEN':
      return '진행중';
    case 'SUCCESS':
      return '성공';
    case 'FAILED':
      return '실패';
    case 'CANCELED':
      return '취소';
    default:
      return status ?? '-';
  }
}

function getProductionStageLabel(stage?: string | null, fallback?: string | null) {
  if (fallback) return fallback;

  switch (stage) {
    case 'PRODUCTION_READY':
      return '제작 준비';
    case 'IN_PRODUCTION':
      return '제작 중';
    case 'SHIPPING_PREP':
      return '배송 준비';
    case 'SHIPPED':
      return '배송 완료';
    default:
      return '제작 전';
  }
}

function getUpdateTypeLabel(type?: string | null, fallback?: string | null) {
  if (fallback) return fallback;

  switch (type) {
    case 'PRODUCTION':
      return '제작 업데이트';
    case 'SHIPPING':
      return '배송 업데이트';
    default:
      return '공지';
  }
}

function getImageUrl(campaign: FundingCampaignResponse) {
  if (campaign.thumbnailUrl && campaign.thumbnailUrl.startsWith('http')) {
    return campaign.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-funding-detail-${campaign.productId}/900/1200`;
}

function getOptionLabel(option: FundingOption) {
  const color = option.color || '기본';
  const size = option.size || 'Free';
  return `${color} / ${size}`;
}

export function FundingDetailPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<FundingCampaignResponse | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [updates, setUpdates] = useState<FundingUpdateResponse[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    const loadFunding = async () => {
      try {
        setLoading(true);
        const campaignData = await getFunding(campaignId);
        setCampaign(campaignData);

        try {
          const updateRows = await getFundingUpdates(campaignId);
          setUpdates(updateRows);
        } catch (updateError) {
          console.error('펀딩 업데이트 조회 실패:', updateError);
          setUpdates([]);
        }

        try {
          const productData = await getProduct(String(campaignData.productId));
          setProduct(productData);
          const firstOption = productData.options?.[0];
          setSelectedOptionId(firstOption?.optionId ?? null);
        } catch (productError) {
          console.error('펀딩 상품 옵션 조회 실패:', productError);
          setProduct(null);
          setSelectedOptionId(null);
        }
      } catch (error) {
        console.error('펀딩 상세 조회 실패:', error);
        alert('펀딩 정보를 불러오지 못했습니다.');
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    loadFunding();
  }, [campaignId]);

  const options = product?.options ?? [];
  const selectedOption = options.find((option) => option.optionId === selectedOptionId) ?? null;
  const remainingDays = useMemo(() => calculateRemainingDays(campaign?.endDate), [campaign?.endDate]);
  const progressRate = campaign ? Math.min(campaign.progressRate, 100) : 0;
  const isOpen = campaign?.fundingStatus === 'OPEN';
  const maxAllowedQuantity = campaign?.maxPurchasePerUser && campaign.maxPurchasePerUser > 0
    ? campaign.maxPurchasePerUser
    : 99;
  const participateAmount = (campaign?.productPrice ?? 0) * quantity;

  const handleQuantityChange = (nextQuantity: number) => {
    const safeQuantity = Number.isFinite(nextQuantity) ? nextQuantity : 1;
    const normalized = Math.max(1, Math.min(maxAllowedQuantity, safeQuantity));
    setQuantity(normalized);
  };

  const handleParticipate = async () => {
    if (!campaign || !campaignId) return;

    const loginUser = getLoginUser();
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (options.length > 0 && !selectedOptionId) {
      alert('펀딩 옵션을 선택해주세요.');
      return;
    }

    if (!isOpen) {
      alert('현재 참여 가능한 펀딩이 아닙니다.');
      return;
    }

    try {
      setSubmitting(true);

      const result = await participateFunding(campaignId, {
        userId: loginUser.userId,
        optionId: selectedOptionId,
        quantity,
        amount: participateAmount,
      });

      setCampaign(result.campaign);
      alert('펀딩 참여가 완료되었습니다. 현재 금액과 달성률이 갱신되었습니다.');
    } catch (error) {
      console.error('펀딩 참여 실패:', error);
      alert(error instanceof Error ? error.message : '펀딩 참여에 실패했습니다. 백엔드 콘솔 또는 펀딩 상태를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-16 text-center text-gray-500">펀딩 정보를 불러오는 중입니다...</main>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">펀딩을 찾을 수 없습니다</h1>
          <Link to="/category/funding" className="text-blue-900 underline">
            펀딩 목록으로 돌아가기
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">FUNDING PROJECT</p>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.productName}</h1>
            </div>
            <Link to="/category/funding" className="text-sm text-blue-900 hover:underline">
              펀딩 목록으로
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={getImageUrl(campaign)}
                  alt={campaign.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <h2 className="text-lg font-semibold text-blue-950 mb-2">펀딩 안내</h2>
                <p className="text-sm text-blue-900 leading-6">
                  목표 금액을 달성하면 펀딩은 성공 처리되고 제작 단계로 넘어갑니다. 종료일까지 목표를
                  달성하지 못하면 실패 처리되며, 진행 중인 펀딩만 참여 취소가 가능합니다.
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
                <h2 className="text-lg font-semibold text-green-950 mb-3">제작/배송 단계</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['PRODUCTION_READY', 'IN_PRODUCTION', 'SHIPPING_PREP', 'SHIPPED'].map((stage) => {
                    const labels: Record<string, string> = {
                      PRODUCTION_READY: '제작 준비',
                      IN_PRODUCTION: '제작 중',
                      SHIPPING_PREP: '배송 준비',
                      SHIPPED: '배송 완료',
                    };
                    const currentStage = campaign.productionStage || 'NOT_STARTED';
                    const order = ['PRODUCTION_READY', 'IN_PRODUCTION', 'SHIPPING_PREP', 'SHIPPED'];
                    const completed = order.indexOf(currentStage) >= order.indexOf(stage);
                    return (
                      <div key={stage} className={`rounded-xl border px-4 py-3 ${completed ? 'border-green-300 bg-white text-green-800' : 'border-gray-200 bg-white/70 text-gray-400'}`}>
                        {labels[stage]}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm text-green-800">
                  현재 단계: <strong>{getProductionStageLabel(campaign.productionStage, campaign.productionStageLabel)}</strong>
                </p>
              </div>


              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-950">공지/제작 업데이트</h2>
                    <p className="mt-1 text-sm text-gray-500">셀러가 등록한 제작 진행 상황과 안내를 확인할 수 있습니다.</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{updates.length}건</span>
                </div>

                {updates.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    아직 등록된 공지나 제작 업데이트가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {updates.slice(0, 5).map((update) => (
                      <div key={update.updateId} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                            {getUpdateTypeLabel(update.updateType, update.updateTypeLabel)}
                          </span>
                          {update.productionStageLabel && (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                              {update.productionStageLabel}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{formatDateTime(update.createdAt)}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{update.title}</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">{update.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit space-y-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-900 px-4 py-1.5 text-sm font-semibold text-white">
                  {getStatusLabel(campaign.fundingStatus)}
                </span>
                {remainingDays !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-700">
                    <Clock className="w-4 h-4" /> D-{remainingDays}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">현재 모금액</p>
                    <p className="text-4xl font-bold text-gray-900">{formatCurrency(campaign.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">달성률</p>
                    <p className="text-3xl font-bold text-blue-900">{campaign.progressRate}%</p>
                  </div>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-blue-900 transition-all" style={{ width: `${progressRate}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">목표 금액</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(campaign.targetAmount)}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">남은 금액</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(campaign.remainingAmount)}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">참여자 수</p>
                    <p className="font-semibold text-gray-900">{campaign.participantCount ?? 0}명</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">1인 최대 수량</p>
                    <p className="font-semibold text-gray-900">{campaign.maxPurchasePerUser && campaign.maxPurchasePerUser > 0 ? `${campaign.maxPurchasePerUser}개` : '제한 없음'}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">시작일</p>
                    <p className="font-semibold text-gray-900">{formatDate(campaign.startDate)}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">종료일</p>
                    <p className="font-semibold text-gray-900">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">상품 단가</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(campaign.productPrice)}</p>
                </div>

                {options.length > 0 ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">옵션 선택</label>
                    <select
                      value={selectedOptionId ?? ''}
                      onChange={(event) => setSelectedOptionId(Number(event.target.value))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-900"
                    >
                      {options.map((option) => (
                        <option key={option.optionId} value={option.optionId}>
                          {getOptionLabel(option)}
                        </option>
                      ))}
                    </select>
                    {selectedOption && (
                      <p className="mt-2 text-xs text-gray-500">
                        선택 옵션 ID: {selectedOption.optionId} · DB 저장 컬럼: trade_funding_participation.option_id
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    등록된 옵션이 없는 펀딩입니다. 옵션 없이 참여 내역이 저장됩니다.
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">수량 선택</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxAllowedQuantity}
                      value={quantity}
                      onChange={(event) => handleQuantityChange(Number(event.target.value))}
                      className="h-10 w-20 rounded-xl border border-gray-300 text-center outline-none focus:border-blue-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxAllowedQuantity}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {campaign.maxPurchasePerUser && campaign.maxPurchasePerUser > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      1인 최대 참여 수량은 {campaign.maxPurchasePerUser}개입니다.
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-gray-900 p-5 text-white">
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
                    <span>계산식</span>
                    <span>{formatCurrency(campaign.productPrice)} × {quantity}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">예상 참여 금액</span>
                    <span className="text-2xl font-bold">{formatCurrency(participateAmount)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleParticipate}
                  disabled={submitting || !isOpen}
                  className="w-full rounded-xl bg-blue-900 py-4 text-base font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitting ? '참여 처리 중...' : isOpen ? '펀딩 참여하기' : '참여 불가'}
                </button>

                {!isOpen && (
                  <p className="rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500">
                    성공/실패/취소/종료된 펀딩은 추가 참여할 수 없습니다.
                  </p>
                )}

                <Link
                  to="/my/funding"
                  className="block w-full rounded-xl border border-gray-300 py-4 text-center text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  내 펀딩 참여 내역 보기
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-gray-200 p-4">
                  <TrendingUp className="mx-auto mb-2 h-5 w-5 text-blue-900" />
                  <p className="text-xs text-gray-500">목표 달성 시 성공</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <Users className="mx-auto mb-2 h-5 w-5 text-blue-900" />
                  <p className="text-xs text-gray-500">참여/취소 DB 반영</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <Calendar className="mx-auto mb-2 h-5 w-5 text-blue-900" />
                  <p className="text-xs text-gray-500">종료일 이후 실패 처리</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <CheckCircle2 className="h-5 w-5 text-blue-900" /> 제작 진행 단계
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. 펀딩 오픈 및 참여자 모집</p>
                  <p>2. 목표 금액 달성 시 성공 처리</p>
                  <p>3. 성공 펀딩은 제작 준비 및 생산 진행</p>
                  <p>4. 목표 미달 상태로 종료되면 실패 처리</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
