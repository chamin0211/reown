import { useState } from 'react';
import { useNavigate } from 'react-router';

export function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'administrator' | 'seller'>('administrator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">re:own</h1>
          <p className="text-gray-600">플랫폼 관리 시스템</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* User Type Toggle */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setUserType('administrator')}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                userType === 'administrator'
                  ? 'bg-[#1e40af] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Administrator
            </button>
            <button
              onClick={() => setUserType('seller')}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                userType === 'seller'
                  ? 'bg-[#1e40af] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@reown.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember Me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1e40af] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md mb-4"
            >
              Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 re:own. All rights reserved.
        </p>
      </div>
    </div>
  );
}
