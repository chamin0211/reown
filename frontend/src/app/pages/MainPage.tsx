import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { HeroSlider } from '../components/HeroSlider';
import { ProductSection } from '../components/ProductSection';
import { FundingCard } from '../components/FundingCard';
import { StoreCard } from '../components/StoreCard';
import { ResellCard } from '../components/ResellCard';
import { Link } from 'react-router';
import type { Product } from '../data/products';
import { getProducts } from '../api/productApi';
import { getFundingProducts } from '../api/fundingApi';


export function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);

      const [normalResult, fundingResult] = await Promise.allSettled([
        getProducts(),
        getFundingProducts(),
      ]);

      if (normalResult.status === 'rejected') {
        console.error('일반 상품 목록 조회 실패:', normalResult.reason);
      }

      if (fundingResult.status === 'rejected') {
        console.error('펀딩 상품 목록 조회 실패:', fundingResult.reason);
      }

      const normalProducts = normalResult.status === 'fulfilled' ? normalResult.value : [];
      const fundingProductsFromApi = fundingResult.status === 'fulfilled' ? fundingResult.value : [];

      const normalWithoutFunding = normalProducts.filter(
        (product) => product.saleType !== 'FUNDING'
      );

      const mergedProducts = [...fundingProductsFromApi, ...normalWithoutFunding];

      if (!cancelled) {
        setProducts(mergedProducts);
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const fundingProducts = products.filter((p) => p.saleType === 'FUNDING').slice(0, 3);

  const regularProducts = products.filter((p) => p.saleType === 'REGULAR');

  const designerStoreProducts = regularProducts.slice(0, 3);
  const brandStoreProducts = regularProducts.slice(3, 6);

  const resellProducts = products.filter((p) => p.saleType === 'RESELL').slice(0, 3);

  return (
        <div className="min-h-screen bg-white">
          {/* 고정 헤더 */}
          <Header/>

          {/* 히어로 슬라이더 */}
          <HeroSlider/>

          {/* 메인 콘텐츠 영역 */}
          <main>
            {loading && (
                <div className="max-w-7xl mx-auto px-4 py-6 text-gray-500">
                  상품 정보를 불러오는 중입니다...
                </div>
            )}

            {/* 펀딩 섹션 */}
            <ProductSection title="진행중인 펀딩" id="funding" linkHref="/category/funding">
              {fundingProducts.map((product) => (
                  <Link to={product.fundingCampaignId ? `/funding/${product.fundingCampaignId}` : `/product/${product.productId}`} key={product.productId}>
                    <FundingCard {...product} />
                  </Link>
              ))}
            </ProductSection>

            {/* 디자이너 스토어 섹션 */}
            <div className="bg-gray-50">
              <ProductSection title="디자이너 스토어" id="designer-store" linkHref="/category/designer-store">
                {designerStoreProducts.map((product) => (
                    <Link to={`/product/${product.productId}`} key={product.productId}>
                      <StoreCard {...product} />
                    </Link>
                ))}
              </ProductSection>
            </div>

            {/* 브랜드 스토어 섹션 */}
            <ProductSection title="브랜드 스토어" id="brand-store" linkHref="/category/brand-store">
              {brandStoreProducts.map((product) => (
                  <Link to={`/product/${product.productId}`} key={product.productId}>
                    <StoreCard {...product} />
                  </Link>
              ))}
            </ProductSection>

            {/* 리셀 섹션 */}
            <div className="bg-gray-50">
              <ProductSection title="리셀 마켓" id="resell" linkHref="/category/resell">
                {resellProducts.map((product) => (
                    <Link to={`/product/${product.productId}`} key={product.productId}>
                      <ResellCard
                          resellId={product.productId}
                          name={product.name}
                          resellPrice={product.price}
                          conditionDescription={product.conditionDescription || ''}
                          ogImageUrl={product.ogImageUrl}
                      />
                    </Link>
                ))}
              </ProductSection>
            </div>
          </main>

          {/* 푸터 */}
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">re:own</h3>
                  <p className="text-gray-400">새로운 패션 경험의 시작</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">쇼핑</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="#brand-store" className="hover:text-white transition-colors">
                        브랜드 스토어
                      </a>
                    </li>
                    <li>
                      <a href="#designer-store" className="hover:text-white transition-colors">
                        디자이너 스토어
                      </a>
                    </li>
                    <li>
                      <a href="#funding" className="hover:text-white transition-colors">
                        펀딩
                      </a>
                    </li>
                    <li>
                      <a href="#resell" className="hover:text-white transition-colors">
                        리셀
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">고객지원</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        공지사항
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        1:1 문의
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">회사소개</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        회사 정보
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        이용약관
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        개인정보처리방침
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2026 re:own. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
    );
}