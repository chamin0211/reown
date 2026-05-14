import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, Package, Clock, Award } from 'lucide-react';
import { approveProduct, getAdminProduct, rejectProduct } from '../../api/adminProductApi';
import type { ProductDetailResponse } from '../../api/adminProductApi';

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    WAITING: '검수대기',
    ON_SALE: '판매중',
    REJECTED: '반려',
    DELETED: '삭제됨',
  };
  return map[status] ?? status;
}

function getSaleTypeText(saleType: string) {
  const map: Record<string, string> = {
    NORMAL: '일반',
    FUNDING: '펀딩',
    RESELL: '리셀',
  };
  return map[saleType] ?? saleType;
}

export function ProductReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const images = useMemo(() => {
    if (!product) return [];
    const thumbnail = product.thumbnailUrl?.startsWith('http')
      ? product.thumbnailUrl
      : `https://picsum.photos/seed/reown-product-${product.productId}/800/600`;
    return [thumbnail];
  }, [product]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getAdminProduct(id);
      setProduct(data);
      setSelectedImage(0);
    } catch (error) {
      console.error('상품 상세 조회 실패:', error);
      alert(error instanceof Error ? error.message : '상품 상세 정보를 불러오지 못했습니다.');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApprove = async () => {
    if (!product) return;
    if (!confirm('이 상품을 승인하시겠습니까? 승인 후 사용자 상품 목록에 노출됩니다.')) return;
    try {
      const updated = await approveProduct(product.productId);
      setProduct(updated);
      alert('상품이 승인되었습니다.');
      navigate('/admin/products');
    } catch (error) {
      console.error('상품 승인 실패:', error);
      alert(error instanceof Error ? error.message : '상품 승인에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!product) return;
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (!confirm('이 상품을 반려하시겠습니까?')) return;

    try {
      const updated = await rejectProduct(product.productId);
      setProduct(updated);
      alert(`상품이 반려되었습니다.\n사유: ${rejectReason}`);
      setShowRejectModal(false);
      navigate('/admin/products');
    } catch (error) {
      console.error('상품 반려 실패:', error);
      alert(error instanceof Error ? error.message : '상품 반려에 실패했습니다.');
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SuperAdminSidebar />
        <main className="ml-64 p-8">
          <p className="text-gray-500">상품 상세 정보를 불러오는 중입니다...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">상품 상세 검토</h1>
              <p className="text-gray-500 mt-1">ID: #{product.productId} · 상태: {getStatusText(product.status)}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {product.status === 'WAITING' && (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <XCircle size={20} />
                  반려 (Reject)
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle size={20} />
                  승인 (Approve)
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상품 이미지</h2>
              
              <div className="mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[480px] object-cover rounded-xl border border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
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
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상세 설명</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description || '등록된 상세 설명이 없습니다.'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">옵션/재고 정보</h2>
              </div>
              {product.options.length === 0 ? (
                <p className="text-sm text-gray-500">등록된 옵션이 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">사이즈</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">색상</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">재고</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">안전재고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {product.options.map((option) => (
                        <tr key={option.optionId}>
                          <td className="px-4 py-3">{option.size || '-'}</td>
                          <td className="px-4 py-3">{option.color || '-'}</td>
                          <td className="px-4 py-3 font-semibold">{option.stockQuantity}</td>
                          <td className="px-4 py-3">{option.safetyStock ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">관리자 제어 패널</h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">판매자/브랜드 정보</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">브랜드 ID</p>
                    <p className="text-sm font-semibold text-gray-900">#{product.brandId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">브랜드명</p>
                    <p className="text-sm text-gray-700">{product.brandName || `Brand #${product.brandId}`}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">상품 정보</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">상품명</p>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">카테고리</p>
                    <p className="text-sm text-gray-700">{product.categoryName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">판매 유형</p>
                    <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {getSaleTypeText(product.saleType)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">가격</p>
                    <p className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-gray-500" />
                  <h3 className="font-bold text-gray-900">검토 이력</h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{formatDate(product.createdAt)}</p>
                  <p className="text-sm font-semibold text-gray-900">상품 등록</p>
                  <p className="text-xs text-gray-600 mt-1">상태: {getStatusText(product.status)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-xs text-gray-500">등록일시</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatDate(product.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

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
                  현재 백엔드에는 사유 저장 컬럼이 없어 화면 알림용으로만 사용됩니다.
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
                placeholder="예: 이미지 저화질 / 가격 오류 / 상품 설명 불충분 등"
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              />
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
