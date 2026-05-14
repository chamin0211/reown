import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router';

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: string;
  status: '검수대기' | '승인필요';
  date: string;
}

const products: Product[] = [
  {
    id: 'P-2024-001',
    name: '나이키 에어포스 1 화이트',
    seller: '김리셀',
    category: '스니커즈',
    price: '₩89,000',
    status: '검수대기',
    date: '2024.03.27',
  },
  {
    id: 'P-2024-002',
    name: '구찌 GG 마몽 크로스백',
    seller: '박셀러',
    category: '가방',
    price: '₩1,240,000',
    status: '승인필요',
    date: '2024.03.27',
  },
  {
    id: 'P-2024-003',
    name: '아디다스 삼바 OG 블랙',
    seller: '이상품',
    category: '스니커즈',
    price: '₩125,000',
    status: '검수대기',
    date: '2024.03.26',
  },
  {
    id: 'P-2024-004',
    name: '루이비통 네버풀 MM',
    seller: '최명품',
    category: '가방',
    price: '₩1,850,000',
    status: '승인필요',
    date: '2024.03.26',
  },
  {
    id: 'P-2024-005',
    name: '뉴발란스 990v6 그레이',
    seller: '정운동화',
    category: '스니커즈',
    price: '₩189,000',
    status: '검수대기',
    date: '2024.03.26',
  },
];

export function PendingProductsTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">승인 대기 상품</h2>
        <p className="text-sm text-gray-500 mt-1.5">총 {products.length}건의 상품이 승인을 기다리고 있습니다</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                상품 ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                판매자
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {product.id}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.seller}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      product.status === '검수대기'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <p className="text-sm text-gray-600 font-medium">1-5 of 47 items</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-700">
            이전
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}