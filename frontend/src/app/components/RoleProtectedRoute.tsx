import { ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { AppRole, clearLoginUser, getLoginUser, normalizeRole } from '../auth/session';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const location = useLocation();
  const loginUser = getLoginUser();

  if (!loginUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const normalizedRole = normalizeRole(loginUser.role);
  const normalizedAllowedRoles = allowedRoles
    .map((role) => normalizeRole(role))
    .filter(Boolean);

  if (!normalizedRole || !normalizedAllowedRoles.includes(normalizedRole)) {
    return <AccessDenied role={loginUser.role} />;
  }

  return <>{children}</>;
}

function AccessDenied({ role }: { role?: string }) {
  const navigate = useNavigate();

  const handleRelogin = () => {
    clearLoginUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
          !
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
        <p className="text-sm text-gray-600 leading-6 mb-6">
          현재 로그인 권한은 <b>{role ?? 'UNKNOWN'}</b> 입니다.<br />
          다른 권한 계정으로 접속하려면 먼저 로그아웃해야 합니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-5 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
            메인으로
          </Link>
          <button
            type="button"
            onClick={handleRelogin}
            className="px-5 py-3 rounded-lg bg-gray-900 text-sm text-white hover:bg-gray-800"
          >
            로그아웃 후 다시 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
