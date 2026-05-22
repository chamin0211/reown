import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import { login } from '../api/authApi';
import { getKakaoLoginUrl } from '../api/kakaoAuthApi';
import { getDefaultPathByRole, getLoginUser, saveLoginUser } from '../auth/session';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });

  useEffect(() => {
    const loginUser = getLoginUser();
    if (loginUser) {
      navigate(getDefaultPathByRole(loginUser.role), { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = getLoginUser();
    if (currentUser) {
      alert('이미 로그인되어 있습니다. 다른 계정으로 로그인하려면 먼저 로그아웃해주세요.');
      navigate(getDefaultPathByRole(currentUser.role), { replace: true });
      return;
    }

    try {
      const user = await login(formData.loginId, formData.password);

      saveLoginUser(user);

      alert(`${user.nickname}님 로그인 성공`);
      const redirectPath = searchParams.get('redirect');
      navigate(redirectPath || getDefaultPathByRole(user.role));
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error instanceof Error ? error.message : '로그인 실패. 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleKakaoLogin = () => {
    try {
      window.location.href = getKakaoLoginUrl();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '카카오 로그인 설정을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-md mx-auto px-8">
          <div>
            <h1
              className="text-4xl font-light tracking-wide mb-12 text-center"
              style={{ color: '#101828' }}
            >
              Welcome Back
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-sm font-light mb-2"
                  style={{ color: '#101828' }}
                >
                  아이디
                </label>
                <input
                  type="text"
                  id="loginId"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                  style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-light mb-2"
                  style={{ color: '#101828' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                  style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#101828', height: '56px' }}
              >
                LOGIN
              </button>

              <button
                type="button"
                onClick={handleKakaoLogin}
                className="w-full text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#FEE500', color: '#191919', height: '52px' }}
              >
                카카오로 로그인
              </button>

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full text-sm font-light tracking-widest transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#101828',
                  border: '0.5px solid #101828',
                  height: '52px',
                }}
              >
                사용자 회원가입
              </button>

              <button
                type="button"
                onClick={() => navigate('/seller/signup')}
                className="w-full text-sm font-light tracking-widest transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#101828',
                  border: '0.5px solid #d1d5db',
                  height: '52px',
                }}
              >
                셀러 전용 회원가입
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/signup')}
                className="w-full text-sm font-light tracking-widest transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#101828',
                  border: '0.5px solid #d1d5db',
                  height: '52px',
                }}
              >
                관리자 전용 신청
              </button>

              <div className="flex items-center justify-center gap-4 text-sm font-light">
                <Link
                  to="/find-account"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Find ID
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/find-account"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Find Password
                </Link>
              </div>
            </form>

            <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid #e5e7eb' }}>
              <div className="text-center text-sm font-light text-gray-600 space-y-2">
                <p>
                  일반 사용자는{' '}
                  <Link
                    to="/signup"
                    className="font-light transition-colors"
                    style={{ color: '#101828' }}
                  >
                    사용자 회원가입
                  </Link>
                  을 이용해주세요.
                </p>
                <p>
                  셀러와 관리자는 각각 전용 회원가입 경로에서 신청 후 승인 절차를 거칩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
