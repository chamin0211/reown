import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { clearLoginUser, getLoginUser } from '../auth/session';

export function AdminPendingPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const handleLogout = () => {
    clearLoginUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
            A
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">관리자 승인 대기 중입니다</h1>
          <p className="text-gray-600 leading-7 mb-6">
            {loginUser?.nickname ?? '관리자 신청자'}님의 관리자 계정 신청이 접수되었습니다.<br />
            MASTER 관리자가 승인하면 관리자 페이지를 사용할 수 있습니다.
          </p>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-left mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">다음 단계</h2>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>MASTER 관리자가 관리자 페이지에 로그인합니다.</li>
              <li>시스템 설정 → 어드민 권한 관리에서 신청자를 확인합니다.</li>
              <li>승인 후 다시 로그인하면 관리자 페이지 접근이 가능합니다.</li>
            </ol>
          </div>

          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-3 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              메인으로
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-3 rounded-lg bg-gray-900 text-sm text-white hover:bg-gray-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
