// 디지털 보증서 데이터 스키마 및 관리
// NFC/블록체인 연동 시스템

/**
 * 소유권 상태 (Ownership Status)
 * ISSUED: 민팅 완료, 아직 NFC 태그 전
 * ACTIVATED: NFC 태그로 정품 인증 완료
 * TRANSFERRING: 소유권 이전 진행 중
 * OWNED: 최종 소유권 확정
 */
export type OwnershipStatus = 'ISSUED' | 'ACTIVATED' | 'TRANSFERRING' | 'OWNED';

/**
 * 소유권 히스토리 로그
 */
export interface OwnershipHistory {
  historyId: string;
  event: 'MINTED' | 'NFC_ACTIVATED' | 'TRANSFER_INITIATED' | 'TRANSFER_COMPLETED';
  fromOwner: string | null; // null이면 최초 발행
  toOwner: string;
  transactionHash?: string; // 블록체인 트랜잭션 해시
  timestamp: string; // ISO 8601 format
  nfcVerified: boolean;
}

/**
 * 디지털 보증서 (Digital Certificate)
 */
export interface DigitalCertificate {
  certificateId: string; // 보증서 고유 ID
  serialNumber: string; // 시리얼 넘버 (물리적 제품에 각인)
  tokenId: string; // NFT 토큰 ID
  productId: string; // 상품 ID (products.ts와 연동)
  productName: string;
  brandName: string;
  productImageUrl: string;
  
  // 소유권 정보
  currentOwner: string; // 현재 소유자 지갑 주소 또는 유저 ID
  ownershipStatus: OwnershipStatus;
  
  // 블록체인 정보
  contractAddress: string; // 스마트 컨트랙트 주소
  mintingDate: string; // 민팅(발행) 날짜 ISO 8601
  blockchainNetwork: 'ETHEREUM' | 'POLYGON' | 'KLAYTN'; // 블록체인 네트워크
  
  // NFC 태그 정보
  nfcTagId: string; // NFC 칩 고유 ID
  nfcActivated: boolean; // NFC 태그 활성화 여부
  nfcActivatedAt: string | null; // NFC 태그 활성화 시간
  
  // 히스토리
  historyLog: OwnershipHistory[];
}

/**
 * NFC 태그 에러 타입
 */
export type NfcErrorType = 
  | 'NFC_NOT_SUPPORTED' 
  | 'NFC_DISABLED' 
  | 'TAG_READ_FAILED' 
  | 'TAG_MISMATCH' 
  | 'NETWORK_ERROR'
  | 'ALREADY_ACTIVATED';

/**
 * 소유권 이전 프로세스 단계
 */
export type TransferStep = 
  | 'LISTING' // 판매 등록
  | 'PURCHASE_CONFIRMED' // 구매 확정
  | 'NFC_VERIFICATION' // NFC 기반 소유권 이전 승인
  | 'COMPLETED'; // 완료

export interface TransferProcess {
  transferId: string;
  certificateId: string;
  fromOwner: string;
  toOwner: string;
  currentStep: TransferStep;
  createdAt: string;
  completedAt: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

// ===== MOCK DATA =====

/**
 * 예시 디지털 보증서 데이터
 */
export const mockCertificates: DigitalCertificate[] = [
  {
    certificateId: 'cert-001',
    serialNumber: 'RO-2026-FD001-00123',
    tokenId: '0x4a7b...89e2',
    productId: 'funding-001',
    productName: '미니멀 레더 백팩 - 프리미엄 가죽 소재',
    brandName: '어반 디자이너스',
    productImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    
    currentOwner: 'user-kim-12345',
    ownershipStatus: 'OWNED',
    
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    mintingDate: '2026-03-15T09:30:00Z',
    blockchainNetwork: 'KLAYTN',
    
    nfcTagId: 'NFC-RO-FD001-00123',
    nfcActivated: true,
    nfcActivatedAt: '2026-03-20T14:22:00Z',
    
    historyLog: [
      {
        historyId: 'hist-001',
        event: 'MINTED',
        fromOwner: null,
        toOwner: 'user-kim-12345',
        transactionHash: '0x8f3c...a1d4',
        timestamp: '2026-03-15T09:30:00Z',
        nfcVerified: false,
      },
      {
        historyId: 'hist-002',
        event: 'NFC_ACTIVATED',
        fromOwner: null,
        toOwner: 'user-kim-12345',
        timestamp: '2026-03-20T14:22:00Z',
        nfcVerified: true,
      },
    ],
  },
  {
    certificateId: 'cert-002',
    serialNumber: 'RO-2026-RS001-00456',
    tokenId: '0x7e9a...12c3',
    productId: 'resell-001',
    productName: '마르지엘라 레플리카 스니커즈 - 화이트',
    brandName: 'Maison Margiela',
    productImageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    
    currentOwner: 'user-park-67890',
    ownershipStatus: 'OWNED',
    
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    mintingDate: '2025-11-10T10:15:00Z',
    blockchainNetwork: 'KLAYTN',
    
    nfcTagId: 'NFC-RO-RS001-00456',
    nfcActivated: true,
    nfcActivatedAt: '2025-11-12T08:45:00Z',
    
    historyLog: [
      {
        historyId: 'hist-003',
        event: 'MINTED',
        fromOwner: null,
        toOwner: 'user-lee-11111',
        transactionHash: '0x9d2b...c5e7',
        timestamp: '2025-11-10T10:15:00Z',
        nfcVerified: false,
      },
      {
        historyId: 'hist-004',
        event: 'NFC_ACTIVATED',
        fromOwner: null,
        toOwner: 'user-lee-11111',
        timestamp: '2025-11-12T08:45:00Z',
        nfcVerified: true,
      },
      {
        historyId: 'hist-005',
        event: 'TRANSFER_INITIATED',
        fromOwner: 'user-lee-11111',
        toOwner: 'user-park-67890',
        timestamp: '2026-03-25T16:30:00Z',
        nfcVerified: false,
      },
      {
        historyId: 'hist-006',
        event: 'TRANSFER_COMPLETED',
        fromOwner: 'user-lee-11111',
        toOwner: 'user-park-67890',
        transactionHash: '0x6c1f...d8a2',
        timestamp: '2026-03-26T11:20:00Z',
        nfcVerified: true,
      },
    ],
  },
  {
    certificateId: 'cert-003',
    serialNumber: 'RO-2026-DS002-00789',
    tokenId: '0x2f6d...45b8',
    productId: 'designer-001',
    productName: '프리미엄 울 블렌드 오버사이즈 코트',
    brandName: '제이슨 리 스튜디오',
    productImageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    
    currentOwner: 'user-choi-33333',
    ownershipStatus: 'ACTIVATED',
    
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    mintingDate: '2026-02-20T13:00:00Z',
    blockchainNetwork: 'KLAYTN',
    
    nfcTagId: 'NFC-RO-DS002-00789',
    nfcActivated: true,
    nfcActivatedAt: '2026-02-25T18:10:00Z',
    
    historyLog: [
      {
        historyId: 'hist-007',
        event: 'MINTED',
        fromOwner: null,
        toOwner: 'user-choi-33333',
        transactionHash: '0x3a8e...f9b1',
        timestamp: '2026-02-20T13:00:00Z',
        nfcVerified: false,
      },
      {
        historyId: 'hist-008',
        event: 'NFC_ACTIVATED',
        fromOwner: null,
        toOwner: 'user-choi-33333',
        timestamp: '2026-02-25T18:10:00Z',
        nfcVerified: true,
      },
    ],
  },
  {
    certificateId: 'cert-004',
    serialNumber: 'RO-2026-FD003-00321',
    tokenId: '0x5b2c...78e6',
    productId: 'funding-003',
    productName: '친환경 대나무 텀블러 - 보냉/보온 기능',
    brandName: '네이처 라이프',
    productImageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    
    currentOwner: 'user-jung-44444',
    ownershipStatus: 'ISSUED',
    
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    mintingDate: '2026-03-28T10:00:00Z',
    blockchainNetwork: 'KLAYTN',
    
    nfcTagId: 'NFC-RO-FD003-00321',
    nfcActivated: false,
    nfcActivatedAt: null,
    
    historyLog: [
      {
        historyId: 'hist-009',
        event: 'MINTED',
        fromOwner: null,
        toOwner: 'user-jung-44444',
        transactionHash: '0x1d9f...e3c7',
        timestamp: '2026-03-28T10:00:00Z',
        nfcVerified: false,
      },
    ],
  },
  {
    certificateId: 'cert-005',
    serialNumber: 'RO-2026-RS002-00654',
    tokenId: '0x8c4a...23d5',
    productId: 'resell-002',
    productName: '프라다 나일론 백팩 블랙 - 정품 보증서 포함',
    brandName: 'PRADA',
    productImageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
    
    currentOwner: 'user-han-55555',
    ownershipStatus: 'TRANSFERRING',
    
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    mintingDate: '2025-12-05T15:30:00Z',
    blockchainNetwork: 'KLAYTN',
    
    nfcTagId: 'NFC-RO-RS002-00654',
    nfcActivated: true,
    nfcActivatedAt: '2025-12-08T12:00:00Z',
    
    historyLog: [
      {
        historyId: 'hist-010',
        event: 'MINTED',
        fromOwner: null,
        toOwner: 'user-han-55555',
        transactionHash: '0x7b3e...a9f2',
        timestamp: '2025-12-05T15:30:00Z',
        nfcVerified: false,
      },
      {
        historyId: 'hist-011',
        event: 'NFC_ACTIVATED',
        fromOwner: null,
        toOwner: 'user-han-55555',
        timestamp: '2025-12-08T12:00:00Z',
        nfcVerified: true,
      },
      {
        historyId: 'hist-012',
        event: 'TRANSFER_INITIATED',
        fromOwner: 'user-han-55555',
        toOwner: 'user-yang-66666',
        timestamp: '2026-04-01T09:15:00Z',
        nfcVerified: false,
      },
    ],
  },
];

// 헬퍼 함수: 유저별 보증서 조회
export function getCertificatesByOwner(ownerId: string): DigitalCertificate[] {
  return mockCertificates.filter((cert) => cert.currentOwner === ownerId);
}

// 헬퍼 함수: 보증서 ID로 조회
export function getCertificateById(certificateId: string): DigitalCertificate | undefined {
  return mockCertificates.find((cert) => cert.certificateId === certificateId);
}

// 헬퍼 함수: 상품 ID로 보증서 조회
export function getCertificateByProductId(productId: string): DigitalCertificate | undefined {
  return mockCertificates.find((cert) => cert.productId === productId);
}
