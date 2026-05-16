export type AppRole = 'USER' | 'SELLER' | 'ADMIN' | 'BRAND_SELLER' | 'DESIGNER';

export interface LoginUser {
  userId: number;
  email: string;
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

  // 이전 패치에서는 로그인 정보를 localStorage에 저장해서 브라우저를 껐다 켜도
  // 셀러/관리자 로그인 상태가 계속 남았습니다. 이제 로그인은 sessionStorage만 사용합니다.
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
  if (upperRole === 'ADMIN') return 'ADMIN';
  if (upperRole === 'USER') return 'USER';

  return null;
}

export function isSellerRole(role?: string | null): boolean {
  return normalizeRole(role) === 'SELLER';
}

export function isAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === 'ADMIN';
}

export function canUseSellerCenter(role?: string | null): boolean {
  return normalizeRole(role) === 'SELLER';
}

export function canUseAdminDashboard(role?: string | null): boolean {
  return normalizeRole(role) === 'ADMIN';
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

  // 기존 셀러/관리자 정보가 남아 있으면 다른 계정으로 로그인할 때 brandId가 섞일 수 있어서 먼저 정리합니다.
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

  if (normalizedRole === 'ADMIN') return '/admin';
  if (normalizedRole === 'SELLER') return '/seller';

  return '/';
}
