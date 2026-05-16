import { MainPage } from './MainPage';

export function RoleAwareHomePage() {
  // 셀러/관리자도 사용자 메인 페이지에서 실제 노출 상품을 확인할 수 있도록
  // role 기반 자동 리다이렉트를 제거했습니다.
  // 계정 전환 방지는 LoginPage에서 처리합니다.
  return <MainPage />;
}
