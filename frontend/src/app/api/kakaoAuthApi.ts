const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type KakaoLoginUser = {
  userId: number;
  email: string;
  nickname: string;
  role: string;
};

function assertKakaoEnv() {
  if (!KAKAO_REST_API_KEY || KAKAO_REST_API_KEY.includes("REST_API_KEY")) {
    throw new Error("VITE_KAKAO_REST_API_KEY에 카카오 Developers의 실제 REST API 키를 넣어주세요.");
  }

  if (!KAKAO_REDIRECT_URI) {
    throw new Error("VITE_KAKAO_REDIRECT_URI가 설정되지 않았습니다.");
  }
}

export function getKakaoLoginUrl() {
  assertKakaoEnv();

  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: "code",
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

export async function kakaoLogin(code: string): Promise<KakaoLoginUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "카카오 로그인 실패");
  }

  return response.json();
}
