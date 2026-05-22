const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const res = await fetch(`${API_BASE_URL}${normalizedPath}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `API 요청 실패: ${res.status}`);
    }

    return res.json();
}
