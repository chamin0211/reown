export type AppRole = 'USER' | 'SELLER' | 'SELLER_PENDING' | 'ADMIN_PENDING' | 'ADMIN' | 'MASTER' | 'BRAND_SELLER' | 'DESIGNER';

export interface LoginUser {
  userId: number;
  loginId?: string;
  email?: string;
  nickname: string;
  role: AppRole | string;
  brandId?: number | null;
  brandName?: string | null;
}

const LOGIN_USER_KEY = 'loginUser';
const SELLER_BRAND_ID_KEY = 'sellerBrandId';
const SELLER_BRAND_NAME_KEY = 'sellerBrandName';
export const SESSION_CHANGED_EVENT = 'reown-session-changed';

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function removeLegacyPersistentSession(): void {
  const storage = getLocalStorage();
  if (!storage) return;

  storage.removeItem(LOGIN_USER_KEY);
  storage.removeItem(SELLER_BRAND_ID_KEY);
  storage.removeItem(SELLER_BRAND_NAME_KEY);
}

function notifySessionChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
  }
}

export function normalizeRole(role?: string | null): AppRole | null {
  if (!role) return null;

  const upperRole = role.toUpperCase();

  if (upperRole === 'BRAND_SELLER') return 'SELLER';
  if (upperRole === 'DESIGNER') return 'SELLER';
  if (upperRole === 'SELLER') return 'SELLER';
  if (upperRole === 'SELLER_PENDING') return 'SELLER_PENDING';
  if (upperRole === 'MASTER') return 'MASTER';
  if (upperRole === 'ADMIN') return 'ADMIN';
  if (upperRole === 'ADMIN_PENDING') return 'ADMIN_PENDING';
  if (upperRole === 'USER') return 'USER';

  return null;
}

export function isSellerRole(role?: string | null): boolean {
  return normalizeRole(role) === 'SELLER';
}

export function isAdminRole(role?: string | null): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'ADMIN' || normalizedRole === 'MASTER';
}

export function canUseSellerCenter(role?: string | null): boolean {
  return normalizeRole(role) === 'SELLER';
}

export function canUseAdminDashboard(role?: string | null): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'ADMIN' || normalizedRole === 'MASTER';
}

export function getLoginUser(): LoginUser | null {
  removeLegacyPersistentSession();

  try {
    const storage = getSessionStorage();
    const savedUser = storage?.getItem(LOGIN_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function saveLoginUser(user: LoginUser): void {
  removeLegacyPersistentSession();

  const storage = getSessionStorage();
  if (!storage) return;

  storage.removeItem(SELLER_BRAND_ID_KEY);
  storage.removeItem(SELLER_BRAND_NAME_KEY);
  storage.setItem(LOGIN_USER_KEY, JSON.stringify(user));

  if (user.brandId) {
    storage.setItem(SELLER_BRAND_ID_KEY, String(user.brandId));
  }

  if (user.brandName) {
    storage.setItem(SELLER_BRAND_NAME_KEY, user.brandName);
  }

  notifySessionChanged();
}

export function clearLoginUser(): void {
  const storage = getSessionStorage();
  storage?.removeItem(LOGIN_USER_KEY);
  storage?.removeItem(SELLER_BRAND_ID_KEY);
  storage?.removeItem(SELLER_BRAND_NAME_KEY);
  removeLegacyPersistentSession();
  notifySessionChanged();
}

export function getSellerBrandId(): number | null {
  const storage = getSessionStorage();
  const rawBrandId = storage?.getItem(SELLER_BRAND_ID_KEY);
  const brandId = rawBrandId ? Number(rawBrandId) : NaN;
  return Number.isFinite(brandId) ? brandId : null;
}

export function getSellerBrandName(): string | null {
  const storage = getSessionStorage();
  return storage?.getItem(SELLER_BRAND_NAME_KEY) ?? null;
}

export function getDefaultPathByRole(role?: string | null): string {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'ADMIN' || normalizedRole === 'MASTER') return '/admin';
  if (normalizedRole === 'ADMIN_PENDING') return '/admin/pending';
  if (normalizedRole === 'SELLER') return '/seller';
  if (normalizedRole === 'SELLER_PENDING') return '/seller/pending';

  return '/';
}
