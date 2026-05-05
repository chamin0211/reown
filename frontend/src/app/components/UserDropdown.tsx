import { useNavigate } from 'react-router';
import { ShoppingBag, TrendingUp, Gavel, Shield, Heart, Settings, HeadphonesIcon, LogOut, Ticket, Lock } from 'lucide-react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function UserDropdown({
                                 isOpen,
                                 onClose,
                                 isLoggedIn = false,
                                 userName,
                                 onLogout,
                             }: UserDropdownProps) {
    const navigate = useNavigate();

    // User stats
    const buyingCount = 2;
    const sellingCount = 0;
    const biddingCount = 5;
    const vaultValue = 12500000;
    const tierProgress = 15;

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    onClose();
    // TODO: 나중에 실제 소셜 로그인 연동 구현
    console.log(`${provider} 로그인 처리`);
  };

  const handleMenuClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    onLogout?.();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Menu */}
      <div
        className="absolute right-0 top-full mt-2 bg-white rounded-lg z-50"
        style={{
          width: isLoggedIn ? '360px' : '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoggedIn ? (
          /* Logged-in State */
          <div className="py-8">
            {/* Section 1: User Identity & Motivation */}
            <div className="px-8 pb-8" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              {/* Name & VIP Badge */}
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-lg font-semibold" style={{ color: '#101828' }}>
                    Welcome, {userName ?? 'User'}
                </h3>
                <span
                  className="px-3 py-1 text-xs font-medium tracking-wide text-white"
                  style={{
                    background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                    borderRadius: '4px'
                  }}
                >
                  VIP
                </span>
              </div>

              {/* Tier Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-light text-gray-600">Tier Progress</span>
                  <span className="text-xs font-light" style={{ color: '#101828' }}>
                    {tierProgress}% more to VVIP
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${85 + tierProgress}%`,
                      background: 'linear-gradient(90deg, #101828 0%, #B8860B 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Stats Row: Points & Coupons */}
              <div className="flex items-center gap-5 text-sm font-light">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-medium" style={{ color: '#101828' }}>5,000P</span>
                </div>
                <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Coupons:</span>
                  <span className="font-medium" style={{ color: '#101828' }}>3</span>
                </div>
              </div>
            </div>

            {/* Section 2: Real-time Trading Status */}
            <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">
                My Trading
              </h4>
              <div className="space-y-4">
                {/* Buying History */}
                <button
                  onClick={() => handleMenuClick('/my/buying')}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4" style={{ color: '#101828' }} />
                      <div className="text-left">
                        <div className="text-sm font-light" style={{ color: '#101828' }}>
                          Buying History
                        </div>
                        <div className="text-xs font-light text-gray-500 mt-0.5">
                          1 Item in transit
                        </div>
                      </div>
                    </div>
                    {buyingCount > 0 && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: '#101828' }}
                      >
                        {buyingCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* Selling History */}
                <button
                  onClick={() => handleMenuClick('/my/selling')}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4" style={{ color: '#101828' }} />
                      <div className="text-sm font-light" style={{ color: '#101828' }}>
                        Selling History
                      </div>
                    </div>
                    {sellingCount > 0 && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: '#101828' }}
                      >
                        {sellingCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* Bidding Status */}
                <button
                  onClick={() => handleMenuClick('/my/bidding')}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-3">
                      <Gavel className="w-4 h-4" style={{ color: '#101828' }} />
                      <div className="text-left">
                        <div className="text-sm font-light" style={{ color: '#101828' }}>
                          Bidding Status
                        </div>
                        <div className="text-xs font-light text-gray-500 mt-0.5">
                          Highest bidder on 2 items
                        </div>
                      </div>
                    </div>
                    {biddingCount > 0 && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: '#101828' }}
                      >
                        {biddingCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Section 3: The Vault (Asset Emphasis) */}
            <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">
                My Asset
              </h4>
              <button
                onClick={() => handleMenuClick('/vault')}
                className="w-full hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5" style={{ color: '#101828' }} />
                  <span className="text-sm font-medium" style={{ color: '#101828' }}>
                    My Vault
                  </span>
                </div>
                <div className="p-[0px]">
                  <div className="text-xs font-light text-gray-500 mb-1">Estimated Asset</div>
                  <div className="text-lg font-semibold" style={{ color: '#101828' }}>
                    ₩{vaultValue.toLocaleString()}
                  </div>
                </div>
              </button>
            </div>

            {/* Section 4: Maintenance & Log */}
            <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              <div className="space-y-4">
                <button
                  onClick={() => handleMenuClick('/wishlist')}
                  className="w-full flex items-center gap-3 text-sm font-light hover:opacity-70 transition-opacity"
                  style={{ color: '#101828' }}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button
                  onClick={() => handleMenuClick('/settings')}
                  className="w-full flex items-center gap-3 text-sm font-light hover:opacity-70 transition-opacity"
                  style={{ color: '#101828' }}
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
                <button
                  onClick={() => handleMenuClick('/support')}
                  className="w-full flex items-center gap-3 text-sm font-light hover:opacity-70 transition-opacity"
                  style={{ color: '#101828' }}
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Customer Service
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="px-8 pt-7">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-sm font-light text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          /* Logged-out State */
          <div className="p-8 space-y-6">
            {/* Login/Sign Up Button */}
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full py-4 text-sm text-white font-light tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#101828' }}
            >
              Login / Sign Up
            </button>

            {/* Social Login Icons */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ border: '0.5px solid #e5e7eb' }}
                aria-label="Login with Google"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleSocialLogin('kakao')}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ border: '0.5px solid #e5e7eb' }}
                aria-label="Login with Kakao"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#3C1E1E"
                    d="M12 3C6.477 3 2 6.477 2 10.75c0 2.758 1.826 5.176 4.572 6.567l-1.177 4.293a.5.5 0 00.725.576l4.923-3.216c.318.026.64.04.957.04 5.523 0 10-3.477 10-7.76S17.523 3 12 3z"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleSocialLogin('naver')}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ border: '0.5px solid #e5e7eb' }}
                aria-label="Login with Naver"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#03C75A"
                    d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
                  />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid #e5e7eb' }} />

            {/* Customer Service Link */}
            <div className="text-center">
              <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light">
                Customer Service
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
