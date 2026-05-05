import { Shield, CheckCircle } from 'lucide-react';

export function DigitalCertificate() {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            디지털 정품 보증서
            <CheckCircle className="w-5 h-5" />
          </h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            이 제품은 블록체인 기반 정품 보증서가 포함됩니다. 구매 후 마이페이지에서
            NFT 형태의 디지털 보증서를 확인하실 수 있으며, 리셀 시 정품 인증 자료로
            활용 가능합니다.
          </p>
          <button className="mt-4 text-sm font-semibold text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            자세히 알아보기
          </button>
        </div>
      </div>
    </div>
  );
}
