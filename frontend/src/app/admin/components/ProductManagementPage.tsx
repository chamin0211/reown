import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Search, Plus, Eye, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { approveProduct, getAdminProducts, rejectProduct } from '../../api/adminProductApi';
import type { ProductListResponse } from '../../api/adminProductApi';

type FilterType = 'ALL' | 'WAITING' | 'ON_SALE' | 'REJECTED';

function formatPrice(price: number) {
  return `₩${price.toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    WAITING: '검수대기',
    ON_SALE: '판매중',
    REJECTED: '반려',
    DELETED: '삭제됨',
  };
  return map[status] ?? status;
}

function getSaleTypeText(saleType: string) {
  const map: Record<string, string> = {
    NORMAL: '일반',
    FUNDING: '펀딩',
    RESELL: '리셀',
  };
  return map[saleType] ?? saleType;
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    WAITING: 'bg-yellow-100 text-yellow-700',
    ON_SALE: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    DELETED: 'bg-gray-100 text-gray-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
}

export function ProductManagementPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // 상태 요약 카드는 항상 전체 상품 기준으로 계산해야 하므로 전체 목록을 가져옵니다.
      // 상태/검색 필터링은 아래 filteredProducts에서 프론트에서 처리합니다.
      const data = await getAdminProducts();
      setProducts(data);
      setSelectedProducts(new Set());
    } catch (error) {
      console.error('관리자 상품 목록 조회 실패:', error);
      alert(error instanceof Error ? error.message : '상품 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedProducts(new Set());
  }, [selectedFilter, searchQuery]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus = selectedFilter === 'ALL' || product.status === selectedFilter;
      const matchesSearch =
        !query ||
        [product.name, product.brandName ?? '', product.categoryName ?? '', product.status]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [products, searchQuery, selectedFilter]);

  const summary = useMemo(() => ({
    total: products.length,
    waiting: products.filter((product) => product.status === 'WAITING').length,
    onSale: products.filter((product) => product.status === 'ON_SALE').length,
    rejected: products.filter((product) => product.status === 'REJECTED').length,
  }), [products]);

  const selectedWaitingProductIds = useMemo(() => {
    return products
      .filter((product) => selectedProducts.has(product.productId) && product.status === 'WAITING')
      .map((product) => product.productId);
  }, [products, selectedProducts]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.productId)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProducts(newSelected);
  };

  const handleApprove = async (productId: number) => {
    if (!confirm('이 상품을 승인하시겠습니까? 승인 후 사용자 상품 목록에 노출됩니다.')) return;
    try {
      await approveProduct(productId);
      await loadProducts();
      alert('상품이 승인되었습니다.');
    } catch (error) {
      console.error('상품 승인 실패:', error);
      alert(error instanceof Error ? error.message : '상품 승인에 실패했습니다.');
    }
  };

  const handleReject = async (productId: number) => {
    if (!confirm('이 상품을 반려하시겠습니까?')) return;
    try {
      await rejectProduct(productId);
      await loadProducts();
      alert('상품이 반려되었습니다.');
    } catch (error) {
      console.error('상품 반려 실패:', error);
      alert(error instanceof Error ? error.message : '상품 반려에 실패했습니다.');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedWaitingProductIds.length === 0) {
      alert('선택된 승인 대기 상품이 없습니다.');
      return;
    }
    if (!confirm(`${selectedWaitingProductIds.length}개 상품을 일괄 승인하시겠습니까?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedWaitingProductIds.map((productId) => approveProduct(productId)));
      await loadProducts();
      alert('선택한 상품이 승인되었습니다.');
    } catch (error) {
      console.error('상품 일괄 승인 실패:', error);
      alert(error instanceof Error ? error.message : '상품 일괄 승인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedWaitingProductIds.length === 0) {
      alert('선택된 승인 대기 상품이 없습니다.');
      return;
    }
    if (!confirm(`${selectedWaitingProductIds.length}개 상품을 일괄 반려하시겠습니까?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedWaitingProductIds.map((productId) => rejectProduct(productId)));
      await loadProducts();
      alert('선택한 상품이 반려되었습니다.');
    } catch (error) {
      console.error('상품 일괄 반려 실패:', error);
      alert(error instanceof Error ? error.message : '상품 일괄 반려에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">상품 관리</h1>
          <p className="text-gray-500">MySQL에 등록된 상품을 조회하고 승인/반려합니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '전체', value: summary.total, filter: 'ALL', className: 'bg-gray-900 text-white' },
            { label: '검수대기', value: summary.waiting, filter: 'WAITING', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            { label: '판매중', value: summary.onSale, filter: 'ON_SALE', className: 'bg-green-50 text-green-700 border-green-200' },
            { label: '반려', value: summary.rejected, filter: 'REJECTED', className: 'bg-red-50 text-red-700 border-red-200' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedFilter(item.filter as FilterType)}
              className={`rounded-xl border p-4 text-left hover:shadow-sm transition-all ${item.className}`}
            >
              <div className="text-sm font-medium opacity-80">{item.label}</div>
              <div className="text-2xl font-bold mt-1">{item.value}개</div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex gap-2">
                {(['ALL', 'WAITING', 'ON_SALE', 'REJECTED'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      selectedFilter === filter
                        ? 'bg-[#1e40af] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'ALL' ? '전체' : getStatusText(filter)}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="상품명, 브랜드, 카테고리 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={loadProducts}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  새로고침
                </button>
                {selectedWaitingProductIds.length > 0 && (
                  <>
                    <button
                      onClick={handleBulkApprove}
                      disabled={loading}
                      className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 disabled:opacity-60"
                    >
                      <CheckCircle size={18} />
                      선택 승인
                    </button>
                    <button
                      onClick={handleBulkReject}
                      disabled={loading}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 disabled:opacity-60"
                    >
                      <XCircle size={18} />
                      선택 반려
                    </button>
                  </>
                )}
                <button
                  disabled
                  className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed"
                >
                  <Plus size={18} />
                  상품 등록
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">썸네일</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">브랜드</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상품명</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">판매 유형</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">가격</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">등록일</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">상품 목록을 불러오는 중입니다...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">조회된 상품이 없습니다.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const imageUrl = product.thumbnailUrl?.startsWith('http')
                      ? product.thumbnailUrl
                      : `https://picsum.photos/seed/reown-product-${product.productId}/120/120`;

                    return (
                      <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.productId)}
                            onChange={(e) => handleSelectProduct(product.productId, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-blue-600">#{product.productId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <img src={imageUrl} alt={product.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.brandName || `Brand #${product.brandId}`}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{product.categoryName || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                            {getSaleTypeText(product.saleType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                            {getStatusText(product.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {product.status === 'WAITING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(product.productId)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="승인"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleReject(product.productId)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="반려"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            <Link
                              to={`/admin/product-review/${product.productId}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="상세 검토"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              {selectedProducts.size > 0 ? `${selectedProducts.size}개 선택됨 / ` : ''}
              {selectedWaitingProductIds.length > 0 ? `일괄 처리 가능 ${selectedWaitingProductIds.length}개 / ` : ''}
              총 {filteredProducts.length}개 상품
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
