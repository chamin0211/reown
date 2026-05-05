import { DigitalCertificate } from '../data/digitalCertificate';
import { Badge } from './ui/badge';
import { Shield, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

interface VaultCertificateCardProps {
  certificate: DigitalCertificate;
  onClick: () => void;
}

export function VaultCertificateCard({ certificate, onClick }: VaultCertificateCardProps) {
  // 상태별 시각적 표현
  const getStatusConfig = () => {
    switch (certificate.ownershipStatus) {
      case 'ISSUED':
        return {
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300',
          badgeVariant: 'secondary' as const,
          badgeText: '미활성화',
          icon: <ShieldAlert className="w-5 h-5 text-gray-400" />,
          iconBg: 'bg-gray-100',
          overlayText: 'NFC 태그가 필요합니다',
          overlayOpacity: 'bg-black/60',
        };
      case 'ACTIVATED':
        return {
          bgGradient: 'from-blue-50 to-white',
          borderColor: 'border-blue-300',
          badgeVariant: 'default' as const,
          badgeText: '정품 인증',
          icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
          iconBg: 'bg-blue-100',
          overlayText: null,
          overlayOpacity: '',
        };
      case 'TRANSFERRING':
        return {
          bgGradient: 'from-yellow-50 to-white',
          borderColor: 'border-yellow-400',
          badgeVariant: 'outline' as const,
          badgeText: '이전 진행중',
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          overlayText: '소유권 이전 진행중',
          overlayOpacity: 'bg-yellow-500/20',
        };
      case 'OWNED':
        return {
          bgGradient: 'from-white to-blue-50',
          borderColor: 'border-blue-600',
          badgeVariant: 'default' as const,
          badgeText: '소유 완료',
          icon: <Shield className="w-5 h-5 text-blue-800" />,
          iconBg: 'bg-blue-200',
          overlayText: null,
          overlayOpacity: '',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer rounded-lg border-2 ${statusConfig.borderColor} 
        bg-gradient-to-br ${statusConfig.bgGradient} 
        overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={certificate.productImageUrl}
          alt={certificate.productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* 비활성화 오버레이 */}
        {statusConfig.overlayText && (
          <div className={`absolute inset-0 ${statusConfig.overlayOpacity} flex items-center justify-center`}>
            <div className="text-white text-center px-4">
              <p className="text-sm font-semibold">{statusConfig.overlayText}</p>
            </div>
          </div>
        )}

        {/* 상태 배지 */}
        <div className="absolute top-3 right-3">
          <Badge variant={statusConfig.badgeVariant} className="shadow-md">
            {statusConfig.badgeText}
          </Badge>
        </div>

        {/* NFC 활성화 아이콘 */}
        <div className={`absolute top-3 left-3 ${statusConfig.iconBg} rounded-full p-2 shadow-md`}>
          {statusConfig.icon}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{certificate.brandName}</p>
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {certificate.productName}
            </h3>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Serial No.</span>
            <span className="font-mono text-gray-700 text-[10px]">{certificate.serialNumber}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Token ID</span>
            <span className="font-mono text-gray-700 text-[10px]">{certificate.tokenId}</span>
          </div>
        </div>

        {/* NFC 활성화 정보 */}
        {certificate.nfcActivated && certificate.nfcActivatedAt && (
          <div className="pt-2 flex items-center gap-1 text-xs text-blue-600">
            <CheckCircle className="w-3 h-3" />
            <span>인증 완료: {new Date(certificate.nfcActivatedAt).toLocaleDateString('ko-KR')}</span>
          </div>
        )}
      </div>

      {/* Hover 효과 - 자세히 보기 */}
      <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}
