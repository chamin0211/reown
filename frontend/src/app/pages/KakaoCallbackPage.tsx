import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { kakaoLogin } from '../api/kakaoAuthApi';
import { getDefaultPathByRole, saveLoginUser } from '../auth/session';

export function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('카카오 로그인 처리 중입니다...');

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          setMessage(`카카오 로그인 실패: ${errorDescription ?? error}`);
          return;
        }

        if (!code) {
          setMessage('카카오 인증 코드가 없습니다. 다시 로그인해주세요.');
          return;
        }

        const user = await kakaoLogin(code);
        saveLoginUser(user);

        setMessage('카카오 로그인 성공! 이동합니다.');
        setTimeout(() => {
          navigate(getDefaultPathByRole(user.role), { replace: true });
          window.location.reload();
        }, 300);
      } catch (error) {
        console.error('카카오 로그인 처리 실패:', error);
        setMessage('카카오 로그인 처리 중 오류가 발생했습니다. 백엔드 콘솔과 카카오 키 설정을 확인해주세요.');
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-40 text-center">
        <h1 className="text-2xl font-light" style={{ color: '#101828' }}>
          {message}
        </h1>
      </div>
    </div>
  );
}
