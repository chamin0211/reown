import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { signup } from '../api/authApi';

export function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      alert('이메일을 입력해주세요.');
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

    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자 이상 입력해주세요.');
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
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      role: 'USER',
    })
        .then((user) => {
          // 회원가입 후 자동 로그인하지 않고, 사용자가 직접 로그인하도록 처리합니다.
          localStorage.removeItem('loginUser');

          alert(`${user.nickname}님 회원가입이 완료되었습니다. 로그인 페이지에서 다시 로그인해주세요.`);
          navigate('/login');
        })
        .catch((error) => {
          console.error('회원가입 실패:', error);
          alert('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
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
                새로운 패션 경험을 시작하세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-light text-gray-700 mb-2"
                >
                  Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 text-base text-gray-900 font-light outline-none"
                    style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                    placeholder="example@reown.com"
                />
              </div>

              <div>
                <label
                    htmlFor="nickname"
                    className="block text-sm font-light text-gray-700 mb-2"
                >
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
                <label
                    htmlFor="password"
                    className="block text-sm font-light text-gray-700 mb-2"
                >
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
                    placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div>
                <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-light text-gray-700 mb-2"
                >
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
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-sm text-white tracking-widest font-light transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#101828', height: '56px' }}
              >
                {loading ? 'JOINING...' : 'JOIN RE:OWN'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 font-light">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-900 underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
  );
}