import { createContext, useContext, ReactNode } from 'react';
import { canUseSellerCenter, getLoginUser, LoginUser, normalizeRole } from '../../auth/session';

type RoleType = 'BRAND_SELLER' | 'DESIGNER' | 'ADMIN' | 'USER';

interface AuthContextType {
  roleType: RoleType;
  brandId: number;
  brandName: string;
  loginUser: LoginUser | null;
  isLoggedIn: boolean;
  canAccessSellerCenter: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getRoleType(role?: string | null): RoleType {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'ADMIN') return 'ADMIN';
  if (normalizedRole === 'SELLER') return 'BRAND_SELLER';

  return 'USER';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const loginUser = getLoginUser();
  const savedBrandId = Number(localStorage.getItem('sellerBrandId') ?? loginUser?.brandId ?? '1');
  const savedBrandName = localStorage.getItem('sellerBrandName') ?? loginUser?.brandName;

  const auth: AuthContextType = {
    roleType: getRoleType(loginUser?.role),
    brandId: Number.isFinite(savedBrandId) && savedBrandId > 0 ? savedBrandId : 1,
    brandName: savedBrandName || loginUser?.nickname || 'RE:OWN Seller',
    loginUser,
    isLoggedIn: !!loginUser,
    canAccessSellerCenter: canUseSellerCenter(loginUser?.role),
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
