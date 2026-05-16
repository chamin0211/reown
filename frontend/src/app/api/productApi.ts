import { api } from "./client";
import type { Product, SaleType } from "../data/products";

interface ProductListResponse {
    productId: number;
    brandId: number;
    brandName?: string | null;
    name: string;
    thumbnailUrl: string | null;
    price: number;
    categoryName?: string | null;
    description?: string | null;
    saleType: string;
    status: string;
    createdAt?: string;
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

const COLOR_HEX_BY_NAME: Record<string, string> = {
    black: "#000000",
    블랙: "#000000",
    검정: "#000000",
    검정색: "#000000",
    white: "#ffffff",
    화이트: "#ffffff",
    흰색: "#ffffff",
    ivory: "#f8f1df",
    아이보리: "#f8f1df",
    gray: "#808080",
    grey: "#808080",
    그레이: "#808080",
    회색: "#808080",
    blue: "#2563eb",
    블루: "#2563eb",
    파랑: "#2563eb",
    네이비: "#1e3a8a",
    navy: "#1e3a8a",
    red: "#dc2626",
    레드: "#dc2626",
    빨강: "#dc2626",
    green: "#16a34a",
    그린: "#16a34a",
    초록: "#16a34a",
    beige: "#d6c4a8",
    베이지: "#d6c4a8",
    brown: "#8b5e3c",
    브라운: "#8b5e3c",
    차콜: "#374151",
    charcoal: "#374151",
    pink: "#f4a7b9",
    핑크: "#f4a7b9",
    yellow: "#facc15",
    옐로우: "#facc15",
    노랑: "#facc15",
    orange: "#f97316",
    오렌지: "#f97316",
    purple: "#7c3aed",
    퍼플: "#7c3aed",
    보라: "#7c3aed",
};

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

function normalizeOptionName(value: string): string {
    return value.trim().toLowerCase();
}

function splitOptionValue(value: string | null | undefined, fallback: string): string[] {
    if (!value || value.trim() === "") return [fallback];

    const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    return items.length > 0 ? items : [fallback];
}

function isDefaultBlack(hex?: string | null): boolean {
    const normalized = (hex || "").trim().toLowerCase();
    return normalized === "" || normalized === "#000" || normalized === "#000000";
}

function inferColorHex(colorName: string, storedHex?: string | null): string {
    const normalizedName = normalizeOptionName(colorName);
    const inferred = COLOR_HEX_BY_NAME[normalizedName];

    // 이전 등록/수정 코드가 모든 색상을 #000000으로 저장하던 문제가 있었기 때문에,
    // 색상명이 블랙이 아닌데 저장값이 기본 검정이면 색상명 기준으로 보정합니다.
    if (isDefaultBlack(storedHex) && inferred) {
        return inferred;
    }

    if (storedHex && storedHex.trim()) {
        return storedHex.trim();
    }

    return inferred || "#9ca3af";
}

function toProduct(data: ProductListResponse | ProductDetailResponse): Product {
    const options = "options" in data ? data.options : [];

    const sizeMap = new Map<string, string>();
    options.forEach((option) => {
        splitOptionValue(option.size, "Free").forEach((size) => {
            sizeMap.set(normalizeOptionName(size), size);
        });
    });

    const availableSizes = options.length > 0 ? Array.from(sizeMap.values()) : ["Free"];

    const colorMap = new Map<string, { name: string; code: string }>();
    options.forEach((option) => {
        splitOptionValue(option.color, "기본").forEach((color) => {
            const key = normalizeOptionName(color);
            const code = inferColorHex(color, option.colorHex);
            const previous = colorMap.get(key);

            // 같은 색상이 여러 옵션에 있으면, 기존 코드가 회색/기본값일 때 더 구체적인 값을 우선합니다.
            if (!previous || previous.code === "#9ca3af") {
                colorMap.set(key, { name: color, code });
            }
        });
    });

    const availableColors =
        options.length > 0 ? Array.from(colorMap.values()) : [{ name: "기본", code: "#9ca3af" }];

    const saleType = mapSaleType(data.saleType);
    const imageUrl =
        data.thumbnailUrl && data.thumbnailUrl.startsWith('http')
            ? data.thumbnailUrl
            : `https://picsum.photos/seed/reown-product-${data.productId}/600/800`;

    return {
        productId: String(data.productId),
        name: data.name,
        brandName: data.brandName || getBrandName(data.brandId),
        price: data.price,
        saleType,
        categoryName: data.categoryName ?? null,
        ogImageUrl: imageUrl,
        images: [imageUrl],
        availableSizes,
        availableColors,
        options,
        description: data.description || `${data.name} 상품 상세 정보입니다.`,
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

    // 상품 목록 API는 빠른 목록 조회용이라 옵션(size/color)을 포함하지 않을 수 있습니다.
    // 필터에서 사이즈/색상 조건이 정확히 동작하려면 옵션 정보가 필요하므로,
    // 목록을 받은 뒤 상세 API를 추가 조회해서 옵션을 채웁니다.
    // 상세 조회가 실패한 상품은 목록 데이터만으로 표시해 화면 전체가 깨지지 않게 합니다.
    const detailedProducts = await Promise.allSettled(
        data.map(async (item) => {
            const detail = await api<ProductDetailResponse>(`/api/products/${item.productId}`);
            return toProduct(detail);
        })
    );

    return detailedProducts.map((result, index) => {
        if (result.status === "fulfilled") {
            return result.value;
        }

        console.warn("상품 상세 옵션 조회 실패:", data[index]?.productId, result.reason);
        return toProduct(data[index]);
    });
}

export async function getProduct(productId: string): Promise<Product> {
    const data = await api<ProductDetailResponse>(`/api/products/${productId}`);
    return toProduct(data);
}
