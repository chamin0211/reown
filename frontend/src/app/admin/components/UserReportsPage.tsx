import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Lock, Plus, RefreshCw, Search } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import {
  createUserReport,
  getAdminUsers,
  getUserReports,
  lockUser,
  updateUserReportStatus,
  type AdminUserResponse,
  type UserReportResponse,
} from '../../api/adminUserApi';

const statusLabels: Record<string, string> = {
  PENDING: '대기',
  REVIEWING: '검토중',
  DONE: '처리완료',
  REJECTED: '기각',
};

const statusClasses: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
  REJECTED: 'bg-gray-100 text-gray-700',
};

function formatDate(value?: string | null) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

export function UserReportsPage() {
  const [reports, setReports] = useState<UserReportResponse[]>([]);
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [status, setStatus] = useState('ALL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ reportedUserId: '', reason: '부적절한 거래 행위', detail: '' });

  const load = async () => {
    try {
      setLoading(true);
      const [reportData, userData] = await Promise.all([getUserReports(), getAdminUsers()]);
      setReports(reportData);
      setUsers(userData);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '신고/제재 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredReports = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesStatus = status === 'ALL' || report.status === status;
      const matchesKeyword = !keyword || [report.reportedLoginId ?? '', report.reportedNickname ?? '', report.reason, report.detail ?? '']
        .join(' ')
        .toLowerCase()
        .includes(keyword);
      return matchesStatus && matchesKeyword;
    });
  }, [reports, query, status]);

  const summary = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((item) => item.status === 'PENDING').length,
    done: reports.filter((item) => item.status === 'DONE').length,
  }), [reports]);

  const handleCreate = async () => {
    const reportedUserId = Number(form.reportedUserId);
    if (!Number.isFinite(reportedUserId)) {
      alert('신고 대상 사용자를 선택해주세요.');
      return;
    }
    try {
      const created = await createUserReport({
        reportedUserId,
        reason: form.reason,
        detail: form.detail,
      });
      setReports((prev) => [created, ...prev]);
      setForm({ reportedUserId: '', reason: '부적절한 거래 행위', detail: '' });
      alert('신고 내역이 등록되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '신고 내역 등록에 실패했습니다.');
    }
  };

  const handleStatus = async (reportId: number, nextStatus: string) => {
    try {
      const updated = await updateUserReportStatus(reportId, nextStatus);
      setReports((prev) => prev.map((item) => item.reportId === reportId ? updated : item));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '상태 변경에 실패했습니다.');
    }
  };

  const handleSanction = async (report: UserReportResponse) => {
    if (!confirm(`${report.reportedNickname ?? report.reportedLoginId} 계정을 7일 잠금 처리할까요?`)) return;
    try {
      await lockUser(report.reportedUserId, 7);
      const updated = await updateUserReportStatus(report.reportId, 'DONE');
      setReports((prev) => prev.map((item) => item.reportId === report.reportId ? updated : item));
      alert('제재 처리되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '제재 처리에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">신고/제재 목록</h1>
            <p className="text-gray-500">사용자 신고 내역을 등록하고 검토 상태 및 계정 제재를 관리합니다.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">전체 신고</p><p className="text-2xl font-bold mt-1">{summary.total}건</p></div>
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">대기</p><p className="text-2xl font-bold mt-1">{summary.pending}건</p></div>
          <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">처리 완료</p><p className="text-2xl font-bold mt-1">{summary.done}건</p></div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm mb-6 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus size={18} />수동 신고 등록</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={form.reportedUserId} onChange={(e) => setForm((prev) => ({ ...prev, reportedUserId: e.target.value }))} className="px-4 py-3 border rounded-lg text-sm bg-white">
              <option value="">신고 대상 선택</option>
              {users.map((user) => <option key={user.userId} value={user.userId}>{user.nickname} ({user.loginId ?? user.email})</option>)}
            </select>
            <input value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} className="px-4 py-3 border rounded-lg text-sm" placeholder="신고 사유" />
            <input value={form.detail} onChange={(e) => setForm((prev) => ({ ...prev, detail: e.target.value }))} className="px-4 py-3 border rounded-lg text-sm" placeholder="상세 내용" />
            <button onClick={handleCreate} className="px-4 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">등록</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm" placeholder="대상자, 신고 사유 검색" />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-3 border rounded-lg text-sm bg-white">
              <option value="ALL">전체 상태</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="px-5 py-3 text-left">대상자</th><th className="px-5 py-3 text-left">사유</th><th className="px-5 py-3 text-left">상태</th><th className="px-5 py-3 text-left">접수일</th><th className="px-5 py-3 text-right">처리</th></tr></thead>
              <tbody className="divide-y">
                {filteredReports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50">
                    <td className="px-5 py-4"><div className="font-bold text-gray-900">{report.reportedNickname ?? '알 수 없음'}</div><div className="text-xs text-gray-500">{report.reportedLoginId ?? '-'} · {report.reportedRole ?? '-'}</div></td>
                    <td className="px-5 py-4"><div className="font-semibold text-gray-900">{report.reason}</div><div className="text-xs text-gray-500 mt-1">{report.detail ?? '-'}</div></td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[report.status] ?? 'bg-gray-100 text-gray-700'}`}>{statusLabels[report.status] ?? report.status}</span></td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(report.createdAt)}</td>
                    <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleStatus(report.reportId, 'REVIEWING')} className="px-3 py-2 border rounded-lg text-xs">검토중</button><button onClick={() => handleStatus(report.reportId, 'DONE')} className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs"><CheckCircle size={14} />완료</button><button onClick={() => handleSanction(report)} className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs"><Lock size={14} />7일 제재</button></div></td>
                  </tr>
                ))}
                {filteredReports.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-500"><AlertTriangle className="mx-auto mb-2 text-gray-300" />등록된 신고가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
