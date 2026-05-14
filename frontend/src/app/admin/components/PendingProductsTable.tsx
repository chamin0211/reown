import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router';
import { getAdminProducts } from '../../api/adminProductApi';
import type { ProductListResponse } from '../../api/adminProductApi';

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

export function PendingProductsTable() {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminProducts('WAITING');
        setProducts(data);
      } catch (error) {
        console.error('승인 대기 상품 조회 실패:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">승인 대기 상품</h2>
            <p className="text-sm text-gray-500 mt-1">MySQL에 저장된 WAITING 상품만 표시합니다</p>
          </div>
          <Link to="/admin/products" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm">
            전체 상품 보기
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">승인 대기 상품을 불러오는 중입니다...</div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-gray-500">승인 대기 상품이 없습니다</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상품명</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">브랜드</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가격</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">등록일</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.brandName || `Brand #${product.brandId}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(product.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/product-review/${product.productId}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                      <Eye size={16} />
                      검토하기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
