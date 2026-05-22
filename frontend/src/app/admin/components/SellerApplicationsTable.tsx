import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, ClipboardList, RefreshCw, Store, XCircle } from 'lucide-react';
import {
  approveBrand,
  BrandResponse,
  BrandStatus,
  getAdminBrands,
  rejectBrand,
} from '../../api/adminBrandApi';

const FILTERS: Array<{ label: string; value: BrandStatus | 'ALL' }> = [
  { label: '전체', value: 'ALL' },
  { label: '승인 대기', value: 'PENDING' },
  { label: '승인 완료', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
];

function getStatusBadge(status: string) {
  const upperStatus = status?.toUpperCase();

  if (upperStatus === 'APPROVED') {
    return 'bg-green-50 text-green-700 border-green-200';
  }
  if (upperStatus === 'REJECTED') {
    return 'bg-red-50 text-red-700 border-red-200';
  }
  return 'bg-yellow-50 text-yellow-700 border-yellow-200';
}

function getStatusLabel(status: string) {
  const upperStatus = status?.toUpperCase();

  if (upperStatus === 'APPROVED') return '승인 완료';
  if (upperStatus === 'REJECTED') return '반려';
  return '승인 대기';
}

function getSalesStatusLabel(status: string) {
  const upperStatus = status?.toUpperCase();

  if (upperStatus === 'ACTIVE') return '판매 활성';
  return '판매 비활성';
}

export function SellerApplicationsTable() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BrandStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [processingBrandId, setProcessingBrandId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => brands.filter((brand) => brand.status?.toUpperCase() === 'PENDING').length,
    [brands]
  );

  const filteredBrands = useMemo(() => {
    if (selectedStatus === 'ALL') return brands;
    return brands.filter((brand) => brand.status?.toUpperCase() === selectedStatus);
  }, [brands, selectedStatus]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminBrands();
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '브랜드 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
  }, []);

  const updateBrandInList = (updatedBrand: BrandResponse) => {
    setBrands((prev) => prev.map((brand) => (brand.brandId === updatedBrand.brandId ? updatedBrand : brand)));
  };

  const handleApproveRegular = async (brand: BrandResponse) => {
    if (!confirm(`${brand.brandName} 입점을 승인하시겠습니까?\n승인 후 해당 사용자는 일반 셀러가 됩니다.`)) return;

    try {
      setProcessingBrandId(brand.brandId);
      const updatedBrand = await approveBrand(brand.brandId);
      updateBrandInList(updatedBrand);
      alert('입점 승인 및 일반 셀러 권한 부여가 완료되었습니다. 해당 셀러는 다시 로그인해야 권한이 반영됩니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '입점 승인에 실패했습니다.');
    } finally {
      setProcessingBrandId(null);
    }
  };

  const handleReject = async (brand: BrandResponse) => {
    if (!confirm(`${brand.brandName} 입점 신청을 반려하시겠습니까?`)) return;

    try {
      setProcessingBrandId(brand.brandId);
      const updatedBrand = await rejectBrand(brand.brandId);
      updateBrandInList(updatedBrand);
      alert('입점 신청이 반려되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '반려 처리에 실패했습니다.');
    } finally {
      setProcessingBrandId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store size={22} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">브랜드/셀러 입점 심사</h2>
            </div>
            <p className="text-sm text-gray-500 leading-6">
              이 화면은 입점 신청을 일반 셀러로 승인하거나 반려하는 곳입니다. 디자이너 권한은 승인된 셀러를 대상으로 <b>전체 셀러 목록</b>에서 부여합니다.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadBrands()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              새로고침
            </button>
            <Link
              to="/admin/seller/list"
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold hover:bg-purple-100 transition-colors text-sm"
            >
              디자이너 권한 관리로 이동
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                selectedStatus === filter.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="m-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex items-center justify-center text-gray-500">
          <RefreshCw size={20} className="animate-spin mr-2" />
          브랜드 목록을 불러오는 중입니다.
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center text-gray-500">
          <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
            <ClipboardList size={28} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">표시할 브랜드 신청이 없습니다</p>
          <p className="text-sm mt-2 max-w-md">셀러가 브랜드 입점 신청을 하면 이 목록에 표시됩니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-4 font-semibold">브랜드</th>
                <th className="px-6 py-4 font-semibold">소유자 ID</th>
                <th className="px-6 py-4 font-semibold">사업자번호</th>
                <th className="px-6 py-4 font-semibold">정산주기</th>
                <th className="px-6 py-4 font-semibold">입점 상태</th>
                <th className="px-6 py-4 font-semibold">판매상태</th>
                <th className="px-6 py-4 font-semibold text-right">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands.map((brand) => {
                const isProcessing = processingBrandId === brand.brandId;
                const isApproved = brand.status?.toUpperCase() === 'APPROVED';
                const isRejected = brand.status?.toUpperCase() === 'REJECTED';

                return (
                  <tr key={brand.brandId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.brandLogoUrl ? (
                          <img
                            src={brand.brandLogoUrl}
                            alt={brand.brandName}
                            className="w-11 h-11 rounded-lg object-cover border border-gray-200 bg-gray-50"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <Store size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{brand.brandName}</p>
                          <p className="text-xs text-gray-500">Brand ID: {brand.brandId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{brand.ownerUserId}</td>
                    <td className="px-6 py-4 text-gray-700">{brand.businessNumber || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{brand.settlementCycle || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadge(brand.status)}`}>
                        {getStatusLabel(brand.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{getSalesStatusLabel(brand.salesStatus)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 min-w-[220px]">
                        <button
                          type="button"
                          onClick={() => void handleApproveRegular(brand)}
                          disabled={isProcessing || isApproved || isRejected}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle2 size={15} />
                          입점 승인
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReject(brand)}
                          disabled={isProcessing || isApproved || isRejected}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <XCircle size={15} />
                          반려
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">총 {brands.length}개 브랜드</p>
        <p className="text-sm text-gray-600">
          승인 대기: <span className="font-bold text-yellow-600">{pendingCount}</span>
        </p>
      </div>
    </div>
  );
}
