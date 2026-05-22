import { useEffect, useMemo, useState } from 'react';
import { Crown, RefreshCw, Search, Store, UserRoundCheck, UserRoundMinus } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import {
  AdminSellerResponse,
  getAdminSellers,
  grantDesignerRole,
  revokeDesignerRole,
} from '../../api/adminSellerApi';

function getRoleBadge(role: string) {
  const upperRole = role?.toUpperCase();

  if (upperRole === 'DESIGNER') {
    return {
      label: '디자이너 셀러',
      style: 'bg-purple-50 text-purple-700 border-purple-200',
    };
  }

  return {
    label: '일반 셀러',
    style: 'bg-blue-50 text-blue-700 border-blue-200',
  };
}

function getSalesStatusLabel(status: string) {
  return status?.toUpperCase() === 'ACTIVE' ? '판매 활성' : '판매 비활성';
}

export function SellerListPage() {
  const [sellers, setSellers] = useState<AdminSellerResponse[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'SELLER' | 'DESIGNER'>('ALL');
  const [loading, setLoading] = useState(true);
  const [processingBrandId, setProcessingBrandId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const designerCount = useMemo(
    () => sellers.filter((seller) => seller.ownerRole?.toUpperCase() === 'DESIGNER').length,
    [sellers]
  );

  const filteredSellers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sellers.filter((seller) => {
      const role = seller.ownerRole?.toUpperCase();
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;
      const matchesQuery =
        !normalizedQuery ||
        seller.brandName.toLowerCase().includes(normalizedQuery) ||
        seller.ownerEmail.toLowerCase().includes(normalizedQuery) ||
        seller.ownerNickname.toLowerCase().includes(normalizedQuery) ||
        String(seller.ownerUserId).includes(normalizedQuery) ||
        String(seller.brandId).includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });
  }, [sellers, query, roleFilter]);

  const loadSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminSellers();
      setSellers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '셀러 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSellers();
  }, []);

  const updateSellerInList = (updatedSeller: AdminSellerResponse) => {
    setSellers((prev) => prev.map((seller) => (seller.brandId === updatedSeller.brandId ? updatedSeller : seller)));
  };

  const handleGrantDesigner = async (seller: AdminSellerResponse) => {
    if (!confirm(`${seller.brandName}의 셀러 ${seller.ownerNickname}님에게 디자이너 권한을 부여하시겠습니까?\n권한 부여 후 디자이너 한정판 상품 등록이 가능해집니다.`)) {
      return;
    }

    try {
      setProcessingBrandId(seller.brandId);
      const updatedSeller = await grantDesignerRole(seller.brandId);
      updateSellerInList(updatedSeller);
      alert('디자이너 권한이 부여되었습니다. 해당 셀러는 로그아웃 후 다시 로그인해야 권한이 반영됩니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '디자이너 권한 부여에 실패했습니다.');
    } finally {
      setProcessingBrandId(null);
    }
  };

  const handleRevokeDesigner = async (seller: AdminSellerResponse) => {
    if (!confirm(`${seller.brandName}의 디자이너 권한을 해제하고 일반 셀러로 변경하시겠습니까?`)) {
      return;
    }

    try {
      setProcessingBrandId(seller.brandId);
      const updatedSeller = await revokeDesignerRole(seller.brandId);
      updateSellerInList(updatedSeller);
      alert('일반 셀러로 변경되었습니다. 해당 셀러는 로그아웃 후 다시 로그인해야 권한이 반영됩니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '일반 셀러 변경에 실패했습니다.');
    } finally {
      setProcessingBrandId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 셀러 목록</h1>
          <p className="text-gray-600">
            입점 승인된 셀러를 관리하고, 셀러 단위로 디자이너 권한을 부여합니다. 상품별 승인과는 별개의 권한 관리입니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">전체 승인 셀러</p>
            <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">디자이너 셀러</p>
            <p className="text-2xl font-bold text-purple-700">{designerCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">일반 셀러</p>
            <p className="text-2xl font-bold text-blue-700">{sellers.length - designerCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="브랜드명, 셀러 이메일, 닉네임, ID 검색"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['ALL', 'SELLER', 'DESIGNER'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      roleFilter === role
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {role === 'ALL' ? '전체' : role === 'DESIGNER' ? '디자이너' : '일반 셀러'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => void loadSellers()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  새로고침
                </button>
              </div>
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
              셀러 목록을 불러오는 중입니다.
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p className="font-semibold text-gray-700">표시할 셀러가 없습니다</p>
              <p className="text-sm mt-2">입점 승인된 브랜드/셀러가 있어야 이 목록에 표시됩니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-semibold">브랜드</th>
                    <th className="px-6 py-4 font-semibold">셀러</th>
                    <th className="px-6 py-4 font-semibold">권한</th>
                    <th className="px-6 py-4 font-semibold">판매상태</th>
                    <th className="px-6 py-4 font-semibold">정산주기</th>
                    <th className="px-6 py-4 font-semibold text-right">디자이너 권한</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((seller) => {
                    const isDesigner = seller.ownerRole?.toUpperCase() === 'DESIGNER';
                    const isProcessing = processingBrandId === seller.brandId;
                    const roleBadge = getRoleBadge(seller.ownerRole);

                    return (
                      <tr key={seller.brandId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {seller.brandLogoUrl ? (
                              <img
                                src={seller.brandLogoUrl}
                                alt={seller.brandName}
                                className="w-11 h-11 rounded-lg object-cover border border-gray-200 bg-gray-50"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                <Store size={20} />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{seller.brandName}</p>
                              <p className="text-xs text-gray-500">Brand ID: {seller.brandId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{seller.ownerNickname}</p>
                          <p className="text-xs text-gray-500">{seller.ownerEmail}</p>
                          <p className="text-xs text-gray-400">User ID: {seller.ownerUserId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${roleBadge.style}`}>
                            {isDesigner && <Crown size={13} />}
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{getSalesStatusLabel(seller.salesStatus)}</td>
                        <td className="px-6 py-4 text-gray-700">{seller.settlementCycle || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end min-w-[190px]">
                            {isDesigner ? (
                              <button
                                type="button"
                                onClick={() => void handleRevokeDesigner(seller)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <UserRoundMinus size={15} />
                                일반 셀러로 변경
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void handleGrantDesigner(seller)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <UserRoundCheck size={15} />
                                디자이너 권한 부여
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
