import { Link } from 'react-router';
import { Header } from '../components/Header';
import { ShieldCheck } from 'lucide-react';

export function ResellRegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-20">
        <div className="max-w-[800px] mx-auto px-8 text-center border border-gray-200 rounded-3xl p-12">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-blue-700" />
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#101828' }}>프리미엄 리셀 등록 안내</h1>
          <p className="text-gray-600 leading-7 mb-8">
            RE:OWN의 리셀은 일반 상품 중고 판매가 아니라, 관리자 검수를 통과한 희소 상품을 입찰형으로 거래하는 Archive Zone입니다. 일반 사용자의 구매내역에서 바로 리셀 등록하는 기능은 MVP에서 제외했습니다.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/resell" className="px-6 py-3 rounded-xl bg-[#101828] text-white font-semibold">리셀 마켓 보기</Link>
            <Link to="/my/bidding" className="px-6 py-3 rounded-xl border border-gray-300 font-semibold">내 입찰 현황</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
