import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Save, Search } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { getBrandContracts, updateBrandContract, type BrandContractResponse } from '../../api/adminContractApi';

type Draft = { settlementCycle: string; commissionRate: string; salesStatus: string };

const settlementCycleLabels: Record<string, string> = {
  WEEKLY: '주 정산',
  BIWEEKLY: '격주 정산',
  MONTHLY: '월 정산',
};

function statusBadge(status: string) {
  if (status === 'ACTIVE') return 'bg-green-100 text-green-700';
  if (status === 'INACTIVE') return 'bg-gray-100 text-gray-700';
  return 'bg-blue-100 text-blue-700';
}

export function SellerContractSettingsPage() {
  const [contracts, setContracts] = useState<BrandContractResponse[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getBrandContracts();
      setContracts(data);
      const nextDrafts: Record<number, Draft> = {};
      data.forEach((item) => {
        nextDrafts[item.brandId] = {
          settlementCycle: item.settlementCycle ?? 'MONTHLY',
          commissionRate: String(item.commissionRate ?? 10),
          salesStatus: item.salesStatus ?? 'ACTIVE',
        };
      });
      setDrafts(nextDrafts);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '계약 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredContracts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return contracts;
    return contracts.filter((item) =>
      [item.brandName, item.ownerLoginId, item.ownerNickname, item.businessNumber ?? '']
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [contracts, query]);

  const summary = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter((item) => item.salesStatus === 'ACTIVE').length,
    avgCommission: contracts.length
      ? contracts.reduce((sum, item) => sum + Number(item.commissionRate ?? 0), 0) / contracts.length
      : 0,
  }), [contracts]);

  const updateDraft = (brandId: number, key: keyof Draft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [brandId]: {
        ...(prev[brandId] ?? { settlementCycle: 'MONTHLY', commissionRate: '10', salesStatus: 'ACTIVE' }),
        [key]: value,
      },
    }));
  };

  const handleSave = async (brandId: number) => {
    const draft = drafts[brandId];
    if (!draft) return;
    const commissionRate = Number(draft.commissionRate);
    if (!Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      alert('수수료율은 0~100 사이의 숫자로 입력해주세요.');
      return;
    }

    try {
      setSavingId(brandId);
      const updated = await updateBrandContract(brandId, {
        settlementCycle: draft.settlementCycle,
        commissionRate,
        salesStatus: draft.salesStatus,
      });
      setContracts((prev) => prev.map((item) => (item.brandId === brandId ? updated : item)));
      alert('계약/수수료 설정을 저장했습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">계약/수수료 설정</h1>
            <p className="text-gray-500">승인된 셀러의 정산 주기, 판매 활성 상태, 플랫폼 수수료율을 관리합니다.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">승인 셀러</p><p className="text-2xl font-bold mt-1">{summary.total}개</p></div>
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">판매 활성</p><p className="text-2xl font-bold mt-1">{summary.active}개</p></div>
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">평균 수수료율</p><p className="text-2xl font-bold mt-1">{summary.avgCommission.toFixed(1)}%</p></div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm" placeholder="브랜드명, 셀러 아이디, 사업자번호 검색" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left">브랜드/셀러</th>
                  <th className="px-5 py-3 text-left">사업자번호</th>
                  <th className="px-5 py-3 text-left">판매 상태</th>
                  <th className="px-5 py-3 text-left">정산 주기</th>
                  <th className="px-5 py-3 text-left">수수료율</th>
                  <th className="px-5 py-3 text-right">저장</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContracts.map((item) => {
                  const draft = drafts[item.brandId];
                  return (
                    <tr key={item.brandId} className="hover:bg-gray-50">
                      <td className="px-5 py-4"><div className="font-bold text-gray-900">{item.brandName}</div><div className="text-xs text-gray-500">{item.ownerNickname} · {item.ownerLoginId}</div></td>
                      <td className="px-5 py-4 text-gray-700">{item.businessNumber ?? '-'}</td>
                      <td className="px-5 py-4">
                        <select value={draft?.salesStatus ?? 'ACTIVE'} onChange={(e) => updateDraft(item.brandId, 'salesStatus', e.target.value)} className={`px-3 py-2 rounded-lg text-xs font-semibold border ${statusBadge(draft?.salesStatus ?? item.salesStatus)}`}>
                          <option value="ACTIVE">판매 활성</option>
                          <option value="INACTIVE">판매 중지</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select value={draft?.settlementCycle ?? 'MONTHLY'} onChange={(e) => updateDraft(item.brandId, 'settlementCycle', e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
                          {Object.entries(settlementCycleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4"><input value={draft?.commissionRate ?? ''} onChange={(e) => updateDraft(item.brandId, 'commissionRate', e.target.value)} className="w-24 px-3 py-2 border rounded-lg text-right" /> <span className="text-gray-500">%</span></td>
                      <td className="px-5 py-4 text-right"><button onClick={() => handleSave(item.brandId)} disabled={savingId === item.brandId} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"><Save size={15} />저장</button></td>
                    </tr>
                  );
                })}
                {filteredContracts.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-500">표시할 셀러가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
