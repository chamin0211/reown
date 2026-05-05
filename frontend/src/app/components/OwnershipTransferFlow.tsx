import { useState } from 'react';
import { TransferStep, NfcErrorType } from '../data/digitalCertificate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertTriangle, 
  Smartphone, 
  Shield,
  XCircle
} from 'lucide-react';

interface OwnershipTransferFlowProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  productName: string;
  fromOwner: string;
  toOwner: string;
}

export function OwnershipTransferFlow({
  isOpen,
  onClose,
  certificateId,
  productName,
  fromOwner,
  toOwner,
}: OwnershipTransferFlowProps) {
  const [currentStep, setCurrentStep] = useState<TransferStep>('LISTING');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<NfcErrorType | null>(null);

  // 단계별 진행
  const handleNextStep = async () => {
    setIsProcessing(true);
    setError(null);

    // 실제로는 백엔드 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (currentStep === 'LISTING') {
      setCurrentStep('PURCHASE_CONFIRMED');
    } else if (currentStep === 'PURCHASE_CONFIRMED') {
      setCurrentStep('NFC_VERIFICATION');
    } else if (currentStep === 'NFC_VERIFICATION') {
      // NFC 태그 시뮬레이션 (실패 확률 10%)
      const nfcSuccess = Math.random() > 0.1;
      
      if (nfcSuccess) {
        setCurrentStep('COMPLETED');
      } else {
        // 랜덤 에러 발생
        const errors: NfcErrorType[] = ['TAG_READ_FAILED', 'TAG_MISMATCH', 'NETWORK_ERROR'];
        setError(errors[Math.floor(Math.random() * errors.length)]);
      }
    }

    setIsProcessing(false);
  };

  // NFC 재시도
  const handleRetryNfc = () => {
    setError(null);
    handleNextStep();
  };

  // 에러 메시지
  const getErrorMessage = (errorType: NfcErrorType) => {
    const messages: Record<NfcErrorType, { title: string; description: string }> = {
      NFC_NOT_SUPPORTED: {
        title: 'NFC를 지원하지 않는 기기입니다',
        description: '다른 기기를 사용하거나 고객센터에 문의해주세요.',
      },
      NFC_DISABLED: {
        title: 'NFC 기능이 비활성화되어 있습니다',
        description: '설정에서 NFC를 활성화한 후 다시 시도해주세요.',
      },
      TAG_READ_FAILED: {
        title: 'NFC 태그를 읽을 수 없습니다',
        description: '기기를 제품의 NFC 태그에 가까이 대고 다시 시도해주세요.',
      },
      TAG_MISMATCH: {
        title: '태그 정보가 일치하지 않습니다',
        description: '올바른 제품의 NFC 태그를 인식시켜주세요.',
      },
      NETWORK_ERROR: {
        title: '네트워크 오류가 발생했습니다',
        description: '인터넷 연결을 확인하고 다시 시도해주세요.',
      },
      ALREADY_ACTIVATED: {
        title: '이미 활성화된 보증서입니다',
        description: '이 보증서는 이미 다른 소유자에게 등록되어 있습니다.',
      },
    };
    return messages[errorType];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            소유권 이전 프로세스
          </DialogTitle>
          <DialogDescription>
            디지털 보증서의 소유권을 안전하게 이전합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 상품 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">이전 대상 상품</p>
            <p className="font-semibold">{productName}</p>
            <p className="text-xs text-gray-500 mt-2">Certificate ID: {certificateId}</p>
          </div>

          {/* 소유자 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">판매자 (현재 소유자)</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">{fromOwner}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">구매자 (신규 소유자)</p>
              <p className="text-sm font-mono bg-blue-50 p-2 rounded">{toOwner}</p>
            </div>
          </div>

          {/* 프로세스 단계 */}
          <div className="space-y-4">
            <TransferStepItem
              step="LISTING"
              currentStep={currentStep}
              title="1. 판매 등록"
              description="리셀 마켓플레이스에 상품 등록"
            />
            <TransferStepItem
              step="PURCHASE_CONFIRMED"
              currentStep={currentStep}
              title="2. 구매 확정"
              description="구매자가 결제 완료 및 수령 확인"
            />
            <TransferStepItem
              step="NFC_VERIFICATION"
              currentStep={currentStep}
              title="3. NFC 기반 소유권 이전 승인"
              description="구매자가 제품의 NFC 태그를 스캔하여 소유권 이전"
            />
            <TransferStepItem
              step="COMPLETED"
              currentStep={currentStep}
              title="4. 이전 완료"
              description="블록체인에 소유권 변경 기록"
            />
          </div>

          {/* NFC 스캔 안내 (NFC_VERIFICATION 단계) */}
          {currentStep === 'NFC_VERIFICATION' && !error && (
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">NFC 태그 인식이 필요합니다</p>
                <p className="text-gray-600">
                  스마트폰을 제품에 부착된 NFC 태그에 가까이 대주세요. 
                  인식이 완료되면 자동으로 소유권 이전이 진행됩니다.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">{getErrorMessage(error).title}</p>
                <p className="text-sm">{getErrorMessage(error).description}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* 완료 메시지 */}
          {currentStep === 'COMPLETED' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1 text-green-900">소유권 이전이 완료되었습니다!</p>
                <p className="text-green-700">
                  디지털 보증서가 구매자에게 성공적으로 이전되었으며, 
                  블록체인에 영구적으로 기록되었습니다.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            {currentStep === 'COMPLETED' ? (
              <Button onClick={onClose} className="flex-1 bg-blue-900 hover:bg-blue-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                확인
              </Button>
            ) : error ? (
              <>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleRetryNfc}
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  다시 시도
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  취소
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {currentStep === 'NFC_VERIFICATION' ? 'NFC 스캔 시작' : '다음 단계'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 단계별 아이템 컴포넌트
interface TransferStepItemProps {
  step: TransferStep;
  currentStep: TransferStep;
  title: string;
  description: string;
}

function TransferStepItem({ step, currentStep, title, description }: TransferStepItemProps) {
  const stepOrder: TransferStep[] = ['LISTING', 'PURCHASE_CONFIRMED', 'NFC_VERIFICATION', 'COMPLETED'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(step);

  const isCompleted = stepIndex < currentIndex;
  const isCurrent = stepIndex === currentIndex;
  const isPending = stepIndex > currentIndex;

  return (
    <div className="flex items-start gap-4">
      {/* 상태 아이콘 */}
      <div className="flex-shrink-0 mt-1">
        {isCompleted ? (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        ) : isCurrent ? (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
        )}
      </div>

      {/* 단계 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold ${isCurrent ? 'text-blue-900' : 'text-gray-700'}`}>
            {title}
          </h4>
          {isCurrent && (
            <Badge variant="default" className="text-xs">진행중</Badge>
          )}
          {isCompleted && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">완료</Badge>
          )}
        </div>
        <p className={`text-sm ${isCurrent ? 'text-gray-700' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
