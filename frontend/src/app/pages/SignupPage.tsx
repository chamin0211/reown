import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { checkLoginId, signup } from '../api/authApi';

const LOGIN_ID_REGEX = /^[a-z0-9_]{4,20}$/;

export function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [loading, setLoading] = useState(false);
  const [checkingLoginId, setCheckingLoginId] = useState(false);
  const [loginIdAvailable, setLoginIdAvailable] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'loginId'
      ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    if (e.target.name === 'loginId') {
      setLoginIdAvailable(null);
    }
  };

  const handleCheckLoginId = async () => {
    const loginId = formData.loginId.trim();

    if (!LOGIN_ID_REGEX.test(loginId)) {
      alert('아이디는 4~20자의 영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.');
      setLoginIdAvailable(false);
      return;
    }

    setCheckingLoginId(true);
    try {
      const result = await checkLoginId(loginId);
      setLoginIdAvailable(result.available);
      alert(result.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      setLoginIdAvailable(false);
      alert(error instanceof Error ? error.message : '아이디 중복 확인에 실패했습니다.');
    } finally {
      setCheckingLoginId(false);
    }
  };

  const validateForm = () => {
    if (!LOGIN_ID_REGEX.test(formData.loginId.trim())) {
      alert('아이디는 4~20자의 영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.');
      return false;
    }

    if (loginIdAvailable !== true) {
      alert('아이디 중복 확인을 먼저 해주세요.');
      return false;
    }

    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return false;
    }

    if (!formData.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return false;
    }

    if (formData.password.length < 8) {
      alert('비밀번호는 최소 8자 이상 입력해주세요.');
      return false;
    }

    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      alert('비밀번호는 영문과 숫자를 모두 포함해야 합니다.');
      return false;
    }

    if (/\s/.test(formData.password)) {
      alert('비밀번호에는 공백을 사용할 수 없습니다.');
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    signup({
      accountType: 'USER',
      loginId: formData.loginId.trim(),
      password: formData.password,
      nickname: formData.nickname.trim(),
    })
      .then((user) => {
        sessionStorage.removeItem('loginUser');
        localStorage.removeItem('loginUser');

        alert(`${user.nickname}님 회원가입이 완료되었습니다. 로그인 페이지에서 다시 로그인해주세요.`);
        navigate('/login');
      })
      .catch((error) => {
        console.error('회원가입 실패:', error);
        alert(error instanceof Error ? error.message : '회원가입에 실패했습니다. 이미 사용 중인 아이디일 수 있습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-3">
              Join re:own
            </h1>
            <p className="text-sm text-gray-500 font-light">
              일반 사용자 계정을 생성하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">사용자 회원가입</p>
              <p className="text-xs text-gray-500 mt-1">
                상품 구매, 펀딩 참여, 리셀 입찰을 이용할 수 있는 일반 사용자 계정입니다.
              </p>
            </div>

            <div>
              <label htmlFor="loginId" className="block text-sm font-light text-gray-700 mb-2">
                아이디
              </label>
              <div className="flex gap-2">
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  value={formData.loginId}
                  onChange={handleChange}
                  className="flex-1 px-4 text-base text-gray-900 font-light outline-none"
                  style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                  placeholder="4~20자 영문 소문자, 숫자, _"
                  autoComplete="username"
                />
                <button
                  type="button"
                  onClick={handleCheckLoginId}
                  disabled={checkingLoginId}
                  className="px-4 text-sm font-medium border border-gray-900 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                >
                  {checkingLoginId ? '확인중' : '중복확인'}
                </button>
              </div>
              {loginIdAvailable === true && (
                <p className="text-xs text-blue-600 mt-2">사용 가능한 아이디입니다.</p>
              )}
              {loginIdAvailable === false && (
                <p className="text-xs text-red-600 mt-2">아이디를 다시 확인해주세요.</p>
              )}
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-light text-gray-700 mb-2">
                Nickname
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 text-base text-gray-900 font-light outline-none"
                style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 text-base text-gray-900 font-light outline-none"
                style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                placeholder="영문+숫자 포함 8자 이상"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-light text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="w-full px-4 text-base text-gray-900 font-light outline-none"
                style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                placeholder="비밀번호를 다시 입력하세요"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#101828', height: '56px' }}
            >
              {loading ? '가입 처리 중...' : 'JOIN RE:OWN'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-light space-y-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 underline">
                Login
              </Link>
            </p>
            <p>
              브랜드 셀러이신가요?{' '}
              <Link to="/seller/apply" className="text-gray-900 underline">
                셀러 입점 신청
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
