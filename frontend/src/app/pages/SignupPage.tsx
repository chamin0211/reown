import { useState } from 'react';
import { Link } from 'react-router';
import { Smartphone } from 'lucide-react';

export function SignupPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleVerifyIdentity = () => {
    // TODO: 실제 본인인증 로직 연동
    console.log('본인인증 시작');
    // 시뮬레이션: 본인인증 완료 후 자동 입력
    setIsVerified(true);
    setFormData({
      ...formData,
      name: '홍길동',
      phone: '010-1234-5678',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreements({
      terms: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };
    setAgreements(newAgreements);
    setAgreeAll(newAgreements.terms && newAgreements.privacy && newAgreements.marketing);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/">
          <h1
            className="text-4xl font-light tracking-wider text-center mb-16 cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: '#101828' }}
          >
            re:own
          </h1>
        </Link>

        {/* Title */}
        <h2
          className="text-3xl font-light tracking-wide text-center mb-4"
          style={{ color: '#101828' }}
        >
          Join re:own
        </h2>

        {/* Subtitle */}
        <p className="text-sm font-light text-gray-500 text-center mb-12">
          Identity verification is required to join re:own.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verify Identity Button */}
          {!isVerified && (
            <button
              type="button"
              onClick={handleVerifyIdentity}
              className="w-full flex items-center justify-center gap-3 text-sm font-light tracking-wide transition-all hover:opacity-80"
              style={{
                border: '0.5px solid #101828',
                color: '#101828',
                height: '56px'
              }}
            >
              <Smartphone className="w-5 h-5" />
              Verify Identity
            </button>
          )}

          {/* Name (Auto-filled after verification) */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-light mb-2"
              style={{ color: '#101828' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isVerified}
              className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
              style={{ border: '0.5px solid #d1d5db', height: '52px' }}
              placeholder={isVerified ? '' : 'Will be auto-filled after verification'}
              required
            />
          </div>

          {/* Phone Number (Auto-filled after verification) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-light mb-2"
              style={{ color: '#101828' }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isVerified}
              className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
              style={{ border: '0.5px solid #d1d5db', height: '52px' }}
              placeholder={isVerified ? '' : 'Will be auto-filled after verification'}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-light mb-2"
              style={{ color: '#101828' }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
              style={{ border: '0.5px solid #d1d5db', height: '52px' }}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Terms Agreement */}
          <div className="pt-4 space-y-4">
            <div
              className="p-4"
              style={{ border: '0.5px solid #e5e7eb', borderRadius: '4px' }}
            >
              {/* Agree All */}
              <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                <input
                  type="checkbox"
                  id="agreeAll"
                  checked={agreeAll}
                  onChange={handleAgreeAll}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: '#101828' }}
                />
                <label htmlFor="agreeAll" className="text-sm font-light cursor-pointer" style={{ color: '#101828' }}>
                  Agree to all terms
                </label>
              </div>

              {/* Individual Terms */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreements.terms}
                    onChange={() => handleAgreementChange('terms')}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: '#101828' }}
                  />
                  <label htmlFor="terms" className="text-xs font-light text-gray-600 cursor-pointer">
                    Terms of Service (Required)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={agreements.privacy}
                    onChange={() => handleAgreementChange('privacy')}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: '#101828' }}
                  />
                  <label htmlFor="privacy" className="text-xs font-light text-gray-600 cursor-pointer">
                    Privacy Policy (Required)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={agreements.marketing}
                    onChange={() => handleAgreementChange('marketing')}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: '#101828' }}
                  />
                  <label htmlFor="marketing" className="text-xs font-light text-gray-600 cursor-pointer">
                    Marketing Communications (Optional)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isVerified || !agreements.terms || !agreements.privacy}
            className="w-full text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#101828', height: '56px' }}
          >
            CREATE ACCOUNT
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm font-light text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-light transition-colors" style={{ color: '#101828' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
