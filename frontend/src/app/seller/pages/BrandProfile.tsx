import { Store, Mail, Phone, MapPin, Save, Upload, X } from "lucide-react";
import { useState } from "react";

export function BrandProfile() {
  const [brandImage, setBrandImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBrandImage(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">브랜드 프로필</h1>
        <p className="text-gray-500 mt-1">브랜드 정보를 관리하세요</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
        {/* Brand Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            브랜드 대표 이미지
          </label>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                {brandImage ? (
                  <>
                    <img
                      src={brandImage}
                      alt="브랜드 대표 이미지"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">이미지 없음</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                고객들에게 보여질 브랜드 로고 또는 대표 이미지를 업로드하세요.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer font-medium text-sm">
                <Upload className="w-4 h-4" />
                이미지 업로드
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                • 권장 크기: 400x400px (정사각형)<br />
                • 파일 형식: JPG, PNG<br />
                • 최대 용량: 5MB
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            브랜드명
          </label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              defaultValue="럭셔리 브랜드"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            브랜드 소개
          </label>
          <textarea
            rows={4}
            placeholder="브랜드의 철학과 가치를 소개해주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="contact@brand.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="02-1234-5678"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              rows={2}
              placeholder="사업장 주소를 입력하세요"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Save className="w-5 h-5" />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}