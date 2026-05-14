import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, Calendar, Tag, Package } from 'lucide-react';

interface ProductData {
  id: string;
  name: string;
  brand: string;
  seller: string;
  category: string;
  price: string;
  registeredDate: string;
  saleType: '펀딩' | '일반';
  description: string;
  images: string[];
  fundingInfo?: {
    targetQuantity: number;
    endDate: string;
    timeline: {
      stage: string;
      duration: string;
      status: string;
    }[];
  };
}

// Mock 데이터
const mockProduct: ProductData = {
  id: 'P-2024-001',
  name: '나이키 에어포스 1 화이트',
  brand: 'Nike',
  seller: '김리셀',
  category: '스니커즈',
  price: '₩89,000',
  registeredDate: '2024.03.27',
  saleType: '펀딩',
  description: `나이키 에어포스 1 화이트 색상입니다.
  
상품 상태: 새상품 (미착용)
구성품: 박스, 더스트백 포함
사이즈: 270mm
원산지: 베트남

해당 제품은 정품 인증을 거친 제품으로, 나이키 공식 매장에서 구매한 영수증이 첨부되어 있습니다.
신발 상태는 최상이며, 보관 시 먼지나 오염이 없도록 주의하였습니다.

펀딩을 통해 소량 제작 예정이며, 목표 수량 달성 시 제작에 들어갑니다.`,
  images: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
  ],
  fundingInfo: {
    targetQuantity: 100,
    endDate: '2024.04.30',
    timeline: [
      { stage: '펀딩 진행', duration: '30일', status: '진행중' },
      { stage: '제작 준비', duration: '7일', status: '대기' },
      { stage: '생산 진행', duration: '21일', status: '대기' },
      { stage: '품질 검수', duration: '5일', status: '대기' },
      { stage: '배송 시작', duration: '3일', status: '대기' },
    ],
  },
};

export function ProductReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const product = mockProduct;

  const handleApprove = () => {
    alert('상품이 승인되었습니다.');
    navigate('/');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    alert(`반려 사유: ${rejectReason}`);
    setShowRejectModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">상품 검토</h1>
              <p className="text-gray-600 mt-1">상품 ID: {product.id}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <XCircle size={20} />
              반려 (Reject)
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <CheckCircle size={20} />
              최종 승인 (Approve)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* 좌측: 상품 이미지 및 설명 */}
          <div className="col-span-2 space-y-6">
            {/* 이미지 갤러리 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">상품 이미지</h2>
              
              <div className="mb-4">
                <img
                  src={`${product.images[selectedImage]}?w=800&h=600&fit=crop`}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg border border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx
                        ? 'border-blue-900'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={`${img}?w=300&h=200&fit=crop`}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">상세 설명</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* 펀딩 정보 (조건부 렌더링) */}
            {product.saleType === '펀딩' && product.fundingInfo && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">펀딩 검수 정보</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">목표 달성 수량</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {product.fundingInfo.targetQuantity}개
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">펀딩 종료일</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {product.fundingInfo.endDate}
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-3">제작 공정 타임라인</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          단계
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          소요 기간
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          상태
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {product.fundingInfo.timeline.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.stage}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.duration}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                item.status === '진행중'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 우측: 검토 패널 */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">검토 패널</h2>
              
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-gray-500" />
                    <p className="text-sm font-medium text-gray-600">브랜드명</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product.brand}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-gray-500" />
                    <p className="text-sm font-medium text-gray-600">등록일</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product.registeredDate}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={18} className="text-gray-500" />
                    <p className="text-sm font-medium text-gray-600">판매 유형</p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                      product.saleType === '펀딩'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-green-100 text-green-900'
                    }`}
                  >
                    {product.saleType}
                  </span>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">판매자</p>
                  <p className="text-lg font-bold text-gray-900">{product.seller}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">카테고리</p>
                  <p className="text-lg font-bold text-gray-900">{product.category}</p>
                </div>

                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">가격</p>
                  <p className="text-2xl font-bold text-blue-900">{product.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 반려 사유 입력 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">반려 사유 입력</h3>
            <p className="text-sm text-gray-600 mb-4">
              상품 반려 사유를 구체적으로 입력해주세요.
            </p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="예: 이미지 저화질, 가격 오류, 상품 설명 불충분 등"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
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