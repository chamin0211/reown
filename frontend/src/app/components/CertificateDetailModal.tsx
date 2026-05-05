import { DigitalCertificate } from '../data/digitalCertificate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ExternalLink, Copy, Check, Shield, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface CertificateDetailModalProps {
  certificate: DigitalCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateDetailModal({ certificate, isOpen, onClose }: CertificateDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!certificate) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 이벤트 타입별 한글 레이블
  const getEventLabel = (event: string) => {
    const labels: Record<string, string> = {
      MINTED: '보증서 발행',
      NFC_ACTIVATED: 'NFC 태그 인증',
      TRANSFER_INITIATED: '소유권 이전 시작',
      TRANSFER_COMPLETED: '소유권 이전 완료',
    };
    return labels[event] || event;
  };

  // 상태별 배지 색상
  const getStatusBadge = () => {
    const statusMap = {
      ISSUED: { variant: 'secondary' as const, text: '미활성화' },
      ACTIVATED: { variant: 'default' as const, text: '정품 인증' },
      TRANSFERRING: { variant: 'outline' as const, text: '이전 진행중' },
      OWNED: { variant: 'default' as const, text: '소유 완료' },
    };
    return statusMap[certificate.ownershipStatus];
  };

  const statusBadge = getStatusBadge();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            디지털 보증서 상세
          </DialogTitle>
          <DialogDescription className="sr-only">
            {certificate.productName}의 디지털 보증서 정보를 확인합니다.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* 상품 정보 */}
            <div className="flex gap-4">
              <img
                src={certificate.productImageUrl}
                alt={certificate.productName}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1 space-y-2">
                <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
                <p className="text-sm text-gray-500">{certificate.brandName}</p>
                <h3 className="font-semibold text-lg leading-tight">{certificate.productName}</h3>
              </div>
            </div>

            <Separator />

            {/* 보증서 기본 정보 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                보증서 정보
              </h4>
              
              <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg">
                <InfoRow
                  label="시리얼 넘버"
                  value={certificate.serialNumber}
                  onCopy={() => copyToClipboard(certificate.serialNumber, 'serial')}
                  copied={copiedField === 'serial'}
                />
                <InfoRow
                  label="토큰 ID"
                  value={certificate.tokenId}
                  onCopy={() => copyToClipboard(certificate.tokenId, 'token')}
                  copied={copiedField === 'token'}
                />
                <InfoRow
                  label="컨트랙트 주소"
                  value={`${certificate.contractAddress.slice(0, 12)}...${certificate.contractAddress.slice(-8)}`}
                  onCopy={() => copyToClipboard(certificate.contractAddress, 'contract')}
                  copied={copiedField === 'contract'}
                />
                <InfoRow
                  label="블록체인 네트워크"
                  value={certificate.blockchainNetwork}
                />
                <InfoRow
                  label="발행일"
                  value={new Date(certificate.mintingDate).toLocaleString('ko-KR')}
                />
              </div>
            </div>

            {/* NFC 정보 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                NFC 태그 정보
              </h4>
              
              <div className="grid grid-cols-1 gap-3 bg-blue-50 p-4 rounded-lg">
                <InfoRow
                  label="NFC 태그 ID"
                  value={certificate.nfcTagId}
                  onCopy={() => copyToClipboard(certificate.nfcTagId, 'nfc')}
                  copied={copiedField === 'nfc'}
                />
                <InfoRow
                  label="활성화 상태"
                  value={certificate.nfcActivated ? '활성화됨' : '미활성화'}
                  valueColor={certificate.nfcActivated ? 'text-green-600' : 'text-gray-500'}
                />
                {certificate.nfcActivatedAt && (
                  <InfoRow
                    label="활성화 일시"
                    value={new Date(certificate.nfcActivatedAt).toLocaleString('ko-KR')}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* 소유권 히스토리 타임라인 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                소유권 히스토리
              </h4>

              <div className="relative pl-8 space-y-6">
                {/* 타임라인 세로선 */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

                {certificate.historyLog.map((history, index) => (
                  <div key={history.historyId} className="relative">
                    {/* 타임라인 점 */}
                    <div
                      className={`absolute -left-[26px] w-4 h-4 rounded-full border-2 
                        ${history.nfcVerified 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'bg-white border-gray-300'
                        }`}
                    />

                    {/* 이벤트 카드 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={history.nfcVerified ? 'default' : 'secondary'}>
                            {getEventLabel(history.event)}
                          </Badge>
                          {history.nfcVerified && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              NFC 검증됨
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        {history.fromOwner && (
                          <p className="text-gray-600">
                            <span className="font-medium">이전 소유자:</span>{' '}
                            <span className="font-mono text-xs">{history.fromOwner}</span>
                          </p>
                        )}
                        <p className="text-gray-600">
                          <span className="font-medium">{history.fromOwner ? '신규 소유자' : '최초 소유자'}:</span>{' '}
                          <span className="font-mono text-xs">{history.toOwner}</span>
                        </p>
                        {history.transactionHash && (
                          <p className="text-gray-600 flex items-center gap-1">
                            <span className="font-medium">트랜잭션:</span>{' '}
                            <span className="font-mono text-xs">{history.transactionHash}</span>
                            <button
                              onClick={() => copyToClipboard(history.transactionHash!, `tx-${index}`)}
                              className="ml-1 p-1 hover:bg-gray-100 rounded"
                            >
                              {copiedField === `tx-${index}` ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 블록체인 탐색기 링크 */}
            <div className="pt-4">
              <a
                href={`https://scope.klaytn.com/account/${certificate.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                블록체인 탐색기에서 보기
              </a>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// 정보 행 컴포넌트
interface InfoRowProps {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  valueColor?: string;
}

function InfoRow({ label, value, onCopy, copied, valueColor = 'text-gray-900' }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${valueColor}`}>{value}</span>
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-1 hover:bg-white rounded transition-colors"
            title="복사"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
