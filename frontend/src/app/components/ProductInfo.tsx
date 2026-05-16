import { useEffect, useState } from 'react';
import {
    addWishlistItem,
    deleteWishlistItemByProduct,
    isProductWished,
} from '../api/wishlistApi';
import { useNavigate } from 'react-router';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { addCartItem } from '../api/cartApi';
import { getLoginUser } from '../auth/session';

type SaleType = 'FUNDING' | 'REGULAR' | 'RESELL';

function normalizeOptionName(value: string): string {
  return value.trim().toLowerCase();
}

function splitOptionValue(value: string | null | undefined, fallback: string): string[] {
  if (!value || value.trim() === '') return [fallback];

  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : [fallback];
}

function optionContains(value: string | null | undefined, selected: string | null, fallback: string): boolean {
  if (!selected) return false;

  return splitOptionValue(value, fallback).some(
    (item) => normalizeOptionName(item) === normalizeOptionName(selected)
  );
}


interface ProductInfoProps {
  productId: string;
  name: string;
  brandName: string;
  price: number;
  saleType: SaleType;
  fundingAchievementRate?: number;
  isFunding?: boolean;
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
  // RESELL 전용
  conditionDescription?: string;
  isInspected?: boolean;
  originalPrice?: number;
}

export function ProductInfo({
                              productId,
                              name,
                              brandName,
                              price,
                              saleType,
                              fundingAchievementRate,
                              availableSizes,
                              availableColors,
                              options = [],
                              conditionDescription,
                              isInspected,
                              originalPrice,
                            }: ProductInfoProps) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
    useEffect(() => {
        const loginUser = getLoginUser();

        if (!loginUser) {
            return;
        }

        const numericProductId = Number(productId);

        if (Number.isNaN(numericProductId)) {
            return;
        }

        isProductWished(loginUser.userId, numericProductId)
            .then((result) => {
                setWished(result.wished);
            })
            .catch((error) => {
                console.error('찜 상태 조회 실패:', error);
            });
    }, [productId]);
    const handleToggleWishlist = () => {
        const loginUser = getLoginUser();

        if (!loginUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const numericProductId = Number(productId);

        if (Number.isNaN(numericProductId)) {
            alert('상품 정보를 찾을 수 없습니다.');
            return;
        }

        if (wished) {
            deleteWishlistItemByProduct(loginUser.userId, numericProductId)
                .then(() => {
                    setWished(false);
                    alert('찜 목록에서 삭제했습니다.');
                })
                .catch((error) => {
                    console.error('찜 삭제 실패:', error);
                    alert('찜 삭제에 실패했습니다.');
                });

            return;
        }

        addWishlistItem({
            userId: loginUser.userId,
            productId: numericProductId,
        })
            .then(() => {
                setWished(true);
                alert('찜 목록에 추가했습니다.');
            })
            .catch((error) => {
                console.error('찜 추가 실패:', error);
                alert('찜 추가에 실패했습니다.');
            });
    };
  const handleAddCart = () => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert('컬러와 사이즈를 선택해주세요.');
      return;
    }

    const selectedOption = options.find((option) => {
      return (
        optionContains(option.size, selectedSize, 'Free') &&
        optionContains(option.color, selectedColor, '기본')
      );
    });

    if (!selectedOption) {
      alert('선택한 옵션 정보를 찾을 수 없습니다.');
      return;
    }

    addCartItem({
      userId: loginUser.userId,
      optionId: selectedOption.optionId,
      quantity,
    })
        .then(() => {
          alert('장바구니에 담았습니다.');
          navigate('/cart');
        })
        .catch((error) => {
          console.error('장바구니 추가 실패:', error);
          alert('장바구니 추가에 실패했습니다.');
        });
  };

  return (
    <div className="space-y-6">
      {/* 상단 정보 */}
      <div className="space-y-2">
        <p className="text-gray-600">{brandName}</p>
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

        {/* RESELL 타입: 상품 상태 및 검수 완료 태그 */}
        {saleType === 'RESELL' && (
          <div className="flex items-center gap-2 pt-2">
            {isInspected && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-900 text-white text-sm font-semibold rounded-full">
                검수 완료
              </span>
            )}
            {conditionDescription && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {conditionDescription}
              </span>
            )}
          </div>
        )}

        {/* 가격 정보 */}
        <div className="flex items-end gap-3 pt-2">
          {saleType === 'RESELL' && originalPrice && (
            <p className="text-lg text-gray-400 line-through">{originalPrice.toLocaleString()}원</p>
          )}
          <p className="text-3xl font-bold text-gray-900">{price.toLocaleString()}원</p>
          {saleType === 'FUNDING' && fundingAchievementRate && (
            <p className="text-lg text-blue-900 font-semibold">
              달성률 {fundingAchievementRate}%
            </p>
          )}
        </div>

        {/* FUNDING 타입: 달성률 게이지 */}
        {saleType === 'FUNDING' && fundingAchievementRate && (
          <div className="pt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-900 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(fundingAchievementRate, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 (찜하기, 공유하기) */}
      <div className="flex gap-2">
          <button
              onClick={handleToggleWishlist}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
              <Heart
                  className={`w-5 h-5 ${
                      wished ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
              />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600"/>
          </button>
      </div>

        <div className="border-t border-gray-200 pt-6 space-y-6">
        {/* 컬러 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            컬러 선택
          </label>
          <div className="flex gap-3 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all ${
                  selectedColor === color.name
                    ? 'border-blue-900 bg-blue-50 text-blue-900 ring-2 ring-blue-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                title={color.name}
              >
                <span
                  className="inline-block h-6 w-6 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 사이즈 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            사이즈 선택
          </label>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2 rounded-full border transition-all ${
                  selectedSize === size
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 수량 선택 (RESELL은 1개만) */}
        {saleType !== 'RESELL' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">수량</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}

        {saleType === 'RESELL' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">리셀 상품 안내</span>
              <br />
              이 상품은 중고 상품으로 재판매가 불가능하며, 교환/환불 정책이 일반 상품과 다릅니다.
            </p>
          </div>
        )}
      </div>

      {/* 총 금액 */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">총 금액</span>
          <span className="text-2xl font-bold text-gray-900">
            {(price * (saleType === 'RESELL' ? 1 : quantity)).toLocaleString()}원
          </span>
        </div>

        {/* 메인 액션 버튼 - saleType에 따라 다른 버튼 */}
        {saleType === 'FUNDING' && (
          <button
            onClick={() => navigate('/funding-checkout')}
            className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            disabled={!selectedSize || !selectedColor}
          >
            펀딩 참여하기
          </button>
        )}

        {saleType === 'REGULAR' && (
          <div className="space-y-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              disabled={!selectedSize || !selectedColor}
            >
              구매하기
            </button>
            <button
                onClick={handleAddCart}
                className="w-full bg-white text-blue-900 py-4 rounded-lg font-semibold border-2 border-blue-900 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                disabled={!selectedSize || !selectedColor}
            >
              <ShoppingCart className="w-5 h-5"/>
              장바구니
            </button>
          </div>
        )}

        {saleType === 'RESELL' && (
            <button
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                disabled={!selectedSize || !selectedColor}
            >
              즉시 구매하기
            </button>
        )}

        {(!selectedSize || !selectedColor) && (
          <p className="text-sm text-red-600 text-center mt-2">
            컬러와 사이즈를 선택해주세요
          </p>
        )}
      </div>
    </div>
  );
}
