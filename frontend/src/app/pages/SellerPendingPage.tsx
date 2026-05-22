import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { clearLoginUser, getLoginUser } from '../auth/session';

export function SellerPendingPage() {
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
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl">
            ⏳
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            셀러 입점 승인 대기 중입니다
          </h1>

          <p className="text-sm text-gray-600 leading-7 mb-8">
            {loginUser?.nickname ?? '셀러'}님의 셀러 계정은 생성되었지만 아직 관리자 입점 승인이 완료되지 않았습니다.<br />
            관리자가 입점 심사에서 승인하면 다시 로그인 후 셀러센터를 사용할 수 있습니다.
          </p>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-left mb-8">
            <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
              <div className="text-gray-500">이메일</div>
              <div className="font-medium text-gray-900">{loginUser?.email ?? '-'}</div>

              <div className="text-gray-500">현재 권한</div>
              <div className="font-medium text-gray-900">{loginUser?.role ?? 'SELLER_PENDING'}</div>

              <div className="text-gray-500">신청 브랜드</div>
              <div className="font-medium text-gray-900">{loginUser?.brandName ?? '승인 대기 브랜드'}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              메인으로 이동
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl bg-gray-900 text-sm text-white hover:bg-gray-800"
            >
              로그아웃 후 다시 로그인
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
