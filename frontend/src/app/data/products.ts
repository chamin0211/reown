// 중앙 집중식 상품 데이터 관리
export type SaleType = 'FUNDING' | 'REGULAR' | 'RESELL';

export interface TimelineStage {
  stage: string;
  label: string;
  completed: boolean;
}

export interface Product {
  productId: string;
  name: string;
  brandName: string;
  price: number;
  saleType: SaleType;
  ogImageUrl: string;
  images: string[];
  availableSizes: string[];
  availableColors: { name: string; code: string }[];

  options?: {
    optionId: number;
    size: string | null;
    color: string | null;
    colorHex: string | null;
    stockQuantity: number;
    safetyStock?: number;
    reservedQuantity?: number;
  }[];

  description: string;
  sizeGuide: {
    label: string;
    shoulder: string;
    chest: string;
    sleeve: string;
    length: string;
  }[];
  reviews: {
    reviewId: string;
    authorName: string;
    rating: number;
    height: number;
    weight: number;
    content: string;
    createdAt: string;
    images?: string[];
  }[];
  // FUNDING 전용
  fundingCampaignId?: number;
  fundingAchievementRate?: number;
  fundingTargetAmount?: number;
  fundingCurrentAmount?: number;
  fundingRemainingAmount?: number;
  fundingStatus?: string;
  fundingStartDate?: string;
  fundingEndDate?: string;
  productionStages?: TimelineStage[];
  remainingDays?: number;
  // RESELL 전용
  conditionDescription?: string;
  isInspected?: boolean;
  originalPrice?: number;
}

// 전체 상품 데이터
export const allProducts: Product[] = [
  // ===== FUNDING 상품 =====
  {
    productId: 'funding-001',
    name: '미니멀 레더 백팩 - 프리미엄 가죽 소재',
    brandName: '어반 디자이너스',
    price: 189000,
    saleType: 'FUNDING',
    fundingAchievementRate: 156,
    remainingDays: 12,
    ogImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
      'https://images.unsplash.com/photo-1623976234478-7418916b2a0e?w=800&q=80',
    ],
    availableSizes: ['Free'],
    availableColors: [
      { name: '블랙', code: '#000000' },
      { name: '네이비', code: '#1e3a8a' },
      { name: '브라운', code: '#92400e' },
    ],
    description: `신진 디자이너가 선보이는 미니멀 레더 백팩입니다.

• 소재: 프리미엄 천연 가죽 100%
• 원산지: 대한민국 (서울)
• 수작업 제작: 장인이 직접 핸드메이드로 제작

도시적이고 모던한 디자인으로 일상부터 비즈니스까지 활용 가능합니다.
펀딩 성공 시 2026년 5월 순차 배송 예정입니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '40cm' }],
    reviews: [
      {
        reviewId: 'rev-f-001',
        authorName: '김펀딩',
        rating: 5,
        height: 175,
        weight: 68,
        content: '이전 펀딩에서 구매했는데 퀄리티가 정말 좋아서 이번에도 참여했습니다!',
        createdAt: '2026.03.20',
      },
    ],
    productionStages: [
      { stage: 'material_order', label: '가죽 발주', completed: true },
      { stage: 'pattern_making', label: '패턴 제작', completed: true },
      { stage: 'production', label: '생산 중', completed: true },
      { stage: 'shipping_prep', label: '배송 준비', completed: false },
    ],
  },
  {
    productId: 'funding-002',
    name: '핸드메이드 세라믹 머그 컬렉션 (4종 세트)',
    brandName: '모던 크래프트',
    price: 45000,
    saleType: 'FUNDING',
    fundingAchievementRate: 89,
    remainingDays: 25,
    ogImageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
      'https://images.unsplash.com/photo-1509950054430-426d21293e32?w=800&q=80',
    ],
    availableSizes: ['Free'],
    availableColors: [
      { name: '화이트', code: '#FFFFFF' },
      { name: '베이지', code: '#D4C5B9' },
      { name: '그레이', code: '#6B7280' },
      { name: '블랙', code: '#000000' },
    ],
    description: `수작업으로 제작되는 세라믹 머그 컬렉션입니다.

• 소재: 도자기 (세라믹)
• 용량: 350ml (각)
• 원산지: 대한민국 (이천)

4종의 서로 다른 컬러로 구성되어 있으며, 전자레인지 및 식기세척기 사용이 가능합니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '-' }],
    reviews: [],
    productionStages: [
      { stage: 'material_order', label: '소재 발주', completed: true },
      { stage: 'pattern_making', label: '디자인 확정', completed: true },
      { stage: 'production', label: '생산 중', completed: false },
      { stage: 'shipping_prep', label: '배송 준비', completed: false },
    ],
  },
  {
    productId: 'funding-003',
    name: '친환경 대나무 텀블러 - 보냉/보온 기능',
    brandName: '네이처 라이프',
    price: 32000,
    saleType: 'FUNDING',
    fundingAchievementRate: 234,
    remainingDays: 5,
    ogImageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1534056521214-52d18f0c2ab0?w=800&q=80',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80',
    ],
    availableSizes: ['Free'],
    availableColors: [
      { name: '내추럴', code: '#D4C5B9' },
      { name: '블랙', code: '#000000' },
    ],
    description: `친환경 대나무와 스테인리스 스틸로 제작된 텀블러입니다.

• 소재: 대나무(외부), 스테인리스 스틸(내부)
• 용량: 500ml
• 보온/보냉: 6시간

100% 재활용 가능한 친환경 소재로 제작되었습니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '-' }],
    reviews: [],
    productionStages: [
      { stage: 'material_order', label: '소재 발주', completed: true },
      { stage: 'pattern_making', label: '디자인 확정', completed: true },
      { stage: 'production', label: '생산 중', completed: true },
      { stage: 'shipping_prep', label: '배송 준비', completed: true },
    ],
  },

  // ===== REGULAR (디자이너/브랜드 스토어) 상품 =====
  {
    productId: 'designer-001',
    name: '프리미엄 울 블렌드 오버사이즈 코트',
    brandName: '제이슨 리 스튜디오',
    price: 320000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
      'https://images.unsplash.com/photo-1548126032-079b5a6d5d2a?w=800&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: '블랙', code: '#000000' },
      { name: '네이비', code: '#1e3a8a' },
      { name: '카멜', code: '#c19a6b' },
    ],
    description: `신진 디자이너 제이슨 리가 선보이는 프리미엄 울 블렌드 코트입니다.

• 소재: 울 70%, 캐시미어 20%, 폴리에스터 10%
• 원산지: 대한민국 (서울)
• 세탁 방법: 드라이클리닝 권장

클래식한 실루엣과 현대적인 디테일이 조화를 이루는 이 코트는 
가을부터 초봄까지 오랜 기간 착용 가능한 시즌리스 아이템입니다.`,
    sizeGuide: [
      { label: 'S', shoulder: '50cm', chest: '110cm', sleeve: '60cm', length: '95cm' },
      { label: 'M', shoulder: '52cm', chest: '115cm', sleeve: '62cm', length: '98cm' },
      { label: 'L', shoulder: '54cm', chest: '120cm', sleeve: '64cm', length: '101cm' },
      { label: 'XL', shoulder: '56cm', chest: '125cm', sleeve: '66cm', length: '104cm' },
    ],
    reviews: [
      {
        reviewId: 'rev-001',
        authorName: '김민수',
        rating: 5,
        height: 178,
        weight: 72,
        content:
          '퀄리티가 정말 좋습니다. 오버사이즈 핏이라 L 사이즈 구매했는데 딱 맞네요. 울 소재가 고급스럽고 보온성도 훌륭합니다.',
        createdAt: '2026.03.15',
        images: [
          'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=200&q=80',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80',
        ],
      },
      {
        reviewId: 'rev-002',
        authorName: '이지은',
        rating: 5,
        height: 165,
        weight: 52,
        content:
          '여성인데 M 사이즈 구매했어요. 오버핏으로 입기 딱 좋습니다. 색상도 화면으로 본 것과 동일하고 마감 처리가 깔끔해요.',
        createdAt: '2026.03.12',
      },
    ],
  },
  {
    productId: 'designer-002',
    name: '실크 블렌드 원피스 - 플로럴 패턴',
    brandName: '루나 에센셜',
    price: 185000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: '플로럴 베이지', code: '#D4C5B9' },
      { name: '플로럴 블루', code: '#93C5FD' },
    ],
    description: `우아한 실크 블렌드 원피스입니다.

• 소재: 실크 60%, 비스코스 40%
• 원산지: 대한민국
• 세탁 방법: 드라이클리닝 권장

로맨틱한 플로럴 패턴과 여성스러운 실루엣이 돋보이는 원피스입니다.`,
    sizeGuide: [
      { label: 'XS', shoulder: '36cm', chest: '82cm', sleeve: '54cm', length: '115cm' },
      { label: 'S', shoulder: '38cm', chest: '86cm', sleeve: '56cm', length: '117cm' },
      { label: 'M', shoulder: '40cm', chest: '90cm', sleeve: '58cm', length: '119cm' },
      { label: 'L', shoulder: '42cm', chest: '94cm', sleeve: '60cm', length: '121cm' },
    ],
    reviews: [],
  },
  {
    productId: 'designer-003',
    name: '핸드메이드 레더 토트백 (캐멀 브라운)',
    brandName: '아틀리에 K',
    price: 245000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    availableSizes: ['Free'],
    availableColors: [
      { name: '캐멀', code: '#c19a6b' },
      { name: '블랙', code: '#000000' },
    ],
    description: `수작업으로 제작된 프리미엄 레더 토트백입니다.

• 소재: 천연 소가죽 100%
• 원산지: 대한민국
• 사이즈: 40cm x 30cm x 15cm

A4 서류가 들어가는 실용적인 사이즈로 데일리 사용에 적합합니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '30cm' }],
    reviews: [],
  },
  {
    productId: 'brand-001',
    name: '프리미엄 울 니트 스웨터 (5컬러)',
    brandName: '노르딕 하우스',
    price: 89000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
      'https://images.unsplash.com/photo-1598032895397-b9e5d63c8dd1?w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L'],
    availableColors: [
      { name: '블랙', code: '#000000' },
      { name: '화이트', code: '#FFFFFF' },
      { name: '그레이', code: '#6B7280' },
      { name: '네이비', code: '#1e3a8a' },
      { name: '베이지', code: '#D4C5B9' },
    ],
    description: `고급스러운 울 소재의 니트 스웨터입니다.

• 소재: 메리노 울 100%
• 원산지: 이탈리아
• 세탁 방법: 손세탁 권장

부드러운 촉감과 보온성이 뛰어난 메리노 울 소재로 제작되었습니다.`,
    sizeGuide: [
      { label: 'S', shoulder: '44cm', chest: '100cm', sleeve: '58cm', length: '65cm' },
      { label: 'M', shoulder: '46cm', chest: '105cm', sleeve: '60cm', length: '68cm' },
      { label: 'L', shoulder: '48cm', chest: '110cm', sleeve: '62cm', length: '71cm' },
    ],
    reviews: [],
  },
  {
    productId: 'brand-002',
    name: '슬림핏 치노 팬츠 - 올시즌 착용 가능',
    brandName: '어반 베이직스',
    price: 65000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    ],
    availableSizes: ['28', '30', '32', '34', '36'],
    availableColors: [
      { name: '베이지', code: '#D4C5B9' },
      { name: '네이비', code: '#1e3a8a' },
      { name: '블랙', code: '#000000' },
    ],
    description: `베이직한 슬림핏 치노 팬츠입니다.

• 소재: 코튼 97%, 스판덱스 3%
• 원산지: 대한민국
• 세탁 방법: 찬물 세탁

사계절 착용 가능한 베이직 아이템으로 다양한 스타일에 매치 가능합니다.`,
    sizeGuide: [
      { label: '28', shoulder: '-', chest: '-', sleeve: '-', length: '100cm' },
      { label: '30', shoulder: '-', chest: '-', sleeve: '-', length: '102cm' },
      { label: '32', shoulder: '-', chest: '-', sleeve: '-', length: '104cm' },
      { label: '34', shoulder: '-', chest: '-', sleeve: '-', length: '106cm' },
      { label: '36', shoulder: '-', chest: '-', sleeve: '-', length: '108cm' },
    ],
    reviews: [],
  },
  {
    productId: 'brand-003',
    name: '이탈리안 레더 스니커즈 (화이트)',
    brandName: '클래식 컬렉션',
    price: 125000,
    saleType: 'REGULAR',
    ogImageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    ],
    availableSizes: ['250', '255', '260', '265', '270', '275', '280'],
    availableColors: [
      { name: '화이트', code: '#FFFFFF' },
      { name: '블랙', code: '#000000' },
    ],
    description: `이탈리아산 천연 가죽으로 제작된 스니커즈입니다.

• 소재: 천연 소가죽 100%
• 원산지: 이탈리아
• 밑창: 러버 아웃솔

클래식한 화이트 스니커즈로 다양한 룩에 매치 가능합니다.`,
    sizeGuide: [
      { label: '250', shoulder: '-', chest: '-', sleeve: '-', length: '250mm' },
      { label: '255', shoulder: '-', chest: '-', sleeve: '-', length: '255mm' },
      { label: '260', shoulder: '-', chest: '-', sleeve: '-', length: '260mm' },
      { label: '265', shoulder: '-', chest: '-', sleeve: '-', length: '265mm' },
      { label: '270', shoulder: '-', chest: '-', sleeve: '-', length: '270mm' },
      { label: '275', shoulder: '-', chest: '-', sleeve: '-', length: '275mm' },
      { label: '280', shoulder: '-', chest: '-', sleeve: '-', length: '280mm' },
    ],
    reviews: [],
  },

  // ===== RESELL 상품 =====
  {
    productId: 'resell-001',
    name: '마르지엘라 레플리카 스니커즈 - 화이트 (SIZE 265)',
    brandName: 'Maison Margiela',
    price: 280000,
    saleType: 'RESELL',
    originalPrice: 520000,
    conditionDescription: '사용감 적음',
    isInspected: true,
    ogImageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?w=800&q=80',
    ],
    availableSizes: ['265'],
    availableColors: [{ name: '화이트', code: '#FFFFFF' }],
    description: `마르지엘라의 시그니처 레플리카 스니커즈입니다.

• 상품 상태: 사용감 적음 (약 5회 착용)
• 검수 완료: re:own 정품 검수 통과
• 구성품: 본품, 더스트백, 정품 박스 포함
• 사이즈: 265mm

re:own의 전문 검수팀이 정품 여부 및 상태를 철저히 검증한 상품입니다.
착용감이 거의 없으며 박스와 구성품이 모두 온전합니다.`,
    sizeGuide: [{ label: '265', shoulder: '-', chest: '-', sleeve: '-', length: '265mm' }],
    reviews: [
      {
        reviewId: 'rev-r-001',
        authorName: '박리셀',
        rating: 5,
        height: 175,
        weight: 70,
        content: '검수가 철저해서 믿고 구매했습니다. 상태도 설명보다 더 좋네요!',
        createdAt: '2026.03.18',
      },
    ],
  },
  {
    productId: 'resell-002',
    name: '프라다 나일론 백팩 블랙 - 정품 보증서 포함',
    brandName: 'PRADA',
    price: 450000,
    saleType: 'RESELL',
    originalPrice: 890000,
    conditionDescription: '거의 새것',
    isInspected: true,
    ogImageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
    ],
    availableSizes: ['Free'],
    availableColors: [{ name: '블랙', code: '#000000' }],
    description: `프라다의 시그니처 나일론 백팩입니다.

• 상품 상태: 거의 새것 (착용 1~2회)
• 검수 완료: re:own 정품 검수 통과
• 구성품: 본품, 정품 보증서, 더스트백, 정품 박스
• 사이즈: Free

사용감이 거의 없는 A급 리셀 상품입니다.`,
    sizeGuide: [{ label: 'Free', shoulder: '-', chest: '-', sleeve: '-', length: '-' }],
    reviews: [],
  },
  {
    productId: 'resell-003',
    name: '발렌시아가 트리플S 트레이너 (SIZE 270)',
    brandName: 'BALENCIAGA',
    price: 620000,
    saleType: 'RESELL',
    originalPrice: 1190000,
    conditionDescription: '중고',
    isInspected: true,
    ogImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
    availableSizes: ['270'],
    availableColors: [{ name: '멀티', code: '#6B7280' }],
    description: `발렌시아가의 인기 스니커즈 트리플S입니다.

• 상품 상태: 중고 (약 20회 착용)
• 검수 완료: re:own 정품 검수 통과
• 구성품: 본품, 더스트백 포함 (박스 없음)
• 사이즈: 270mm

사용감이 있으나 정품이 확실하며 착용에 문제 없는 상태입니다.`,
    sizeGuide: [{ label: '270', shoulder: '-', chest: '-', sleeve: '-', length: '270mm' }],
    reviews: [],
  },
];

// 헬퍼 함수: saleType으로 필터링
export function getProductsBySaleType(saleType: SaleType): Product[] {
  return allProducts.filter((p) => p.saleType === saleType);
}

// 헬퍼 함수: productId로 검색
export function getProductById(productId: string): Product | undefined {
  return allProducts.find((p) => p.productId === productId);
}
