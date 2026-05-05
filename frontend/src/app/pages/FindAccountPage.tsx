import { useState } from 'react';
import { Link } from 'react-router';
import { Smartphone } from 'lucide-react';

export function FindAccountPage() {
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyWithPhone = () => {
    // TODO: 실제 본인인증 로직 연동
    console.log('본인인증 시작');
    // 시뮬레이션: 본인인증 완료
    setIsVerified(true);
  };

  const handleFindAccount = () => {
    if (!isVerified) return;

    if (activeTab === 'id') {
      console.log('Finding ID with verified identity');
      // TODO: 본인인증 완료 후 아이디 찾기 로직
    } else {
      console.log('Finding Password with verified identity');
      // TODO: 본인인증 완료 후 비밀번호 찾기 로직
    }
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

        {/* Tabs */}
        <div className="flex mb-12" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
          <button
            onClick={() => {
              setActiveTab('id');
              setIsVerified(false);
            }}
            className="flex-1 pb-4 text-base font-light tracking-wide transition-colors relative"
            style={{
              color: activeTab === 'id' ? '#101828' : '#9ca3af',
            }}
          >
            Find ID
            {activeTab === 'id' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: '2px', backgroundColor: '#101828' }}
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              setIsVerified(false);
            }}
            className="flex-1 pb-4 text-base font-light tracking-wide transition-colors relative"
            style={{
              color: activeTab === 'password' ? '#101828' : '#9ca3af',
            }}
          >
            Find Password
            {activeTab === 'password' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: '2px', backgroundColor: '#101828' }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div>
          {/* Title */}
          <h2
            className="text-2xl font-light tracking-wide text-center mb-4"
            style={{ color: '#101828' }}
          >
            {activeTab === 'id' ? 'Find Your ID' : 'Reset Your Password'}
          </h2>

          {/* Subtitle */}
          <p className="text-sm font-light text-gray-500 text-center mb-12">
            Verify your identity to find your registered account information.
          </p>

          {/* Verify with Mobile Phone Button */}
          <div className="space-y-6">
            <button
              type="button"
              onClick={handleVerifyWithPhone}
              disabled={isVerified}
              className="w-full flex items-center justify-center gap-3 text-base font-light tracking-wide transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: '0.5px solid #101828',
                color: isVerified ? '#6b7280' : '#101828',
                height: '64px',
                backgroundColor: isVerified ? '#f9fafb' : 'transparent'
              }}
            >
              <Smartphone className="w-6 h-6" />
              {isVerified ? 'Identity Verified ✓' : 'Verify with Mobile Phone'}
            </button>

            {/* Success Message */}
            {isVerified && (
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm font-light text-gray-600">
                  {activeTab === 'id'
                    ? 'Your identity has been verified. Click below to retrieve your ID.'
                    : 'Your identity has been verified. Click below to reset your password.'
                  }
                </p>
              </div>
            )}

            {/* Find My Account Button */}
            <button
              type="button"
              onClick={handleFindAccount}
              disabled={!isVerified}
              className="w-full text-sm text-white font-light tracking-widest transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#101828', height: '56px' }}
            >
              FIND MY ACCOUNT
            </button>
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="mt-12 text-center">
          <p className="text-sm font-light text-gray-600">
            Remember your account?{' '}
            <Link to="/login" className="font-light transition-colors" style={{ color: '#101828' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
