import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Save, Target, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createSellerFundingProduct } from '../../api/fundingApi';
import { ImageUploadField } from '../../components/ImageUploadField';

const categories = ['아우터', '상의', '하의', '원피스', '가방', '신발', '악세서리'];

function toStartDateTime(value: string) {
  return value ? `${value}T00:00:00` : null;
}

function toEndDateTime(value: string) {
  return value ? `${value}T23:59:59` : null;
}

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function defaultEndDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export function FundingProjectForm() {
  const navigate = useNavigate();
  const { brandId } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '0',
    categoryName: '',
    description: '',
    thumbnailUrl: '',
    targetAmount: '500000',
    startDate: todayDateString(),
    endDate: defaultEndDateString(),
    stockQuantity: '50',
    safetyStock: '0',
    size: 'Free',
    color: '기본',
    colorHex: '',
    maxPurchasePerUser: '5',
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(form.price);
    const targetAmount = Number(form.targetAmount);
    const stockQuantity = Number(form.stockQuantity);
    const safetyStock = Number(form.safetyStock || 0);
    const maxPurchasePerUser = Number(form.maxPurchasePerUser || 0);

    if (!form.name.trim()) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }
    if (!form.categoryName) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      alert('상품 판매가는 1원 이상이어야 합니다.');
      return;
    }
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      alert('목표 펀딩 금액은 1원 이상이어야 합니다.');
      return;
    }
    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      alert('예상 제작 수량은 0개 이상이어야 합니다.');
      return;
    }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      alert('펀딩 종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    try {
      setSubmitting(true);
      await createSellerFundingProduct({
        brandId,
        name: form.name.trim(),
        price,
        categoryName: form.categoryName,
        description: form.description.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        targetAmount,
        startDate: toStartDateTime(form.startDate),
        endDate: toEndDateTime(form.endDate),
        stockQuantity,
        safetyStock,
        size: form.size.trim() || 'Free',
        color: form.color.trim() || '기본',
        colorHex: form.colorHex.trim() || null,
        maxPurchasePerUser: maxPurchasePerUser > 0 ? maxPurchasePerUser : null,
      });

      alert('펀딩 프로젝트가 등록되었습니다. 현재 상태는 관리자 승인 대기입니다.');
      navigate('/seller/funding');
    } catch (error) {
      console.error('펀딩 프로젝트 등록 실패:', error);
      alert('펀딩 등록에 실패했습니다. 백엔드 콘솔 또는 입력값을 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate('/seller/funding')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          펀딩 관리로 돌아가기
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">신규 펀딩 프로젝트 등록</h1>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            DB 저장
          </span>
        </div>
        <p className="text-gray-500 mt-1">등록한 펀딩은 MySQL에 저장되고 관리자 승인 후 사용자 펀딩 목록에 노출됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">펀딩 등록 흐름</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ catalog_product에는 sale_type=FUNDING, status=WAITING으로 저장됩니다.</li>
                <li>✅ trade_funding_campaign에는 funding_status=WAITING으로 저장됩니다.</li>
                <li>✅ 관리자가 승인하면 OPEN 상태가 되고 사용자 화면에 노출됩니다.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">프로젝트 기본 정보</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트명 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="예: RE:OWN 리사이클 데님 백팩 펀딩"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상품 판매가 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 <span className="text-red-500">*</span></label>
                <select
                  value={form.categoryName}
                  onChange={(event) => updateField('categoryName', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 소개 <span className="text-red-500">*</span></label>
              <textarea
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows={6}
                placeholder="펀딩 상품의 특징, 제작 목적, 지속가능성, 배송 계획 등을 입력하세요."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <ImageUploadField
              label="프로젝트 대표 이미지"
              value={form.thumbnailUrl}
              onChange={(url) => updateField('thumbnailUrl', url)}
              helperText="업로드한 이미지 주소가 펀딩 상품 thumbnailUrl로 저장됩니다. 승인 후 펀딩 목록과 상세 화면에 표시됩니다."
              placeholder="https://images.unsplash.com/..."
              previewClassName="h-56"
            />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">목표 및 기간 설정</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">목표 펀딩 금액 <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                value={form.targetAmount}
                onChange={(event) => updateField('targetAmount', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">예상 제작 수량</label>
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(event) => updateField('stockQuantity', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">펀딩 시작일</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">펀딩 종료일</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => updateField('endDate', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">옵션 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사이즈 옵션</label>
              <input
                type="text"
                value={form.size}
                onChange={(event) => updateField('size', event.target.value)}
                placeholder="Free 또는 S, M, L"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">컬러 옵션</label>
              <input
                type="text"
                value={form.color}
                onChange={(event) => updateField('color', event.target.value)}
                placeholder="블랙, 아이보리"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">컬러 코드</label>
              <input
                type="text"
                value={form.colorHex}
                onChange={(event) => updateField('colorHex', event.target.value)}
                placeholder="비워두면 색상명 기준 표시"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1인 최대 참여 수량</label>
              <input
                type="number"
                min="0"
                value={form.maxPurchasePerUser}
                onChange={(event) => updateField('maxPurchasePerUser', event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-12">
          <button
            type="button"
            onClick={() => navigate('/seller/funding')}
            className="px-8 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            <Save className="w-5 h-5" />
            {submitting ? '등록 중...' : '펀딩 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
