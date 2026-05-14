import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, User, Package, Calendar, Image as ImageIcon } from 'lucide-react';

interface InspectionDetail {
  inspectionNumber: string;
  productName: string;
  brand: string;
  seller: string;
  sellerEmail: string;
  sellerPhone: string;
  applicationDate: string;
  productCategory: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseLocation: string;
  price: string;
  images: {
    overall: string[];
    label: string[];
    stitching: string[];
    hardware: string[];
    logo: string[];
  };
  description: string;
}

const mockInspectionDetail: InspectionDetail = {
  inspectionNumber: 'INS-2024-0087',
  productName: '나이키 에어 조던 1 레트로 하이 시카고',
  brand: 'Nike',
  seller: '홍길동',
  sellerEmail: 'seller@example.com',
  sellerPhone: '010-1234-5678',
  applicationDate: '2024.03.27 14:32',
  productCategory: '스니커즈',
  serialNumber: 'AJ1-555088-101-2023',
  purchaseDate: '2023.11.15',
  purchaseLocation: '나이키 공식 스토어 (명동점)',
  price: '₩189,000',
  images: {
    overall: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
    ],
    label: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop',
    ],
    stitching: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=600&fit=crop',
    ],
    hardware: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=600&fit=crop',
    ],
    logo: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    ],
  },
  description: `2023년 11월 공식 스토어에서 구매한 정품 에어 조던 1 시카고 컬러웨이입니다.

상태:
- 착용 횟수: 3회 (실내에서만 착용)
- 전체적으로 매우 깨끗한 상태
- 밑창 마모 거의 없음
- 스크래치나 오염 없음

구성품:
- 정품 박스 (약간의 보관 흠집 있음)
- 여분 신발끈 (빨강, 검정)
- 정품 택 및 라벨
- 나이키 공식 영수증

검수 포인트:
- 나이키 스우시 로고 확인 요망
- 윙스 로고 엠보싱 확인 필요
- 힐 탭 스티칭 간격 확인
- 시리얼 넘버 정품 인증 필요`,
};

type ImageCategory = 'overall' | 'label' | 'stitching' | 'hardware' | 'logo';

export function ResellInspectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>('overall');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const inspection = mockInspectionDetail;
  const currentImages = inspection.images[selectedCategory];

  const imageCategories = [
    { key: 'overall' as ImageCategory, label: '전체 사진', count: inspection.images.overall.length },
    { key: 'label' as ImageCategory, label: '라벨/태그', count: inspection.images.label.length },
    { key: 'stitching' as ImageCategory, label: '봉제선', count: inspection.images.stitching.length },
    { key: 'hardware' as ImageCategory, label: '하드웨어', count: inspection.images.hardware.length },
    { key: 'logo' as ImageCategory, label: '로고', count: inspection.images.logo.length },
  ];

  const handleApprove = () => {
    if (confirm('이 상품을 정품으로 승인하시겠습니까?\n승인 후 상품은 리셀 판매가 가능합니다.')) {
      alert('정품 승인이 완료되었습니다.');
      navigate('/resell-inspection-queue');
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('가품 판정 사유를 입력해주세요.');
      return;
    }
    if (confirm('이 상품을 가품으로 판정하시겠습니까?\n판정 사유가 판매자에게 전송됩니다.')) {
      alert(`가품 판정이 완료되었습니다.\n사유: ${rejectReason}`);
      setShowRejectModal(false);
      navigate('/resell-inspection-queue');
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
              onClick={() => navigate('/resell-inspection-queue')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">리셀 검수 상세</h1>
              <p className="text-gray-500 mt-1">검수번호: {inspection.inspectionNumber}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <XCircle size={20} />
              가품 판정
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={20} />
              정품 승인
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Side: Image Gallery (2/3) */}
          <div className="col-span-2 space-y-6">
            {/* Main Image Viewer */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">검수 이미지 갤러리</h2>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <ImageIcon size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    {selectedImageIndex + 1} / {currentImages.length}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <img
                  src={currentImages[selectedImageIndex]}
                  alt={`${selectedCategory} ${selectedImageIndex + 1}`}
                  className="w-full h-[520px] object-cover rounded-xl border border-gray-200"
                />
              </div>
              
              {/* Image Navigation */}
              <div className="grid grid-cols-4 gap-3">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${selectedCategory} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Image Category Selector */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">검수 부위별 사진</h3>
              <div className="grid grid-cols-5 gap-3">
                {imageCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setSelectedImageIndex(0);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category.key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-1 ${
                      selectedCategory === category.key ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {category.label}
                    </p>
                    <p className={`text-xs ${
                      selectedCategory === category.key ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {category.count}장
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상품 설명</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {inspection.description}
              </div>
            </div>
          </div>

          {/* Right Side: Inspection Info (1/3) */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">검수 정보</h2>
              
              {/* Seller Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">판매자 정보</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">이름</p>
                    <p className="text-sm font-semibold text-gray-900">{inspection.seller}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">이메일</p>
                    <p className="text-sm text-gray-700">{inspection.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">연락처</p>
                    <p className="text-sm text-gray-700">{inspection.sellerPhone}</p>
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
                    <p className="text-xs text-gray-500 mb-1">상품명</p>
                    <p className="text-sm font-semibold text-gray-900">{inspection.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">브랜드</p>
                    <p className="text-sm font-semibold text-gray-900">{inspection.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">카테고리</p>
                    <p className="text-sm text-gray-700">{inspection.productCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">판매가</p>
                    <p className="text-lg font-bold text-blue-600">{inspection.price}</p>
                  </div>
                </div>
              </div>

              {/* Authentication Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">정품 인증</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">시리얼 넘버</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">{inspection.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">구매일</p>
                    <p className="text-sm text-gray-700">{inspection.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">구매처</p>
                    <p className="text-sm text-gray-700">{inspection.purchaseLocation}</p>
                  </div>
                </div>
              </div>

              {/* Application Date */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-xs text-gray-500">검수 신청일시</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{inspection.applicationDate}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">가품 판정 사유</h3>
                <p className="text-sm text-gray-500 mt-1">
                  가품으로 판정하는 구체적인 사유를 입력해주세요
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                판정 사유 *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="예: 로고 스티칭 불량 / 시리얼 넘버 불일치 / 라벨 폰트 오류 / 하드웨어 품질 차이 등&#10;&#10;※ 가능한 한 상세하고 전문적으로 작성해주세요."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                판매자에게 전달될 내용입니다. 검수 포인트를 명확하게 작성해주세요.
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
                가품 판정 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}