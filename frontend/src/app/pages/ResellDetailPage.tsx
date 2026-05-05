import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Gavel, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { getResellDetail } from '../api/resellApi';
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

export function ResellDetailPage() {
    const { resellId } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<ResellResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [offerPrice, setOfferPrice] = useState('');

    useEffect(() => {
        const numericResellId = Number(resellId);

        if (Number.isNaN(numericResellId)) {
            alert('리셀 상품 정보를 찾을 수 없습니다.');
            navigate('/resell');
            return;
        }

        getResellDetail(numericResellId)
            .then((data) => {
                setItem(data);
                setOfferPrice(String(data.resellPrice));
            })
            .catch((error) => {
                console.error('리셀 상세 조회 실패:', error);
                alert('리셀 상품을 불러오지 못했습니다.');
                navigate('/resell');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [resellId, navigate]);

    const handleOfferSubmit = () => {
        const savedUser = localStorage.getItem('loginUser');

        if (!savedUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const numericOfferPrice = Number(offerPrice);

        if (Number.isNaN(numericOfferPrice) || numericOfferPrice <= 0) {
            alert('제안 가격을 올바르게 입력해주세요.');
            return;
        }

        alert(`가격 제안 화면 연결 확인\n제안 가격: ₩${numericOfferPrice.toLocaleString()}`);

        // 다음 단계에서 실제 가격 제안 API를 연결할 예정
        navigate('/my/bidding');
    };

    if (loading || !item) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center text-gray-500">
                    리셀 상품 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-[1200px] mx-auto px-8">
                    <Link
                        to="/resell"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        리셀 마켓으로 돌아가기
                    </Link>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg">
                                <img
                                    src={getImageUrl(item)}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
                                    {getBrandName(item.productName)}
                                </p>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {item.productName}
                                </h1>

                                <div className="flex items-end gap-3 mb-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        ₩{item.resellPrice.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {item.color} / {item.size}
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm">
                                    <ShieldCheck className="w-4 h-4" />
                                    디지털 보증서 기반 리셀 상품
                                </div>
                            </div>

                            <div className="border-t border-gray-200 py-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">리셀 번호</span>
                                    <span className="text-gray-900">#{item.resellId}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">판매자 번호</span>
                                    <span className="text-gray-900">#{item.sellerId}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">판매 상태</span>
                                    <span className="text-gray-900">{item.status}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">등록일</span>
                                    <span className="text-gray-900">{item.createdAt.slice(0, 10)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 py-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    상품 상태 설명
                                </h2>
                                <p className="text-sm text-gray-600 leading-6">
                                    {item.conditionDescription || '판매자가 등록한 상태 설명이 없습니다.'}
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    가격 제안하기
                                </h2>

                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="number"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900"
                                        placeholder="제안 가격"
                                    />

                                    <button
                                        onClick={handleOfferSubmit}
                                        className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                                    >
                                        <Gavel className="w-4 h-4 inline-block mr-2" />
                                        제안하기
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500">
                                    현재는 화면 연결 단계입니다. 다음 단계에서 실제 제안 API를 연결합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}