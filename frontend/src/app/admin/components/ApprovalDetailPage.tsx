import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, Package, Award, AlertCircle } from 'lucide-react';

interface ApprovalDetail {
  id: string;
  productName: string;
  seller: string;
  sellerEmail: string;
  sellerPhone: string;
  brand: string;
  category: string;
  productType: '일반' | '디자이너 한정판';
  price: string;
  applicationDate: string;
  description: string;
  images: string[];
  designerInfo?: {
    designerName: string;
    signatureImage: string;
    editionNumber: string;
    totalEditions: number;
    certificateImage: string;
  };
  authenticationInfo: {
    receiptIncluded: boolean;
    serialNumber: string;
    purchaseLocation: string;
    purchaseDate: string;
  };
}

const mockApproval: ApprovalDetail = {
  id: 'RQ-2024-046',
  productName: '구찌 GG 마몽 크로스백',
  seller: '박셀러',
  sellerEmail: 'seller@example.com',
  sellerPhone: '010-1234-5678',
  brand: 'Gucci',
  category: '가방',
  productType: '디자이너 한정판',
  price: '₩1,240,000',
  applicationDate: '2024.03.27 13:15',
  description: `럭셔리 브랜드 구찌의 시그니처 아이템인 GG 마몽 크로스백입니다.

제품 상세:
- 모델명: GG Marmont Matelassé Mini Bag
- 색상: 블랙
- 소재: 마틀라세 쉐브론 레더
- 크기: 가로 24cm x 세로 13cm x 너비 7cm
- 구성품: 더스트백, 정품카드, 보증서 포함

상태:
구매 후 2회 착용한 제품으로 거의 새것과 같은 상태입니다.
금장 하드웨어는 스크래치 없이 깨끗하며, 레더 표면도 손상이나 오염이 전혀 없습니다.`,
  images: [
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564422167509-4f3777a58db7?w=800&h=600&fit=crop',
  ],
  designerInfo: {
    designerName: 'Alessandro Michele',
    signatureImage: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=200&fit=crop',
    editionNumber: '023',
    totalEditions: 100,
    certificateImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
  },
  authenticationInfo: {
    receiptIncluded: true,
    serialNumber: 'GG-498204-2023',
    purchaseLocation: '구찌 공식 매장 (강남점)',
    purchaseDate: '2023.08.15',
  },
};

export function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const approval = mockApproval;

  const handleApprove = () => {
    if (confirm('이 상품을 최종 승인하시겠습니까?\n승인 후 상품은 즉시 판매 가능 상태가 됩니다.')) {
      alert('상품이 승인되었습니다.');
      navigate('/review-queue');
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (confirm('이 상품을 반려하시겠습니까?\n반려 사유가 셀러에게 전송됩니다.')) {
      alert(`상품이 반려되었습니다.\n사유: ${rejectReason}`);
      setShowRejectModal(false);
      navigate('/review-queue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/review-queue')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">상품 승인 상세</h1>
              <p className="text-gray-500 mt-1">검토 ID: {approval.id}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <XCircle size={20} />
              반려
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={20} />
              최종 승인
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Side: Product Details (2/3) */}
          <div className="col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상품 이미지</h2>
              
              <div className="mb-4">
                <img
                  src={approval.images[selectedImage]}
                  alt={approval.productName}
                  className="w-full h-[480px] object-cover rounded-xl border border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {approval.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${approval.productName} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상세 설명</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {approval.description}
              </div>
            </div>

            {/* Authentication Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">정품 인증 정보</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">시리얼 넘버</p>
                  <p className="text-lg font-bold text-gray-900">{approval.authenticationInfo.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">영수증 포함 여부</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      approval.authenticationInfo.receiptIncluded
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {approval.authenticationInfo.receiptIncluded ? '포함됨' : '미포함'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">구매처</p>
                  <p className="text-base text-gray-900">{approval.authenticationInfo.purchaseLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">구매일</p>
                  <p className="text-base text-gray-900">{approval.authenticationInfo.purchaseDate}</p>
                </div>
              </div>
            </div>

            {/* Designer Info (Conditional) */}
            {approval.productType === '디자이너 한정판' && approval.designerInfo && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="text-purple-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">디자이너 한정판 정보</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">디자이너명</p>
                    <p className="text-lg font-bold text-gray-900">{approval.designerInfo.designerName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">에디션 넘버링</p>
                    <p className="text-3xl font-bold text-purple-600">
                      #{approval.designerInfo.editionNumber} / {approval.designerInfo.totalEditions}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">디자이너 서명</p>
                    <img
                      src={approval.designerInfo.signatureImage}
                      alt="Designer Signature"
                      className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">한정판 인증서</p>
                    <img
                      src={approval.designerInfo.certificateImage}
                      alt="Certificate"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Admin Panel (1/3) */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">검토 정보</h2>
              
              {/* Seller Information */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">셀러 정보</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">이름</p>
                    <p className="text-sm font-semibold text-gray-900">{approval.seller}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">이메일</p>
                    <p className="text-sm text-gray-700">{approval.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">연락처</p>
                    <p className="text-sm text-gray-700">{approval.sellerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">상품 정보</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">브랜드</p>
                    <p className="text-sm font-semibold text-gray-900">{approval.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">카테고리</p>
                    <p className="text-sm text-gray-700">{approval.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">상품 유형</p>
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        approval.productType === '디자이너 한정판'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {approval.productType}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">판매가</p>
                    <p className="text-xl font-bold text-blue-600">{approval.price}</p>
                  </div>
                </div>
              </div>

              {/* Application Date */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-xs text-gray-500">신청일시</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{approval.applicationDate}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">반려 사유 입력</h3>
                <p className="text-sm text-gray-500 mt-1">
                  상품 반려 사유를 구체적으로 입력해주세요
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                반려 사유 *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="예: 상품 이미지 품질 불량 / 정품 인증 정보 미비 / 상품 설명 불충분 / 에디션 넘버 확인 불가 등"
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                셀러에게 전달될 내용입니다. 수정이 필요한 부분을 명확하게 작성해주세요.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}