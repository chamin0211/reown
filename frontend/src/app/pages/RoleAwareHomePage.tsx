import { Navigate } from 'react-router';
import { getDefaultPathByRole, getLoginUser, normalizeRole } from '../auth/session';
import { MainPage } from './MainPage';

export function RoleAwareHomePage() {
  const loginUser = getLoginUser();
  const role = normalizeRole(loginUser?.role);

  // 비로그인 또는 일반 사용자만 사용자 메인 페이지를 볼 수 있습니다.
  // 셀러/관리자가 로그인한 상태에서 브라우저 뒤로가기로 / 에 도착하면
  // 사용자 메인으로 빠지지 않고 각자의 기본 화면으로 다시 보냅니다.
  if (role === 'ADMIN' || role === 'SELLER') {
    return <Navigate to={getDefaultPathByRole(role)} replace />;
  }

  return <MainPage />;
}
