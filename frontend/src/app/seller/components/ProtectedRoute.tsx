import { ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { clearLoginUser } from '../../auth/session';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Array<'BRAND_SELLER' | 'DESIGNER' | 'ADMIN'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isLoggedIn, roleType } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!allowedRoles.includes(roleType as 'BRAND_SELLER' | 'DESIGNER' | 'ADMIN')) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}

function AccessDenied() {
  const navigate = useNavigate();

  const handleRelogin = () => {
    clearLoginUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-xl p-8 border-2 border-red-200 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-2xl">
          !
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h2>
        <p className="text-gray-600 mb-6">
          이 페이지는 셀러 또는 관리자 권한이 필요합니다.<br />
          다른 권한 계정으로 접속하려면 먼저 로그아웃해야 합니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            메인으로
          </Link>
          <button
            type="button"
            onClick={handleRelogin}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            로그아웃 후 다시 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
