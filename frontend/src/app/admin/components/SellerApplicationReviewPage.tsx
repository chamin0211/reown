import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, Building2, User, Mail, Phone, CreditCard, ExternalLink, FileText, Download, Eye } from 'lucide-react';

interface ApplicationData {
  id: string;
  category: 'DOMESTIC' | 'DESIGNER';
  purpose: 'FUNDING_ONLY' | 'FULL_STORE';
  brandName: string;
  businessNumber: string;
  representativeName: string;
  email: string;
  phone: string;
  settlementAccount: string;
  bankName: string;
  businessLicenseUrl: string;
  // For Domestic Brands
  officialWebsite?: string;
  salesChannels?: string[];
  // For Designer Brands
  portfolioImages?: string[];
  brandPhilosophy?: string;
  applicationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const mockApplicationData: ApplicationData = {
  id: 'APP-2024-012',
  category: 'DESIGNER',
  purpose: 'FULL_STORE',
  brandName: '럭셔리 컬렉션',
  businessNumber: '123-45-67890',
  representativeName: '김명품',
  email: 'luxury@example.com',
  phone: '010-1234-5678',
  settlementAccount: '1234-5678-9012',
  bankName: '신한은행',
  businessLicenseUrl: 'https://via.placeholder.com/400x300',
  portfolioImages: [
    'https://via.placeholder.com/300x300/1e40af/ffffff?text=Design+1',
    'https://via.placeholder.com/300x300/6366f1/ffffff?text=Design+2',
    'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Design+3',
    'https://via.placeholder.com/300x300/d946ef/ffffff?text=Design+4',
  ],
  brandPhilosophy: '우리는 지속 가능한 패션을 추구하며, 전통적인 장인 정신과 현대적인 디자인을 결합하여 독창적인 럭셔리 제품을 만들어냅니다. 각 제품은 수작업으로 제작되며, 최고급 소재만을 사용합니다.',
  applicationDate: '2024.03.27',
  status: 'PENDING',
};

export function SellerApplicationReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application] = useState<ApplicationData>(mockApplicationData);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleApproveAsDesigner = () => {
    if (window.confirm('디자이너 브랜드로 승인하시겠습니까?')) {
      alert('디자이너 브랜드로 승인되었습니다.');
      navigate('/seller/onboarding');
    }
  };

  const handleApproveAsRegular = () => {
    if (window.confirm('일반 브랜드로 승인하시겠습니까?')) {
      alert('일반 브랜드로 승인되었습니다.');
      navigate('/seller/onboarding');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (window.confirm('이 신청을 반려하시겠습니까?')) {
      alert('신청이 반려되었습니다.');
      navigate('/seller/onboarding');
    }
  };

  const getCategoryBadge = (category: string) => {
    return category === 'DOMESTIC' 
      ? { label: '국내 브랜드', style: 'bg-blue-100 text-blue-700 border-blue-300' }
      : { label: '디자이너 브랜드', style: 'bg-purple-100 text-purple-700 border-purple-300' };
  };

  const getPurposeBadge = (purpose: string) => {
    return purpose === 'FUNDING_ONLY'
      ? { label: '펀딩 전용', style: 'bg-green-100 text-green-700 border-green-300' }
      : { label: '정식 입점', style: 'bg-indigo-100 text-indigo-700 border-indigo-300' };
  };

  const categoryInfo = getCategoryBadge(application.category);
  const purposeInfo = getPurposeBadge(application.purpose);

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8 pb-32">
        {/* Back Button */}
        <button
          onClick={() => navigate('/seller/onboarding')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          입점 신청 목록으로
        </button>

        {/* Header with Tags */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Partnership Application Review</h1>
              <p className="text-gray-600 mb-4">신청 ID: <span className="font-semibold text-blue-600">{application.id}</span></p>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-lg border-2 ${categoryInfo.style}`}>
                  {categoryInfo.label}
                </span>
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-lg border-2 ${purposeInfo.style}`}>
                  {purposeInfo.label}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">신청일</p>
              <p className="text-lg font-semibold text-gray-900">{application.applicationDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column - Standard Business Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 size={24} className="text-blue-600" />
                기본 사업자 정보
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">브랜드명</label>
                  <p className="text-base font-semibold text-gray-900">{application.brandName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">사업자등록번호</label>
                  <p className="text-base text-gray-900">{application.businessNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">대표자명</label>
                  <p className="text-base text-gray-900 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {application.representativeName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">이메일</label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {application.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1.5 block">연락처</label>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {application.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">정산 계좌 정보</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">은행명</p>
                    <p className="text-base font-semibold text-gray-900 mb-2">{application.bankName}</p>
                    <p className="text-sm text-gray-600 mb-1">계좌번호</p>
                    <p className="text-base font-mono text-gray-900 flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      {application.settlementAccount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business License - File Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                사업자등록증
              </h3>
              
              {/* Professional File Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-3 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-5">
                  {/* PDF Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <FileText size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* File Details */}
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-900 mb-1">사업자등록증.pdf</p>
                    <p className="text-sm text-gray-500">Uploaded: {application.applicationDate}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF Document • 1.2 MB</p>
                  </div>
                  
                  {/* View Button */}
                  <button
                    onClick={() => window.open(application.businessLicenseUrl, '_blank')}
                    className="flex-shrink-0 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-xl flex items-center gap-2 group"
                  >
                    <Eye size={20} className="group-hover:scale-110 transition-transform" />
                    <span>열기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Conditional Verification */}
          <div className="space-y-6">
            {application.category === 'DOMESTIC' ? (
              // For Domestic Brands
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ExternalLink size={24} className="text-blue-600" />
                  브랜드 검증 정보
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">공식 웹사이트</label>
                    <a 
                      href={application.officialWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {application.officialWebsite || 'https://luxurycollection.com'}
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">현재 판매 채널</label>
                    <div className="space-y-2">
                      {(application.salesChannels || ['무신사', '29CM', '자사몰']).map((channel, index) => (
                        <div key={index} className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900">{channel}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">검증 안내</p>
                    <p className="text-xs text-yellow-700">
                      공식 웹사이트 및 판매 채널을 확인하여 브랜드 신뢰성을 검증해주세요.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // For Designer Brands
              <>
                {/* Designer Portfolio - File Card (CRITICAL) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Download size={24} className="text-purple-600" />
                    디자이너 포트폴리오
                  </h2>
                  
                  {/* Professional Attachment Box */}
                  <div className="bg-gradient-to-br from-purple-50 to-white border-3 border-purple-200 rounded-xl p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-200">
                    <div className="flex flex-col items-center text-center">
                      {/* Large Red PDF Icon */}
                      <div className="w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl mb-5 transform hover:scale-105 transition-transform">
                        <FileText size={48} className="text-white" strokeWidth={2.5} />
                      </div>
                      
                      {/* File Name */}
                      <p className="text-lg font-bold text-gray-900 mb-2">reown_portfolio_v1.pdf</p>
                      <p className="text-sm text-gray-500 mb-1">Designer Portfolio Document</p>
                      <p className="text-xs text-gray-400 mb-6">PDF Document • 8.5 MB • 24 pages</p>
                      
                      {/* High-Contrast Button */}
                      <button
                        onClick={() => window.open('#', '_blank')}
                        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group text-lg"
                      >
                        <Eye size={24} className="group-hover:scale-110 transition-transform" />
                        <span>포트폴리오 바로보기</span>
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-4 italic">※ 새 탭에서 PDF가 열립니다</p>
                    </div>
                  </div>
                </div>

                {/* Brand Identity Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <ExternalLink size={24} className="text-purple-600" />
                    브랜드 아이덴티티
                  </h2>
                  
                  {/* Brand Philosophy */}
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Brand Philosophy</label>
                    <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {application.brandPhilosophy}
                      </p>
                    </div>
                  </div>
                  
                  {/* Official SNS/Website */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Official SNS / Website</label>
                    <div className="space-y-2">
                      <a 
                        href="https://instagram.com/luxurycollection" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg hover:border-pink-400 hover:shadow-md transition-all group"
                      >
                        <ExternalLink size={18} className="text-pink-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold text-gray-800">@luxurycollection</span>
                        <span className="ml-auto text-xs text-gray-500">Instagram</span>
                      </a>
                      
                      <a 
                        href="https://luxurycollection.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <ExternalLink size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold text-gray-800">luxurycollection.com</span>
                        <span className="ml-auto text-xs text-gray-500">Official Site</span>
                      </a>
                    </div>
                  </div>

                  {/* Designer Benefits */}
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-5 rounded-lg border-2 border-purple-300 mt-5">
                    <p className="text-sm font-bold text-purple-900 mb-2">💎 디자이너 브랜드 특별 혜택</p>
                    <ul className="text-xs text-purple-800 space-y-2 ml-4 list-disc">
                      <li className="font-medium">플랫폼 메인 페이지 '디자이너 존' 노출</li>
                      <li className="font-medium">수수료 우대 (일반 15% → 디자이너 10%)</li>
                      <li className="font-medium">전용 마케팅 지원</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
          <div className="max-w-[calc(100vw-16rem)] mx-auto px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">신청 검토 중</p>
              <p className="text-lg font-bold text-gray-900">{application.brandName}</p>
            </div>

            <div className="flex items-center gap-3">
              {application.category === 'DESIGNER' && (
                <button
                  onClick={handleApproveAsDesigner}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  디자이너 브랜드 승인
                </button>
              )}
              
              <button
                onClick={handleApproveAsRegular}
                className="px-6 py-3 bg-[#1e40af] text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
              >
                <CheckCircle size={20} />
                일반 브랜드 승인
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

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">반려 사유 입력</h2>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="신청자에게 전달될 반려 사유를 입력해주세요..."
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <div className="flex gap-3 mt-6">
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