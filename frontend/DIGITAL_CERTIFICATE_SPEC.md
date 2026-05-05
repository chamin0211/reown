# re:own 디지털 보증서 시스템 - 기술 명세서

## 📋 개요

re:own의 핵심 기능인 **디지털 보증서(NFC/블록체인 연동) 시스템**의 상세 설계 및 UI 컴포넌트 명세입니다.  
프론트엔드 개발자가 바로 컴포넌트화할 수 있도록 Props 구조와 상태(State) 정의를 포함합니다.

---

## 1️⃣ 보증서 데이터 스키마 (System Logic)

### 📦 타입 정의 (`/src/app/data/digitalCertificate.ts`)

#### OwnershipStatus (소유권 상태)
```typescript
type OwnershipStatus = 'ISSUED' | 'ACTIVATED' | 'TRANSFERRING' | 'OWNED';
```

**상태 변화 로직:**
- `ISSUED`: 민팅 완료, 아직 NFC 태그 전 (비활성화)
- `ACTIVATED`: NFC 태그로 정품 인증 완료
- `TRANSFERRING`: 소유권 이전 진행 중
- `OWNED`: 최종 소유권 확정

#### DigitalCertificate (디지털 보증서)
```typescript
interface DigitalCertificate {
  // 고유 식별자
  certificateId: string;          // 보증서 고유 ID
  serialNumber: string;           // 시리얼 넘버 (물리적 제품에 각인)
  tokenId: string;                // NFT 토큰 ID
  
  // 상품 정보
  productId: string;              // 상품 ID (products.ts와 연동)
  productName: string;
  brandName: string;
  productImageUrl: string;
  
  // 소유권 정보
  currentOwner: string;           // 현재 소유자 (지갑 주소 또는 유저 ID)
  ownershipStatus: OwnershipStatus;
  
  // 블록체인 정보
  contractAddress: string;        // 스마트 컨트랙트 주소
  mintingDate: string;            // 민팅(발행) 날짜 (ISO 8601)
  blockchainNetwork: 'ETHEREUM' | 'POLYGON' | 'KLAYTN';
  
  // NFC 태그 정보
  nfcTagId: string;               // NFC 칩 고유 ID
  nfcActivated: boolean;          // NFC 태그 활성화 여부
  nfcActivatedAt: string | null;  // NFC 태그 활성화 시간
  
  // 히스토리
  historyLog: OwnershipHistory[]; // 소유권 변경 이력
}
```

#### OwnershipHistory (소유권 히스토리 로그)
```typescript
interface OwnershipHistory {
  historyId: string;
  event: 'MINTED' | 'NFC_ACTIVATED' | 'TRANSFER_INITIATED' | 'TRANSFER_COMPLETED';
  fromOwner: string | null;       // null이면 최초 발행
  toOwner: string;
  transactionHash?: string;       // 블록체인 트랜잭션 해시
  timestamp: string;              // ISO 8601 format
  nfcVerified: boolean;           // NFC 검증 여부
}
```

#### NfcErrorType (NFC 에러 타입)
```typescript
type NfcErrorType = 
  | 'NFC_NOT_SUPPORTED'   // NFC를 지원하지 않는 기기
  | 'NFC_DISABLED'        // NFC 기능 비활성화
  | 'TAG_READ_FAILED'     // NFC 태그 읽기 실패
  | 'TAG_MISMATCH'        // 태그 정보 불일치
  | 'NETWORK_ERROR'       // 네트워크 오류
  | 'ALREADY_ACTIVATED';  // 이미 활성화된 보증서
```

---

## 2️⃣ 마이페이지 'The Vault' (UI/UX)

### 📄 페이지: TheVaultPage (`/src/app/pages/TheVaultPage.tsx`)

**경로:** `/vault`

**주요 기능:**
- 유저가 보유한 디지털 보증서를 그리드 형태로 표시
- 검색 및 상태별 필터링
- 통계 대시보드 (전체 보증서, 소유 완료, 정품 인증, 이전 진행중)
- 개별 카드 클릭 시 상세 모달 표시

**State 정의:**
```typescript
const [selectedCertificate, setSelectedCertificate] = useState<DigitalCertificate | null>(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<OwnershipStatus | 'ALL'>('ALL');
```

---

### 🎴 컴포넌트: VaultCertificateCard (`/src/app/components/VaultCertificateCard.tsx`)

**Props:**
```typescript
interface VaultCertificateCardProps {
  certificate: DigitalCertificate;
  onClick: () => void;
}
```

**시각적 차이 (NFC 태그 전/후):**

| 상태 | 배경 그라데이션 | 테두리 색상 | 배지 텍스트 | 아이콘 | 오버레이 |
|------|----------------|-----------|-----------|--------|---------|
| **ISSUED** (미활성화) | `from-gray-50 to-gray-100` | `border-gray-300` | "미활성화" | ShieldAlert (회색) | "NFC 태그가 필요합니다" (검은색 60% 오버레이) |
| **ACTIVATED** (정품 인증) | `from-blue-50 to-white` | `border-blue-300` | "정품 인증" | CheckCircle (파란색) | 없음 |
| **TRANSFERRING** (이전 진행중) | `from-yellow-50 to-white` | `border-yellow-400` | "이전 진행중" | Clock (노란색) | "소유권 이전 진행중" (노란색 20% 오버레이) |
| **OWNED** (소유 완료) | `from-white to-blue-50` | `border-blue-600` | "소유 완료" | Shield (진한 파란색) | 없음 |

**톤앤매너:**
- White 배경 기반
- Navy (blue-900, blue-600) 포인트 컬러
- 미니멀리즘 디자인 유지
- Hover 시 `scale-105`, `shadow-xl` 효과

---

### 🔍 컴포넌트: CertificateDetailModal (`/src/app/components/CertificateDetailModal.tsx`)

**Props:**
```typescript
interface CertificateDetailModalProps {
  certificate: DigitalCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**주요 섹션:**
1. **상품 정보**: 이미지, 브랜드명, 상품명, 상태 배지
2. **보증서 기본 정보**: 
   - 시리얼 넘버, 토큰 ID, 컨트랙트 주소 (복사 기능)
   - 블록체인 네트워크, 발행일
3. **NFC 태그 정보**:
   - NFC 태그 ID, 활성화 상태, 활성화 일시
4. **소유권 히스토리 타임라인**:
   - 세로 타임라인 UI (좌측 점선 + 이벤트 카드)
   - 이벤트별 배지 (MINTED, NFC_ACTIVATED, TRANSFER_INITIATED, TRANSFER_COMPLETED)
   - NFC 검증 여부 표시
   - 트랜잭션 해시 복사 기능
5. **블록체인 탐색기 링크**: Klaytn Scope 외부 링크

**State:**
```typescript
const [copiedField, setCopiedField] = useState<string | null>(null);
```

---

## 3️⃣ 소유권 이전 프로세스 (User Flow)

### 🔄 컴포넌트: OwnershipTransferFlow (`/src/app/components/OwnershipTransferFlow.tsx`)

**Props:**
```typescript
interface OwnershipTransferFlowProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  productName: string;
  fromOwner: string;  // 판매자 (현재 소유자)
  toOwner: string;    // 구매자 (신규 소유자)
}
```

**State:**
```typescript
const [currentStep, setCurrentStep] = useState<TransferStep>('LISTING');
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState<NfcErrorType | null>(null);
```

### 📊 3단계 프로세스

#### TransferStep 타입
```typescript
type TransferStep = 
  | 'LISTING'             // 1. 판매 등록
  | 'PURCHASE_CONFIRMED'  // 2. 구매 확정
  | 'NFC_VERIFICATION'    // 3. NFC 기반 소유권 이전 승인
  | 'COMPLETED';          // 4. 완료
```

#### 단계별 설명

| 단계 | 아이콘 | 제목 | 설명 |
|-----|-------|-----|-----|
| **LISTING** | Clock (대기) | 판매 등록 | 리셀 마켓플레이스에 상품 등록 |
| **PURCHASE_CONFIRMED** | Clock (진행중) | 구매 확정 | 구매자가 결제 완료 및 수령 확인 |
| **NFC_VERIFICATION** | Smartphone | NFC 기반 소유권 이전 승인 | 구매자가 제품의 NFC 태그를 스캔하여 소유권 이전 |
| **COMPLETED** | CheckCircle (완료) | 이전 완료 | 블록체인에 소유권 변경 기록 |

---

### ⚠️ 예외 상황 처리

#### NFC 에러 메시지 매핑

```typescript
const errorMessages: Record<NfcErrorType, { title: string; description: string }> = {
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
```

#### 대응 UI

1. **에러 발생 시**:
   - 빨간색 Alert 컴포넌트 표시 (AlertTriangle 아이콘)
   - 에러 제목 및 설명 표시
   - "취소" 및 "다시 시도" 버튼 제공

2. **NFC 스캔 진행 중**:
   - 파란색 Alert 컴포넌트 표시 (Smartphone 아이콘)
   - 안내 메시지: "스마트폰을 제품에 부착된 NFC 태그에 가까이 대주세요"
   - 로딩 인디케이터 (Loader2 아이콘 회전)

3. **완료 시**:
   - 초록색 Alert 컴포넌트 표시 (CheckCircle 아이콘)
   - 완료 메시지: "소유권 이전이 완료되었습니다!"
   - 블록체인 기록 안내

---

## 🎨 디자인 시스템 (Navy & White Tone)

### ��상 팔레트

```css
/* 주요 색상 */
--primary-navy: #1e3a8a;      /* Navy (blue-900) */
--primary-blue: #2563eb;       /* Blue (blue-600) */
--background-white: #ffffff;   /* White */

/* 상태별 색상 */
--status-issued: #6b7280;      /* Gray (비활성화) */
--status-activated: #2563eb;   /* Blue (정품 인증) */
--status-transferring: #eab308; /* Yellow (이전 진행중) */
--status-owned: #1e3a8a;       /* Dark Blue (소유 완료) */

/* 보조 색상 */
--success: #16a34a;            /* Green (성공) */
--error: #dc2626;              /* Red (에러) */
--warning: #f59e0b;            /* Orange (경고) */
```

### Tailwind 클래스 가이드

- **Navy 포인트**: `text-blue-900`, `bg-blue-900`, `border-blue-900`
- **Blue 액센트**: `text-blue-600`, `bg-blue-600`, `border-blue-600`
- **Hover 효과**: `hover:bg-blue-800`, `hover:text-blue-700`
- **미니멀 그림자**: `shadow-sm`, `shadow-md`, `shadow-xl`
- **부드러운 전환**: `transition-all duration-300`

---

## 🔧 백엔드 API 연동 가이드 (Mock → Real)

### 필수 API 엔드포인트

#### 1. 보증서 조회
```typescript
GET /api/certificates?userId={userId}
Response: DigitalCertificate[]
```

#### 2. 보증서 상세 조회
```typescript
GET /api/certificates/{certificateId}
Response: DigitalCertificate
```

#### 3. NFC 태그 활성화
```typescript
POST /api/certificates/{certificateId}/activate-nfc
Body: {
  nfcTagId: string;
  userId: string;
}
Response: {
  success: boolean;
  certificate: DigitalCertificate;
  error?: NfcErrorType;
}
```

#### 4. 소유권 이전 시작
```typescript
POST /api/transfers/initiate
Body: {
  certificateId: string;
  fromOwner: string;
  toOwner: string;
}
Response: {
  transferId: string;
  status: string;
}
```

#### 5. NFC 기반 소유권 이전 승인
```typescript
POST /api/transfers/{transferId}/verify-nfc
Body: {
  nfcTagId: string;
  userId: string;
}
Response: {
  success: boolean;
  transactionHash?: string;
  error?: NfcErrorType;
}
```

---

## 📱 모바일 최적화

- **그리드 레이아웃**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **반응형 검색바**: `flex-col md:flex-row`
- **터치 영역**: 최소 44x44px (iOS HIG 기준)
- **NFC 스캔**: 모바일 전용 기능 (데스크톱에서는 QR 코드 대체 UI 제공 권장)

---

## 🔐 보안 고려사항

1. **Private Key 관리**: 절대 프론트엔드에 노출 금지 (백엔드에서만 처리)
2. **NFC 태그 암호화**: NDEF 메시지에 AES 암호화 적용
3. **소유권 이전 승인**: 2FA (이메일/SMS 인증) 추가 권장
4. **블록체인 트랜잭션**: Gas Fee 예측 및 실패 시 롤백 로직 구현

---

## ✅ 체크리스트

### 프론트엔드 구현 완료 항목
- [x] `digitalCertificate.ts` 데이터 스키마 정의
- [x] `VaultCertificateCard.tsx` 보증서 카드 컴포넌트
- [x] `CertificateDetailModal.tsx` 상세 모달 (소유권 히스토리 타임라인)
- [x] `OwnershipTransferFlow.tsx` 소유권 이전 프로세스 UI
- [x] `TheVaultPage.tsx` 마이페이지 (The Vault)
- [x] 라우트 설정 (`/vault`)
- [x] Header에 The Vault 링크 추가

### 백엔드 연동 필요 항목
- [ ] API 엔드포인트 구현
- [ ] NFC 태그 읽기/쓰기 로직 (iOS: Core NFC, Android: NFC API)
- [ ] 블록체인 스마트 컨트랙트 배포 (Klaytn)
- [ ] 트랜잭션 서명 및 전송 로직
- [ ] 소유권 이전 승인 워크플로우

---

## 📚 참고 자료

- **NFC 표준**: ISO/IEC 14443 (Type A/B), NFC Forum Type 2/4
- **블록체인**: Klaytn Developer Documentation
- **UI 라이브러리**: shadcn/ui (Tailwind CSS 기반)
- **아이콘**: lucide-react

---

## 🎯 다음 단계 제안

1. **실제 NFC 태그 하드웨어 선정** (NTAG216, MIFARE Ultralight 등)
2. **블록체인 네트워크 테스트넷 배포** (Klaytn Baobab)
3. **QR 코드 폴백 UI 개발** (NFC 미지원 환경 대응)
4. **디지털 보증서 PDF 다운로드 기능** (오프라인 증빙용)
5. **소유권 이전 알림 시스템** (이메일/푸시 알림)

---

**작성일**: 2026년 4월 2일  
**작성자**: re:own 개발팀  
**버전**: 1.0.0
