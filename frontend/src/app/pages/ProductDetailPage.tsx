import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Header } from '../components/Header';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { ProductInfo } from '../components/ProductInfo';
import { ProductionTimeline } from '../components/ProductionTimeline';
import { DigitalCertificate } from '../components/DigitalCertificate';
import { ProductTabs } from '../components/ProductTabs';
import { ResellConditionInfo } from '../components/ResellConditionInfo';
import { RegularStockInfo } from '../components/RegularStockInfo';
import type { Product } from '../data/products';
import { getProduct } from '../api/productApi';

export function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    getProduct(productId)
        .then(setProduct)
        .catch((error) => {
          console.error('상품 상세 조회 실패:', error);
          setProduct(null);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [productId]);

  if (loading) {
    return (
        <div className="min-h-screen bg-white">
          <Header />
          <main className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
              <p className="text-gray-600">상품 정보를 불러오는 중입니다...</p>
            </div>
          </main>
        </div>
    );
  }

  // 상품을 찾지 못한 경우 기본값 처리
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 메인 컨텐츠 영역 */}
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2열 레이아웃: 이미지 + 구매 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* 왼쪽: 상품 이미지 */}
            <ProductImageGallery images={product.images} productName={product.name} />

            {/* 오른쪽: 상품 정보 */}
            <div className="lg:sticky lg:top-24 h-fit">
              <ProductInfo
                productId={product.productId}
                name={product.name}
                brandName={product.brandName}
                price={product.price}
                saleType={product.saleType}
                fundingAchievementRate={product.fundingAchievementRate}
                availableSizes={product.availableSizes}
                availableColors={product.availableColors}
                options={product.options}
                conditionDescription={product.conditionDescription}
                isInspected={product.isInspected}
                originalPrice={product.originalPrice}
              />
            </div>
          </div>

          {/* FUNDING 타입일 때만 생산 단계 타임라인 표시 */}
          {product.saleType === 'FUNDING' && product.productionStages && (
            <div className="mb-8">
              <ProductionTimeline stages={product.productionStages} />
            </div>
          )}

          {/* REGULAR 타입일 때만 재고 정보 표시 */}
          {product.saleType === 'REGULAR' && (
            <RegularStockInfo stockStatus="in_stock" stockCount={28} />
          )}

          {/* RESELL 타입일 때만 상품 상태 정보 표시 */}
          {product.saleType === 'RESELL' &&
            product.conditionDescription &&
            product.isInspected !== undefined && (
              <ResellConditionInfo
                conditionDescription={product.conditionDescription}
                isInspected={product.isInspected}
                originalPrice={product.originalPrice}
                currentPrice={product.price}
              />
            )}

          {/* 디지털 보증서 - FUNDING 타입일 때만 표시 */}
          {product.saleType === 'FUNDING' && (
            <div className="mb-12">
              <DigitalCertificate />
            </div>
          )}

          {/* 상세 정보 탭 */}
          <ProductTabs
            description={product.description}
            sizeGuide={product.sizeGuide}
            reviews={product.reviews}
          />
        </div>
      </main>
    </div>
  );
}