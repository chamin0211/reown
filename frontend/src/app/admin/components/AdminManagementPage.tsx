import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Crown, RefreshCw, Search, ShieldCheck, UserCog, XCircle } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import {
  AdminUserResponse,
  approveAdmin,
  getAdminUsers,
  grantMaster,
  rejectAdmin,
  revokeMaster,
} from '../../api/adminUserApi';
import { getLoginUser } from '../../auth/session';

type RoleFilter = 'ALL' | 'ADMIN_PENDING' | 'ADMIN' | 'MASTER';

function getRoleBadge(role: string) {
  const upperRole = role?.toUpperCase();

  if (upperRole === 'MASTER') {
    return { label: 'MASTER', style: 'bg-purple-50 text-purple-700 border-purple-200' };
  }

  if (upperRole === 'ADMIN') {
    return { label: '관리자', style: 'bg-blue-50 text-blue-700 border-blue-200' };
  }

  if (upperRole === 'ADMIN_PENDING') {
    return { label: '승인 대기', style: 'bg-amber-50 text-amber-700 border-amber-200' };
  }

  return { label: role, style: 'bg-gray-50 text-gray-700 border-gray-200' };
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminManagementPage() {
  const loginUser = getLoginUser();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [loading, setLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const pending = users.filter((user) => user.role?.toUpperCase() === 'ADMIN_PENDING').length;
    const admins = users.filter((user) => user.role?.toUpperCase() === 'ADMIN').length;
    const masters = users.filter((user) => user.role?.toUpperCase() === 'MASTER').length;
    return { pending, admins, masters };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const role = user.role?.toUpperCase();
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;
      const matchesQuery =
        !normalizedQuery ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.nickname.toLowerCase().includes(normalizedQuery) ||
        String(user.userId).includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers();
      setUsers(data.filter((user) => ['ADMIN_PENDING', 'ADMIN', 'MASTER'].includes(user.role?.toUpperCase())));
    } catch (err) {
      setError(err instanceof Error ? err.message : '관리자 계정 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const updateUserInList = (updatedUser: AdminUserResponse) => {
    setUsers((prev) => prev.map((user) => (user.userId === updatedUser.userId ? updatedUser : user)));
  };

  const handleApprove = async (user: AdminUserResponse) => {
    if (!confirm(`${user.nickname}(${user.email}) 관리자 가입 신청을 승인하시겠습니까?`)) return;

    try {
      setProcessingUserId(user.userId);
      const updatedUser = await approveAdmin(user.userId);
      updateUserInList(updatedUser);
      alert('관리자 계정으로 승인되었습니다. 해당 사용자는 다시 로그인해야 권한이 반영됩니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '관리자 승인에 실패했습니다.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleReject = async (user: AdminUserResponse) => {
    if (!confirm(`${user.nickname}(${user.email}) 관리자 가입 신청을 반려하시겠습니까?\n반려 시 일반 사용자 권한으로 변경됩니다.`)) return;

    try {
      setProcessingUserId(user.userId);
      const updatedUser = await rejectAdmin(user.userId);
      setUsers((prev) => prev.filter((item) => item.userId !== updatedUser.userId));
      alert('관리자 신청이 반려되었습니다. 해당 계정은 일반 사용자로 변경되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '관리자 신청 반려에 실패했습니다.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleGrantMaster = async (user: AdminUserResponse) => {
    if (!confirm(`${user.nickname} 관리자를 MASTER로 승격하시겠습니까?\nMASTER는 다른 관리자 승인/권한 변경이 가능합니다.`)) return;

    try {
      setProcessingUserId(user.userId);
      const updatedUser = await grantMaster(user.userId);
      updateUserInList(updatedUser);
      alert('MASTER 권한이 부여되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'MASTER 권한 부여에 실패했습니다.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleRevokeMaster = async (user: AdminUserResponse) => {
    if (user.userId === loginUser?.userId) {
      alert('현재 로그인한 자기 자신의 MASTER 권한은 화면에서 해제하지 않는 것을 권장합니다.');
      return;
    }

    if (!confirm(`${user.nickname}의 MASTER 권한을 해제하고 일반 관리자로 변경하시겠습니까?`)) return;

    try {
      setProcessingUserId(user.userId);
      const updatedUser = await revokeMaster(user.userId);
      updateUserInList(updatedUser);
      alert('일반 관리자 권한으로 변경되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'MASTER 권한 해제에 실패했습니다.');
    } finally {
      setProcessingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8 pb-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">어드민 권한 관리</h1>
              <p className="text-gray-600 mt-1">
                관리자 회원가입 신청을 승인하고, 승인된 관리자 중 MASTER 권한을 관리합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">승인 대기</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">일반 관리자</p>
            <p className="text-2xl font-bold text-blue-700">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">MASTER</p>
            <p className="text-2xl font-bold text-purple-700">{stats.masters}</p>
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
                  placeholder="관리자 이메일, 닉네임, ID 검색"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['ALL', 'ADMIN_PENDING', 'ADMIN', 'MASTER'] as const).map((role) => (
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
                    {role === 'ALL' ? '전체' : role === 'ADMIN_PENDING' ? '승인 대기' : role === 'MASTER' ? 'MASTER' : '관리자'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => void loadUsers()}
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
              관리자 계정 목록을 불러오는 중입니다.
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p className="font-semibold text-gray-700">표시할 관리자 계정이 없습니다</p>
              <p className="text-sm mt-2">관리자 회원가입 신청이 들어오면 이곳에 표시됩니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-semibold">계정</th>
                    <th className="px-6 py-4 font-semibold">권한</th>
                    <th className="px-6 py-4 font-semibold">가입일</th>
                    <th className="px-6 py-4 font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const role = user.role?.toUpperCase();
                    const badge = getRoleBadge(user.role);
                    const isProcessing = processingUserId === user.userId;

                    return (
                      <tr key={user.userId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                              <UserCog size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.nickname}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <p className="text-xs text-gray-400">User ID: {user.userId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badge.style}`}>
                            {role === 'MASTER' && <Crown size={13} />}
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2 min-w-[280px]">
                            {role === 'ADMIN_PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void handleApprove(user)}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                  <CheckCircle2 size={16} />
                                  승인
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleReject(user)}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
                                >
                                  <XCircle size={16} />
                                  반려
                                </button>
                              </>
                            )}

                            {role === 'ADMIN' && (
                              <button
                                type="button"
                                onClick={() => void handleGrantMaster(user)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                              >
                                <Crown size={16} />
                                MASTER 부여
                              </button>
                            )}

                            {role === 'MASTER' && (
                              <button
                                type="button"
                                onClick={() => void handleRevokeMaster(user)}
                                disabled={isProcessing || user.userId === loginUser?.userId}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
                              >
                                MASTER 해제
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
