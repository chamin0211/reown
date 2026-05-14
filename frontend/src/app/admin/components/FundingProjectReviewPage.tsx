import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, Edit3, Calendar, DollarSign, TrendingUp, Package, Truck, Clock, AlertTriangle } from 'lucide-react';

interface ProductionStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface FundingProject {
  id: string;
  projectId: string;
  brandName: string;
  sellerName: string;
  projectTitle: string;
  heroImage: string;
  fundingStory: {
    type: 'text' | 'image';
    content: string;
  }[];
  targetAmount: number;
  startDate: string;
  endDate: string;
  expectedDelivery: string;
  productionTimeline: ProductionStep[];
  deliveryCompensation: string;
  submittedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
}

const mockFundingProject: FundingProject = {
  id: 'FP-2024-008',
  projectId: 'FD-2024-008',
  brandName: 'Noir Archive',
  sellerName: '박세준',
  projectTitle: 'Heritage Biker Jacket - 장인의 손으로 빚어낸 프리미엄 레더 재킷',
  heroImage: 'https://images.unsplash.com/photo-1773217515996-4c2790f91159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBibGFjayUyMGxlYXRoZXIlMjBqYWNrZXQlMjBkZXNpZ25lcnxlbnwxfHx8fDE3NzQ3MjQwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  fundingStory: [
    { type: 'text', content: '안녕하세요, Noir Archive의 크리에이티브 디렉터 박세준입니다. 저희는 2015년부터 서울에서 전통적인 가죽 공예 기법과 현대적인 실루엣을 결합한 타임리스 아이템을 만들어왔습니다. 이번 Heritage Biker Jacket은 3년간의 연구 끝에 완성한 우리의 시그니처 피스로, 빈티지 바이커 재킷의 클래식한 감성과 모던 테일러링이 조화를 이룬 작품입니다. 단순히 옷이 아닌, 세월이 지날수록 가치가 깊어지는 투자 아이템으로 기획되었습니다.' },
    { type: 'image', content: 'https://images.unsplash.com/photo-1764391791965-e57ac12cbb80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbGVhdGhlciUyMGNyYWZ0c21hbnNoaXAlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzQ2NDM1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { type: 'text', content: '소재는 이탈리아 토스카나 지역의 100년 전통 태너리에서 6개월간 식물성 무두질(Vegetable Tanning)한 풀그레인 가죽만을 사용합니다. 화학 처리를 최소화하여 가죽 본연의 결과 숨결이 살아있으며, 착용할수록 몸에 맞춰지는 에이징 효과를 경험하실 수 있습니다. YKK 최고급 메탈 지퍼, 퀼팅 안감, 그리고 손목과 허리의 조절 가능한 벨트 디테일까지 모든 요소가 장인의 손으로 조립됩니다.' },
    { type: 'image', content: 'https://images.unsplash.com/photo-1564842505181-8862a3b9b173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwbGVhdGhlciUyMHRleHR1cmUlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NDcyNDAxOXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { type: 'text', content: '펀딩 목표 금액 5천만 원은 50벌 한정 제작을 위한 원자재 수급과 장인 인건비로 투명하게 사용됩니다. 펀딩 참여자분들께는 제품 배송 시 고유 시리얼 넘버가 각인된 금속 플레이트와 정품 인증서, 그리고 평생 무상 수선 서비스를 제공합니다. 10년, 20년이 지나도 당신 곁에 남을 진짜 명품을 함께 만들어주세요.' },
    { type: 'image', content: 'https://images.unsplash.com/photo-1758959274047-b8a8b51be3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzZXdpbmclMjBsZWF0aGVyfGVufDF8fHx8MTc3NDcyNDAyMHww&ixlib=rb-4.1.0&q=80&w=1080' },
  ],
  targetAmount: 50000000,
  startDate: '2024.04.01',
  endDate: '2024.06.30',
  expectedDelivery: '2024.09.15',
  productionTimeline: [
    { id: 1, title: '원자재 확보', description: '이탈리아 토스카나 태너리로부터 풀그레인 가죽 수입 및 검수', duration: '3주', status: 'completed' },
    { id: 2, title: '패턴 제작 & 샘플링', description: '사이즈별 패턴 제작 및 마스터 샘플 완성', duration: '2주', status: 'pending' },
    { id: 3, title: '본 생산', description: '50벌 한정 수작업 제작 (재단, 봉제, 조립)', duration: '6주', status: 'pending' },
    { id: 4, title: '품질 검수 & 마감', description: '전수 검사, 시리얼 넘버 각인, 정품 인증서 발급', duration: '1주', status: 'pending' },
    { id: 5, title: '포장 & 배송', description: '프리미엄 박스 패키징 및 순차 배송', duration: '2주', status: 'pending' },
  ],
  deliveryCompensation: '예상 배송일(2024년 9월 15일)로부터 2주 이상 지연 시, 펀딩 금액의 15%를 적립금으로 보상합니다. 1개월 이상 지연 시에는 전액 환불을 보장하며, 추가로 위약금 30만 원을 지급합니다. 장인 제작 특성상 불가항력적 지연 발생 시, 사전 공지 후 합의를 통해 조정 가능합니다.',
  submittedDate: '2024.03.27',
  status: 'PENDING',
};

export function FundingProjectReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project] = useState<FundingProject>(mockFundingProject);
  const [adminNotes, setAdminNotes] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [launchDateTime, setLaunchDateTime] = useState('');
  const [revisionComment, setRevisionComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    if (!launchDateTime) {
      alert('펀딩 시작 일시를 선택해주세요.');
      return;
    }
    if (window.confirm('이 펀딩 프로젝트를 승인하고 예약 오픈하시겠습니까?')) {
      alert(`펀딩이 승인되었습니다. 오픈 예정: ${launchDateTime}`);
      navigate('/funding');
    }
  };

  const handleRequestRevision = () => {
    if (!revisionComment.trim()) {
      alert('수정 요청 사항을 입력해주세요.');
      return;
    }
    if (window.confirm('셀러에게 수정을 요청하시겠습니까?')) {
      alert('수정 요청이 전송되었습니다.');
      navigate('/funding');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (window.confirm('이 펀딩 프로젝트를 반려하시겠습니까?')) {
      alert('펀딩이 반려되었습니다.');
      navigate('/funding');
    }
  };

  const getStepIcon = (index: number) => {
    const icons = [Clock, Package, TrendingUp, CheckCircle, Truck];
    const Icon = icons[index] || Clock;
    return <Icon size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8 pb-32">
        {/* Back Button */}
        <button
          onClick={() => navigate('/funding')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          펀딩 관리로
        </button>

        {/* Header */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Funding Mgmt &gt; Pending Approval &gt; {project.projectTitle}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Funding Project Audit</h1>
              <p className="text-gray-600 mb-4">
                프로젝트 ID: <span className="font-semibold text-blue-600">{project.projectId}</span>
                {' • '}
                브랜드: <span className="font-semibold">{project.brandName}</span>
                {' ('}
                <span className="text-purple-600 font-semibold">디자이너 등급</span>
                {')'}
              </p>
              <span className="inline-flex px-5 py-2.5 text-base font-bold rounded-xl border-2 bg-yellow-100 text-yellow-800 border-yellow-400 shadow-md">
                ⏱ WAITING FOR APPROVAL
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">제출일</p>
              <p className="text-lg font-semibold text-gray-900">{project.submittedDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column - Funding Content */}
          <div className="space-y-6">
            {/* Hero Image & Title */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={project.heroImage} 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">{project.projectTitle}</h2>
              </div>
            </div>

            {/* Funding Story */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">펀딩 스토리</h3>
              <div className="space-y-4">
                {project.fundingStory.map((block, index) => (
                  <div key={index}>
                    {block.type === 'text' ? (
                      <p className="text-gray-800 leading-relaxed">{block.content}</p>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={block.content} 
                          alt={`Story ${index}`} 
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">프로젝트 상세</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-blue-600" />
                    <p className="text-sm font-semibold text-blue-900">목표 금액</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    ₩{(project.targetAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">펀딩 기간</p>
                  </div>
                  <p className="text-sm font-bold text-purple-700">{project.startDate}</p>
                  <p className="text-sm font-bold text-purple-700">~ {project.endDate}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={20} className="text-green-600" />
                    <p className="text-sm font-semibold text-green-900">예상 배송일</p>
                  </div>
                  <p className="text-xl font-bold text-green-700">{project.expectedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Production Timeline */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">제작 공정 타임라인</h3>
              <div className="space-y-4">
                {project.productionTimeline.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getStepIcon(index)}
                      </div>
                      {index < project.productionTimeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                        <span className="text-sm font-semibold text-blue-600">{step.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Safety & Verification */}
          <div className="space-y-6">
            {/* Status Badge (Sticky) */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300 shadow-lg sticky top-8">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={24} className="text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">심사 대기 중</h3>
              </div>
              <p className="text-sm text-gray-700">
                이 펀딩 프로젝트는 현재 관리자 승인을 기다리고 있습니다. 
                프로젝트 내용과 위험 평가를 검토한 후 승인/수정요청/반려를 결정해주세요.
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-orange-600" />
                위험 평가 & 보상 계획
              </h3>
              
              <div className="bg-orange-50 p-5 rounded-lg border border-orange-200 mb-4">
                <h4 className="font-bold text-orange-900 mb-2">배송 지연 보상 정책</h4>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {project.deliveryCompensation}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="risk1" 
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="risk1" className="text-sm text-gray-700">
                    보상 계획이 명확하고 실현 가능함
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="risk2" 
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="risk2" className="text-sm text-gray-700">
                    제작 타임라인이 현실적임
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="risk3" 
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="risk3" className="text-sm text-gray-700">
                    목표 금액이 프로젝트 규모에 적합함
                  </label>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Edit3 size={20} className="text-blue-600" />
                관리자 내부 메모
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                이 메모는 셀러에게 보이지 않으며, 내부 검토용입니다.
              </p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="검토 내용, 우려사항, 특이사항 등을 기록하세요..."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
                  메모 저장
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3">셀러 정보</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700"><span className="font-semibold">브랜드:</span> {project.brandName}</p>
                <p className="text-gray-700"><span className="font-semibold">담당자:</span> {project.sellerName}</p>
                <p className="text-gray-700"><span className="font-semibold">이전 펀딩 성공률:</span> 94% (15건 중 14건 성공)</p>
                <p className="text-gray-700"><span className="font-semibold">평균 달성률:</span> 127%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
          <div className="max-w-[calc(100vw-16rem)] mx-auto px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">펀딩 검토 중</p>
              <p className="text-lg font-bold text-gray-900">{project.projectTitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
              >
                <CheckCircle size={20} />
                승인 & 오픈 예약
              </button>

              <button
                onClick={() => setShowRevisionModal(true)}
                className="px-6 py-3 bg-[#1e40af] text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Edit3 size={20} />
                수정 요청
              </button>

              <button
                onClick={() => setShowRejectionModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
              >
                <XCircle size={20} />
                반려
              </button>
            </div>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">펀딩 오픈 일시 설정</h2>
              <p className="text-gray-600 mb-4">승인 후 펀딩이 시작될 정확한 일시를 선택해주세요.</p>
              <input
                type="datetime-local"
                value={launchDateTime}
                onChange={(e) => setLaunchDateTime(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="text-sm text-green-800">
                  <strong>알림:</strong> 설정된 일시에 자동으로 펀딩이 오픈되며, 셀러와 고객에게 알림이 발송됩니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  승인 확정
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revision Request Modal */}
        {showRevisionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">수정 요청 사항</h2>
              <p className="text-gray-600 mb-4">셀러에게 전달될 수정 요청 내용을 작성해주세요.</p>
              <textarea
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                placeholder="예: 제작 타임라인을 더 구체적으로 작성해주세요. 배송 보상 정책을 보강해주세요."
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              />
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>안내:</strong> 수정 요청 후 셀러가 내용을 수정하면 다시 검토 대기 상태로 돌아옵니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleRequestRevision}
                  className="flex-1 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">반려 사유 입력</h2>
              <p className="text-gray-600 mb-4">셀러에게 전달될 반려 사유를 입력해주세요.</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="예: 목표 금액이 비현실적입니다. 제작 타임라인이 불명확합니다."
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
              />
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                <p className="text-sm text-red-800">
                  <strong>경고:</strong> 반려 후에는 셀러가 새로운 프로젝트를 다시 제출해야 합니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  반려 확정
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}