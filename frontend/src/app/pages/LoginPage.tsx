import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { login } from '../api/authApi';

export function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await login(formData.email, formData.password);

      localStorage.setItem('loginUser', JSON.stringify(user));

      alert(`${user.nickname}님 로그인 성공`);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 실패. 이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-md mx-auto px-8">
          {/* Login Form */}
          <div>
            {/* Title */}
            <h1
              className="text-4xl font-light tracking-wide mb-12 text-center"
              style={{ color: '#101828' }}
            >
              Welcome Back
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-light mb-2"
                  style={{ color: '#101828' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                  style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
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
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#101828', height: '56px' }}
              >
                LOGIN
              </button>

              {/* Find ID / Password Links */}
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

            {/* Sign-up Link */}
            <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid #e5e7eb' }}>
              <p className="text-center text-sm font-light text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-light transition-colors"
                  style={{ color: '#101828' }}
                >
                  Join re:own
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
