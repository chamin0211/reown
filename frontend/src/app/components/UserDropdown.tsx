import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import {
  BarChart3,
  ClipboardList,
  DollarSign,
  Gavel,
  HeadphonesIcon,
  Heart,
  Home,
  Lock,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  Ticket,
  Truck,
  UserCog,
} from 'lucide-react';
import { getKakaoLoginUrl } from '../api/kakaoAuthApi';
import { canUseAdminDashboard, canUseSellerCenter } from '../auth/session';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
  userRole?: string;
}

function normalizeRoleName(role?: string) {
  const normalized = role?.toUpperCase();

  if (normalized === 'ADMIN') return '관리자';
  if (normalized === 'SELLER' || normalized === 'BRAND_SELLER' || normalized === 'DESIGNER') return '셀러';

  return '일반 사용자';
}

export function UserDropdown({
  isOpen,
  onClose,
  isLoggedIn = false,
  userName,
  onLogout,
  userRole,
}: UserDropdownProps) {
  const navigate = useNavigate();

  const isSeller = canUseSellerCenter(userRole);
  const isAdmin = canUseAdminDashboard(userRole);
  const buyingCount = 2;
  const biddingCount = 5;
  const vaultValue = 12500000;
  const tierProgress = 15;

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    if (provider === 'kakao') {
      try {
        onClose();
        window.location.href = getKakaoLoginUrl();
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : '카카오 로그인 설정을 확인해주세요.');
      }
      return;
    }

    alert(`${provider} 로그인은 아직 준비 중입니다.`);
  };

  const handleMenuClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    onLogout?.();
    navigate('/', { replace: true });
  };

  if (!isOpen) return null;

  const renderMenuButton = ({
    icon,
    title,
    description,
    path,
    count,
  }: {
    icon: ReactNode;
    title: string;
    description?: string;
    path: string;
    count?: number;
  }) => (
    <button onClick={() => handleMenuClick(path)} className="w-full group">
      <div className="flex items-center justify-between hover:opacity-70 transition-opacity">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 flex items-center justify-center" style={{ color: '#101828' }}>{icon}</span>
          <div className="text-left">
            <div className="text-sm font-light" style={{ color: '#101828' }}>{title}</div>
            {description && <div className="text-xs font-light text-gray-500 mt-0.5">{description}</div>}
          </div>
        </div>
        {typeof count === 'number' && count > 0 && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
            style={{ backgroundColor: '#101828' }}
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="absolute right-0 top-full mt-2 bg-white rounded-lg z-50"
        style={{
          width: isLoggedIn ? '360px' : '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoggedIn ? (
          <div className="py-8">
            <div className="px-8 pb-8" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold" style={{ color: '#101828' }}>
                  {userName ?? '사용자'}님
                </h3>
                <span
                  className="px-3 py-1 text-xs font-medium tracking-wide text-white"
                  style={{
                    background: isAdmin
                      ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                      : isSeller
                        ? 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)'
                        : 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                    borderRadius: '4px',
                  }}
                >
                  {normalizeRoleName(userRole)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? '플랫폼 운영과 정산 현황을 관리할 수 있습니다.'
                  : isSeller
                    ? '상품, 주문, 정산 현황을 관리할 수 있습니다.'
                    : '주문과 배송 상태를 확인할 수 있습니다.'}
              </p>
            </div>

            {isAdmin ? (
              <>
                <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">관리자 메뉴</h4>
                  <div className="space-y-4">
                    {renderMenuButton({ icon: <BarChart3 className="w-4 h-4" />, title: '관리자 대시보드', description: '플랫폼 전체 현황 확인', path: '/admin' })}
                    {renderMenuButton({ icon: <Package className="w-4 h-4" />, title: '상품 승인 관리', description: '등록 상품 승인/반려 처리', path: '/admin/products' })}
                    {renderMenuButton({ icon: <DollarSign className="w-4 h-4" />, title: '수수료 수익 현황', description: 'GMV와 플랫폼 수수료 확인', path: '/admin/settlement' })}
                    {renderMenuButton({ icon: <UserCog className="w-4 h-4" />, title: '셀러 지급 목록', description: '브랜드별 정산 예정 금액 확인', path: '/admin/settlement/payout' })}
                  </div>
                </div>
              </>
            ) : isSeller ? (
              <>
                <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">판매 관리</h4>
                  <div className="space-y-4">
                    {renderMenuButton({ icon: <Store className="w-4 h-4" />, title: '셀러 센터', description: '판매자 대시보드로 이동', path: '/seller' })}
                    {renderMenuButton({ icon: <Package className="w-4 h-4" />, title: '상품 관리', description: '상품 등록/수정/승인 상태 확인', path: '/seller/products' })}
                    {renderMenuButton({ icon: <Truck className="w-4 h-4" />, title: '주문/출고 관리', description: '구매 주문과 배송 상태 처리', path: '/seller/orders' })}
                    {renderMenuButton({ icon: <DollarSign className="w-4 h-4" />, title: '정산 내역', description: '배송 완료 상품의 정산 예정액 확인', path: '/seller/settlement' })}
                    {renderMenuButton({ icon: <ClipboardList className="w-4 h-4" />, title: '브랜드 프로필', description: '브랜드 기본 정보 확인', path: '/seller/profile' })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="px-8 pt-7 pb-5" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-light text-gray-600">등급 진행률</span>
                      <span className="text-xs font-light" style={{ color: '#101828' }}>
                        VVIP까지 {tierProgress}% 남음
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(100, 100 - tierProgress)}%`,
                          background: 'linear-gradient(90deg, #101828 0%, #B8860B 100%)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-sm font-light">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">포인트</span>
                      <span className="font-medium" style={{ color: '#101828' }}>5,000P</span>
                    </div>
                    <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">쿠폰</span>
                      <span className="font-medium" style={{ color: '#101828' }}>3장</span>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">나의 거래</h4>
                  <div className="space-y-4">
                    {renderMenuButton({ icon: <ShoppingBag className="w-4 h-4" />, title: '구매 내역', description: '내 주문과 배송 상태 확인', path: '/my/buying', count: buyingCount })}
                    {renderMenuButton({ icon: <Ticket className="w-4 h-4" />, title: '펀딩 내역', description: '참여한 펀딩 확인', path: '/my/funding' })}
                    {renderMenuButton({ icon: <Gavel className="w-4 h-4" />, title: '입찰 현황', description: '리셀 입찰 상태 확인', path: '/my/bidding', count: biddingCount })}
                  </div>
                </div>

                <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h4 className="text-xs font-light text-gray-500 uppercase tracking-wider mb-5">나의 자산</h4>
                  <button onClick={() => handleMenuClick('/vault')} className="w-full hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-5 h-5" style={{ color: '#101828' }} />
                      <span className="text-sm font-medium" style={{ color: '#101828' }}>더 볼트</span>
                    </div>
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1">예상 자산</div>
                      <div className="text-lg font-semibold" style={{ color: '#101828' }}>
                        ₩{vaultValue.toLocaleString()}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="px-8 py-7" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <div className="space-y-4">
                    {renderMenuButton({ icon: <Heart className="w-4 h-4" />, title: '찜 목록', path: '/wishlist' })}
                    {renderMenuButton({ icon: <Settings className="w-4 h-4" />, title: '계정 설정', path: '/settings' })}
                    {renderMenuButton({ icon: <HeadphonesIcon className="w-4 h-4" />, title: '고객센터', path: '/support' })}
                  </div>
                </div>
              </>
            )}

            <div className="px-8 pt-7">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-sm font-light text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="w-full py-4 text-sm text-white font-light tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#101828' }}
              >
                로그인
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/signup');
                }}
                className="w-full py-4 text-sm font-light tracking-wide transition-colors hover:bg-gray-50"
                style={{ backgroundColor: '#ffffff', color: '#101828', border: '0.5px solid #101828' }}
              >
                회원가입
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('kakao')}
                className="w-full py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FEE500', color: '#191919' }}
              >
                카카오로 로그인
              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 rounded-md text-sm font-light border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                구글 로그인 준비 중
              </button>
              <button
                onClick={() => handleSocialLogin('naver')}
                className="w-full py-3 rounded-md text-sm font-light border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                네이버 로그인 준비 중
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
