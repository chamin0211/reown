import { getLoginUser } from '../auth/session';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const loginUser = getLoginUser();
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(loginUser?.userId ? { "X-Actor-User-Id": String(loginUser.userId) } : {}),
        ...(loginUser?.role ? { "X-Actor-Role": String(loginUser.role) } : {}),
        ...(options.headers ?? {}),
    };

    const res = await fetch(`${API_BASE_URL}${normalizedPath}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `API 요청 실패: ${res.status}`);
    }

    return res.json();
}
