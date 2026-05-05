import { Header } from '../components/Header';
import { RegularStoreCard } from '../components/RegularStoreCard';
import { FundingStoreCard } from '../components/FundingStoreCard';
import { ResellStoreCard } from '../components/ResellStoreCard';

export function StyleGuidePage() {
  // 카드 1: REGULAR_STORE
  const regularProduct = {
    productId: 'regular-wallet-001',
    brandName: '코어 디자인스',
    name: '모던 가죽 지갑',
    price: '₩55,000',
    ogImageUrl:
      'https://images.unsplash.com/photo-1620109176332-4f388ca26596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd2FsbGV0JTIwYnJvd258ZW58MXx8fHwxNzc0NjE5NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // 카드 2: FUNDING
  const fundingProduct = {
    productId: 'funding-backpack-001',
    brandName: '어반 디자이너스',
    name: '미니멀 레더 백팩',
    price: '₩189,000',
    fundingAchievementRate: '156',
    ogImageUrl:
      'https://images.unsplash.com/photo-1771154708814-23e13d9324e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGxlYXRoZXIlMjBiYWNrcGFjayUyMGZhc2hpb258ZW58MXx8fHwxNzc0NjE5NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // 카드 3: RESELL
  const resellProduct = {
    productId: 'resell-sneakers-001',
    brandName: '킥스 랩',
    name: '스트릿웨어 스니커즈',
    price: '₩320,000',
    conditionDescription: 'Like New',
    ogImageUrl:
      'https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzJTIwd2hpdGV8ZW58MXx8fHwxNzc0NjE5NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              re:own Product Card Style Guide
            </h1>
            <p className="text-lg text-gray-600">
              세 가지 판매 유형(REGULAR, FUNDING, RESELL)에 따른 상품 카드 비교
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-900 rounded" />
                <span className="text-sm text-gray-600">Navy Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" />
                <span className="text-sm text-gray-600">White Base</span>
              </div>
            </div>
          </div>

          {/* 카드 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* 카드 1: REGULAR_STORE */}
            <div>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  1. REGULAR_STORE (일반 상품)
                </h2>
                <p className="text-sm text-gray-600">
                  일반 스토어 상품 - 펀딩 UI 없이 깔끔한 구매 옵션만 제공
                </p>
              </div>
              <RegularStoreCard {...regularProduct} />
            </div>

            {/* 카드 2: FUNDING */}
            <div>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">2. FUNDING (펀딩 상품)</h2>
                <p className="text-sm text-gray-600">
                  달성률 게이지, 생산 타임라인, 디지털 보증서 포함
                </p>
              </div>
              <FundingStoreCard {...fundingProduct} />
            </div>

            {/* 카드 3: RESELL */}
            <div>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">3. RESELL (리셀 매물)</h2>
                <p className="text-sm text-gray-600">
                  검수 완료 배지, 상품 상태 설명, 리셀 안내 포함
                </p>
              </div>
              <ResellStoreCard {...resellProduct} />
            </div>
          </div>

          {/* 데이터 바인딩 가이드 */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">데이터 바인딩 필드</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* REGULAR */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-blue-900 mb-3">REGULAR_STORE</h4>
                <ul className="space-y-1 text-sm font-mono text-gray-700">
                  <li>• {'{productId}'}</li>
                  <li>• {'{brandName}'}</li>
                  <li>• {'{name}'}</li>
                  <li>• {'{price}'}</li>
                </ul>
              </div>

              {/* FUNDING */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-blue-900 mb-3">FUNDING</h4>
                <ul className="space-y-1 text-sm font-mono text-gray-700">
                  <li>• {'{productId}'}</li>
                  <li>• {'{brandName}'}</li>
                  <li>• {'{name}'}</li>
                  <li>• {'{price}'}</li>
                  <li>• {'{fundingAchievementRate}%'}</li>
                  <li>• {'{ogImageUrl}'}</li>
                </ul>
              </div>

              {/* RESELL */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-blue-900 mb-3">RESELL</h4>
                <ul className="space-y-1 text-sm font-mono text-gray-700">
                  <li>• {'{productId}'}</li>
                  <li>• {'{brandName}'}</li>
                  <li>• {'{name}'}</li>
                  <li>• {'{price}'}</li>
                  <li>• {'{conditionDescription}'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 조건부 UI 가이드 */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">조건부 UI 렌더링 규칙</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">REGULAR_STORE</h4>
                <p className="text-gray-600 mb-2">포함:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                  <li>사이즈 선택 칩</li>
                  <li>구매하기 버튼</li>
                  <li>장바구니 버튼</li>
                </ul>
                <p className="text-gray-600 mt-2 mb-2">제외:</p>
                <ul className="list-disc list-inside text-red-600 space-y-1 text-xs">
                  <li>펀딩 게이지 바</li>
                  <li>생산 타임라인</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">FUNDING</h4>
                <p className="text-gray-600 mb-2">포함:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                  <li>달성률 게이지 바</li>
                  <li>생산 단계 타임라인</li>
                  <li>디지털 보증서</li>
                  <li>펀딩 참여 버튼</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">RESELL</h4>
                <p className="text-gray-600 mb-2">포함:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                  <li>검수 완료 배지</li>
                  <li>상품 상태 설명</li>
                  <li>리셀 안내 메시지</li>
                  <li>즉시 구매 버튼</li>
                </ul>
                <p className="text-gray-600 mt-2 mb-2">제외:</p>
                <ul className="list-disc list-inside text-red-600 space-y-1 text-xs">
                  <li>펀딩 게이지 바</li>
                  <li>생산 타임라인</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
