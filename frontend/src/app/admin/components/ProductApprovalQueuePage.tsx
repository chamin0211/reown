import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Eye, RefreshCw, Search, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { approveProduct, getAdminProducts, rejectProduct, type ProductListResponse } from '../../api/adminProductApi';

function formatPrice(price: number) {
  return `${Number(price ?? 0).toLocaleString()}원`;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

function saleTypeLabel(saleType: string) {
  const labels: Record<string, string> = { NORMAL: '브랜드 상품', FUNDING: '펀딩', RESELL: '리셀', DESIGNER_LIMITED: '디자이너 한정판' };
  return labels[saleType] ?? saleType;
}

export function ProductApprovalQueuePage() {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [query, setQuery] = useState('');
  const [saleType, setSaleType] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setProducts(await getAdminProducts('WAITING'));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '승인 대기 상품을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesType = saleType === 'ALL' || product.saleType === saleType;
      const matchesKeyword = !keyword || [product.name, product.brandName ?? '', product.categoryName ?? '', product.saleType]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
      return matchesType && matchesKeyword;
    });
  }, [products, query, saleType]);

  const summary = useMemo(() => ({
    total: products.length,
    normal: products.filter((item) => item.saleType === 'NORMAL').length,
    funding: products.filter((item) => item.saleType === 'FUNDING').length,
    resell: products.filter((item) => item.saleType === 'RESELL').length,
    designer: products.filter((item) => item.saleType === 'DESIGNER_LIMITED').length,
  }), [products]);

  const handleApprove = async (productId: number) => {
    if (!confirm('이 상품을 승인하시겠습니까?')) return;
    try {
      await approveProduct(productId);
      setProducts((prev) => prev.filter((item) => item.productId !== productId));
      alert('상품이 승인되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '상품 승인에 실패했습니다.');
    }
  };

  const handleReject = async (productId: number) => {
    if (!confirm('이 상품을 반려하시겠습니까?')) return;
    try {
      await rejectProduct(productId);
      setProducts((prev) => prev.filter((item) => item.productId !== productId));
      alert('상품이 반려되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '상품 반려에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">승인 대기열</h1>
            <p className="text-gray-500">셀러가 등록한 브랜드 상품, 디자이너 한정판, 펀딩/리셀 상품 중 승인 대기 상태만 검토합니다.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            ['전체', summary.total, 'ALL'], ['브랜드', summary.normal, 'NORMAL'], ['디자이너', summary.designer, 'DESIGNER_LIMITED'], ['펀딩', summary.funding, 'FUNDING'], ['리셀', summary.resell, 'RESELL'],
          ].map(([label, value, type]) => (
            <button key={String(label)} onClick={() => setSaleType(String(type))} className={`rounded-xl border p-5 text-left hover:shadow-sm ${saleType === type ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
              <p className="text-sm opacity-75">{label}</p><p className="text-2xl font-bold mt-1">{value}개</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 border-b">
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm" placeholder="상품명, 브랜드, 카테고리 검색" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="px-5 py-3 text-left">상품</th><th className="px-5 py-3 text-left">유형</th><th className="px-5 py-3 text-left">가격</th><th className="px-5 py-3 text-left">등록일</th><th className="px-5 py-3 text-right">검수</th></tr></thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.thumbnailUrl ?? ''} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-100" /><div><div className="font-bold text-gray-900">{product.name}</div><div className="text-xs text-gray-500">{product.brandName ?? '-'} · {product.categoryName ?? '-'}</div></div></div></td>
                    <td className="px-5 py-4"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{saleTypeLabel(product.saleType)}</span></td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(product.createdAt)}</td>
                    <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><Link to={`/admin/product-review/${product.productId}`} className="inline-flex items-center gap-1 px-3 py-2 border rounded-lg text-xs"><Eye size={14} />상세</Link><button onClick={() => handleApprove(product.productId)} className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs"><CheckCircle size={14} />승인</button><button onClick={() => handleReject(product.productId)} className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs"><XCircle size={14} />반려</button></div></td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-500">승인 대기 상품이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
