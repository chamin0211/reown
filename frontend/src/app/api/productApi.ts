import { api } from "./client";
import type { Product, SaleType } from "../data/products";

interface ProductListResponse {
    productId: number;
    brandId: number;
    name: string;
    thumbnailUrl: string | null;
    price: number;
    saleType: string;
    status: string;
}

interface ProductOptionResponse {
    optionId: number;
    size: string | null;
    color: string | null;
    colorHex: string | null;
    stockQuantity: number;
    safetyStock: number;
    reservedQuantity: number;
}

interface ProductDetailResponse extends ProductListResponse {
    weightG: number | null;
    maxPurchasePerUser: number | null;
    displaySortOrder: number | null;
    createdAt: string;
    options: ProductOptionResponse[];
}

const fallbackImage =
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80";

function mapSaleType(saleType: string): SaleType {
    if (saleType === "FUNDING") return "FUNDING";
    if (saleType === "RESELL") return "RESELL";

    // 백엔드는 NORMAL, 프론트는 REGULAR를 사용하므로 변환
    return "REGULAR";
}

function getBrandName(brandId: number): string {
    const brandNames: Record<number, string> = {
        1: "NUE OUTFIT",
        2: "LUMIERE",
        3: "RAW EDGE",
        4: "SLOW THREAD",
        5: "MODERN HANGUL",
        6: "DAILY FORM",
        7: "ODD ATELIER",
        8: "MONO GROUND",
        9: "VERT LINE",
        10: "SEASONLESS",
    };

    return brandNames[brandId] ?? `Brand #${brandId}`;
}

function toProduct(data: ProductListResponse | ProductDetailResponse): Product {
    const options = "options" in data ? data.options : [];

    const availableSizes =
        options.length > 0
            ? Array.from(new Set(options.map((option) => option.size || "Free")))
            : ["Free"];

    const availableColors =
        options.length > 0
            ? Array.from(
                new Map(
                    options.map((option) => [
                        option.color || "기본",
                        {
                            name: option.color || "기본",
                            code: option.colorHex || "#000000",
                        },
                    ])
                ).values()
            )
            : [{ name: "기본", code: "#000000" }];

    const saleType = mapSaleType(data.saleType);
    const imageUrl =
        data.thumbnailUrl && data.thumbnailUrl.startsWith('http')
            ? data.thumbnailUrl
            : `https://picsum.photos/seed/reown-product-${data.productId}/600/800`;

    return {
        productId: String(data.productId),
        name: data.name,
        brandName: getBrandName(data.brandId),
        price: data.price,
        saleType,
        ogImageUrl: imageUrl,
        images: [imageUrl],
        availableSizes,
        availableColors,
        options,
        description: `${data.name} 상품 상세 정보입니다.`,
        sizeGuide: availableSizes.map((size) => ({
            label: size,
            shoulder: "-",
            chest: "-",
            sleeve: "-",
            length: "-",
        })),
        reviews: [],
        fundingAchievementRate: saleType === "FUNDING" ? 80 : undefined,
        remainingDays: saleType === "FUNDING" ? 12 : undefined,
        productionStages:
            saleType === "FUNDING"
                ? [
                    { stage: "material_order", label: "소재 발주", completed: true },
                    { stage: "pattern_making", label: "패턴 제작", completed: true },
                    { stage: "production", label: "생산 중", completed: false },
                    { stage: "shipping_prep", label: "배송 준비", completed: false },
                ]
                : undefined,
    };
}

export async function getProducts(): Promise<Product[]> {
    const data = await api<ProductListResponse[]>("/api/products");
    return data.map(toProduct);
}

export async function getProduct(productId: string): Promise<Product> {
    const data = await api<ProductDetailResponse>(`/api/products/${productId}`);
    return toProduct(data);
}