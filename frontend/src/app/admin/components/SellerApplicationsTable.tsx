import { Link } from 'react-router';
import { ClipboardList } from 'lucide-react';

export function SellerApplicationsTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">최근 입점 신청 브랜드</h2>
            <p className="text-sm text-gray-500 mt-1">
              입점 신청 DB 연동 전이므로 더미 신청 목록을 표시하지 않습니다.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm"
          >
            상품 승인 관리로 이동
          </Link>
        </div>
      </div>

      <div className="py-16 flex flex-col items-center justify-center text-center text-gray-500">
        <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
          <ClipboardList size={28} className="text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700">입점 신청 데이터가 없습니다</p>
        <p className="text-sm mt-2 max-w-md">
          현재 셀러 상품 등록/승인 기능은 DB와 연결되어 있습니다. 입점 신청 기능은 추후 DB 테이블과 API를 연결하면 됩니다.
        </p>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">총 0개 신청</p>
        <p className="text-sm text-gray-600">검토 대기: <span className="font-bold text-yellow-600">0</span></p>
      </div>
    </div>
  );
}
