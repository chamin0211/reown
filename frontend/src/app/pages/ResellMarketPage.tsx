import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { FilterSidebar } from '../components/FilterSidebar';
import { GridLayoutSwitcher } from '../components/GridLayoutSwitcher';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { getResells } from '../api/resellApi';
import type { ResellResponse } from '../api/resellApi';

function getImageUrl(item: ResellResponse) {
    if (!item.thumbnailUrl) {
        return `https://picsum.photos/seed/reown-resell-${item.productId}/600/800`;
    }

    if (item.thumbnailUrl.startsWith('http')) {
        return item.thumbnailUrl;
    }

    if (item.thumbnailUrl.startsWith('/')) {
        return item.thumbnailUrl;
    }

    if (item.thumbnailUrl.startsWith('./')) {
        return `/${item.thumbnailUrl.slice(2)}`;
    }

    return `/${item.thumbnailUrl}`;
}

function getBrandName(productName: string) {
    return productName.split(' ')[0] || 'RE:OWN';
}

function sortResells(items: ResellResponse[], sortBy: string) {
    const copied = [...items];

    switch (sortBy) {
        case 'price-asc':
            return copied.sort((a, b) => a.resellPrice - b.resellPrice);

        case 'price-desc':
            return copied.sort((a, b) => b.resellPrice - a.resellPrice);

        case 'latest':
        default:
            return copied.sort((a, b) => b.resellId - a.resellId);
    }
}

export function ResellMarketPage() {
    const [items, setItems] = useState<ResellResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('latest');
    const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);

    useEffect(() => {
        getResells()
            .then(setItems)
            .catch((error) => {
                console.error('리셀 상품 조회 실패:', error);
                alert('리셀 상품을 불러오지 못했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const visibleItems = sortResells(
        items.filter((item) => item.status !== 'DELETED'),
        sortBy
    );

    const gridColsClass = {
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6',
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="pt-16 flex">
                <FilterSidebar />

                <main className="flex-1">
                    <div className="border-b border-gray-200 bg-white">
                        <div className="max-w-7xl mx-auto px-6 py-6">
                            <div className="text-sm text-gray-500 mb-4">홈 / RESELL</div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                RESELL MARKET
                            </h1>
                            <p className="text-gray-600 mt-1">
                                보증서 기반으로 검증된 리셀 상품을 만나보세요
                            </p>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
                        <div className="max-w-7xl mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600">
                                        총{' '}
                                        <span className="font-semibold text-gray-900">
                      {visibleItems.length}
                    </span>
                                        개
                                    </p>

                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
                                        >
                                            <option value="latest">최신순</option>
                                            <option value="price-asc">낮은 가격순</option>
                                            <option value="price-desc">높은 가격순</option>
                                        </select>

                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                <GridLayoutSwitcher
                                    currentColumns={gridColumns}
                                    onColumnsChange={setGridColumns}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">
                                리셀 상품을 불러오는 중입니다...
                            </div>
                        ) : visibleItems.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    등록된 리셀 상품이 없습니다
                                </h3>
                                <p className="text-gray-600">나중에 다시 확인해주세요.</p>
                            </div>
                        ) : (
                            <div className={`grid ${gridColsClass[gridColumns]} gap-6`}>
                                {visibleItems.map((item) => (
                                    <Link
                                        to={`/resell/${item.resellId}`}
                                        key={item.resellId}
                                        className="group"
                                    >
                                        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg mb-4">
                                            <img
                                                src={getImageUrl(item)}
                                                alt={item.productName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-900 text-white text-xs">
                                                <ShieldCheck className="w-3 h-3" />
                                                검증 리셀
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1">
                                            {getBrandName(item.productName)}
                                        </p>

                                        <h3 className="text-sm text-gray-900 font-light mb-2 truncate">
                                            {item.productName}
                                        </h3>

                                        <p className="text-xs text-gray-500 mb-1">
                                            {item.color} / {item.size}
                                        </p>

                                        <p className="text-base font-semibold text-gray-900 mb-1">
                                            ₩{item.resellPrice.toLocaleString()}
                                        </p>

                                        <p className="text-xs text-gray-500 truncate">
                                            {item.conditionDescription || '상태 설명 없음'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}