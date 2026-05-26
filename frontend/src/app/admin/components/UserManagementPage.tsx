import { useEffect, useMemo, useState } from 'react';
import { Lock, RefreshCw, Search, ShieldCheck, Unlock } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { changeUserRole, getAdminUsers, lockUser, unlockUser, type AdminUserResponse } from '../../api/adminUserApi';

const roleLabels: Record<string, string> = {
  USER: '사용자',
  SELLER_PENDING: '셀러 승인대기',
  SELLER: '셀러',
  DESIGNER: '디자이너',
  ADMIN_PENDING: '관리자 승인대기',
  ADMIN: '관리자',
  MASTER: '마스터',
};

const roleColors: Record<string, string> = {
  USER: 'bg-gray-100 text-gray-700',
  SELLER_PENDING: 'bg-yellow-100 text-yellow-700',
  SELLER: 'bg-blue-100 text-blue-700',
  DESIGNER: 'bg-purple-100 text-purple-700',
  ADMIN_PENDING: 'bg-orange-100 text-orange-700',
  ADMIN: 'bg-indigo-100 text-indigo-700',
  MASTER: 'bg-pink-100 text-pink-700',
};

function formatDate(value?: string | null) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

function isLocked(user: AdminUserResponse) {
  return user.lockedUntil ? new Date(user.lockedUntil).getTime() > Date.now() : false;
}

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setUsers(await getAdminUsers());
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '회원 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesKeyword = !keyword || [user.loginId ?? '', user.email, user.nickname, user.role]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
      return matchesRole && matchesKeyword;
    });
  }, [users, query, roleFilter]);

  const summary = useMemo(() => ({
    total: users.length,
    users: users.filter((user) => user.role === 'USER').length,
    sellers: users.filter((user) => ['SELLER', 'DESIGNER'].includes(user.role)).length,
    admins: users.filter((user) => ['ADMIN', 'MASTER'].includes(user.role)).length,
    locked: users.filter(isLocked).length,
  }), [users]);

  const handleRoleChange = async (userId: number, role: string) => {
    if (!confirm(`해당 회원 권한을 ${roleLabels[role] ?? role}(으)로 변경하시겠습니까?`)) return;
    try {
      const updated = await changeUserRole(userId, role);
      setUsers((prev) => prev.map((item) => item.userId === userId ? updated : item));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '권한 변경에 실패했습니다.');
    }
  };

  const handleLockToggle = async (user: AdminUserResponse) => {
    try {
      const updated = isLocked(user)
        ? await unlockUser(user.userId)
        : await lockUser(user.userId, 7);
      setUsers((prev) => prev.map((item) => item.userId === user.userId ? updated : item));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '계정 상태 변경에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">전체 유저</h1>
            <p className="text-gray-500">가입한 사용자, 셀러, 관리자 계정을 한 곳에서 조회하고 권한/제재 상태를 관리합니다.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            ['전체', summary.total], ['일반 사용자', summary.users], ['셀러/디자이너', summary.sellers], ['관리자', summary.admins], ['잠금', summary.locked],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm" placeholder="아이디, 닉네임, 이메일 검색" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-3 border rounded-lg bg-white text-sm">
              <option value="ALL">전체 권한</option>
              {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="px-5 py-3 text-left">회원</th><th className="px-5 py-3 text-left">권한</th><th className="px-5 py-3 text-left">보안 상태</th><th className="px-5 py-3 text-left">마지막 로그인</th><th className="px-5 py-3 text-left">가입일</th><th className="px-5 py-3 text-right">관리</th></tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-5 py-4"><div className="font-bold text-gray-900">{user.nickname}</div><div className="text-xs text-gray-500">{user.loginId ?? '-'} · {user.email}</div></td>
                    <td className="px-5 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] ?? 'bg-gray-100 text-gray-700'}`}>{roleLabels[user.role] ?? user.role}</span></td>
                    <td className="px-5 py-4">{isLocked(user) ? <span className="text-red-600 font-semibold">잠금 · {formatDate(user.lockedUntil)}</span> : <span className="text-green-600 font-semibold">정상</span>}<div className="text-xs text-gray-400">실패 {user.failedLoginCount ?? 0}회</div></td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <select value={user.role} onChange={(e) => handleRoleChange(user.userId, e.target.value)} className="px-3 py-2 border rounded-lg bg-white text-xs">
                          {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button onClick={() => handleLockToggle(user)} className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs ${isLocked(user) ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          {isLocked(user) ? <Unlock size={14} /> : <Lock size={14} />}{isLocked(user) ? '해제' : '잠금'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-500">표시할 회원이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
