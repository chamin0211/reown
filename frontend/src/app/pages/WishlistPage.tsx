import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { getLoginUser } from '../auth/session';
import { deleteWishlistItem, getWishlistItems } from '../api/wishlistApi';
import type { WishItemResponse } from '../api/wishlistApi';


function getProductImageUrl(item: WishItemResponse) {
  if (item.thumbnailUrl && item.thumbnailUrl.startsWith('http')) {
    return item.thumbnailUrl;
  }

  return `https://picsum.photos/seed/reown-product-${item.productId}/600/800`;
}

function getBrandName(brandId: number) {
  const brandNames: Record<number, string> = {
    1: 'NUE OUTFIT',
    2: 'LUMIERE',
    3: 'RAW EDGE',
    4: 'SLOW THREAD',
    5: 'MODERN HANGUL',
    6: 'DAILY FORM',
    7: 'ODD ATELIER',
    8: 'MONO GROUND',
    9: 'VERT LINE',
    10: 'SEASONLESS',
  };

  return brandNames[brandId] ?? `Brand #${brandId}`;
}

export function WishlistPage() {
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState<WishItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginUser = getLoginUser();

    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    getWishlistItems(loginUser.userId)
        .then(setWishlistItems)
        .catch((error) => {
          console.error('찜 목록 조회 실패:', error);
          alert('찜 목록을 불러오지 못했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [navigate]);

  const handleDelete = (wishId: number) => {
    deleteWishlistItem(wishId)
        .then(() => {
          setWishlistItems((prevItems) => prevItems.filter((item) => item.wishId !== wishId));
          alert('찜 목록에서 삭제했습니다.');
        })
        .catch((error) => {
          console.error('찜 삭제 실패:', error);
          alert('찜 삭제에 실패했습니다.');
        });
  };

  return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="pt-28 pb-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2">
                Wishlist
              </h1>
              <p className="text-sm text-gray-500 font-light">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {loading ? (
                <div className="text-center py-32">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg font-light">찜 목록을 불러오는 중입니다...</p>
                </div>
            ) : wishlistItems.length > 0 ? (
                <div className="grid grid-cols-4 gap-8">
                  {wishlistItems.map((item) => (
                      <div key={item.wishId} className="group">
                        <Link to={`/product/${item.productId}`}>
                          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                            <img
                                src={getProductImageUrl(item)}
                                alt={item.productName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        <div className="flex items-start justify-between gap-3">
                          <Link to={`/product/${item.productId}`} className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                              {getBrandName(item.brandId)}
                            </p>

                            <h3 className="text-sm text-gray-900 font-light mb-2 truncate">
                              {item.productName}
                            </h3>

                            <p className="text-base text-gray-900 font-medium">
                              ₩{item.price.toLocaleString()}
                            </p>
                          </Link>

                          <button
                              onClick={() => handleDelete(item.wishId)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="찜 삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-32">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400 text-xl font-light tracking-wide mb-4">
                    Your wishlist is empty
                  </p>
                  <Link
                      to="/"
                      className="inline-block px-8 py-3 text-sm text-white tracking-widest font-light"
                      style={{ backgroundColor: '#1e3a8a' }}
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}