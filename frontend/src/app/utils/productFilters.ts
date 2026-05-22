import type { Product } from '../data/products';

export type StoreFilters = Record<string, string[]>;

type ProductLike = Product & {
  price?: number | string | null;
};

function normalizeText(value?: string | null) {
  return (value ?? '').toLowerCase().replace(/\s+/g, '');
}

export function inferProductCategory(product: Product | { name?: string; categoryName?: string | null; productName?: string }) {
  const categoryName = normalizeText('categoryName' in product ? product.categoryName : null);
  const name = normalizeText('name' in product ? product.name : product.productName);
  const combined = `${categoryName} ${name}`;

  if (/아우터|outer|재킷|자켓|자캣|코트|점퍼|블루종|패딩/.test(combined)) return 'outer';
  if (/상의|top|티셔츠|셔츠|후드|후드티|니트|베스트|맨투맨|스웨트/.test(combined)) return 'top';
  if (/하의|bottom|팬츠|바지|슬랙스|데님|스커트|쇼츠/.test(combined)) return 'bottom';
  if (/원피스|dress|드레스/.test(combined)) return 'dress';
  if (/가방|bag|백|백팩|토트|숄더백/.test(combined)) return 'bag';
  if (/신발|shoes|슈즈|스니커즈|부츠|로퍼/.test(combined)) return 'shoes';

  return 'etc';
}

export function normalizeSize(value?: string | null) {
  const normalized = normalizeText(value);
  if (!normalized) return 'free';
  if (normalized === 'f' || normalized === 'free' || normalized === 'onesize' || normalized === 'one-size') return 'free';
  return normalized;
}

export function normalizeColor(value?: string | null) {
  const normalized = normalizeText(value);
  if (/black|블랙|검정|검은/.test(normalized)) return 'black';
  if (/white|화이트|흰|하양/.test(normalized)) return 'white';
  if (/gray|grey|그레이|회색|차콜|charcoal/.test(normalized)) return 'gray';
  if (/navy|네이비|남색/.test(normalized)) return 'navy';
  if (/beige|베이지|아이보리|크림|cream/.test(normalized)) return 'beige';
  if (/brown|브라운|갈색|카멜|camel/.test(normalized)) return 'brown';
  if (/blue|블루|파랑|청/.test(normalized)) return 'navy';
  return normalized || '기본';
}

export function parseProductPrice(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const numericText = value.replace(/[^0-9.-]/g, '');
    const numericValue = Number(numericText);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  return 0;
}

export function parsePriceRange(range: string) {
  const normalized = range.trim().toLowerCase();

  if (!normalized) {
    return { min: 0, max: Number.POSITIVE_INFINITY };
  }

  // 혹시 이전 코드나 URL 파라미터에서 다른 형식으로 넘어와도 동작하도록 같이 지원합니다.
  if (normalized.startsWith('under-')) {
    return { min: 0, max: parseProductPrice(normalized.replace('under-', '')) };
  }

  if (normalized.startsWith('over-')) {
    return { min: parseProductPrice(normalized.replace('over-', '')), max: Number.POSITIVE_INFINITY };
  }

  const [minText, maxText] = normalized.split('-');
  const min = minText ? parseProductPrice(minText) : 0;
  const max = maxText ? parseProductPrice(maxText) : Number.POSITIVE_INFINITY;

  return { min, max };
}

function matchesPriceRange(productPrice: number, range: string) {
  const { min, max } = parsePriceRange(range);

  if (!Number.isFinite(max)) {
    return productPrice >= min;
  }

  if (min === 0) {
    return productPrice >= min && productPrice <= max;
  }

  // 5만원~10만원처럼 경계값이 겹치는 구간은 하한 포함, 상한 포함으로 처리합니다.
  return productPrice >= min && productPrice <= max;
}

export function applyProductFilters(products: Product[], filters: StoreFilters) {
  return products.filter((product) => {
    const selectedCategories = filters.category ?? [];
    if (selectedCategories.length > 0 && !selectedCategories.includes(inferProductCategory(product))) {
      return false;
    }

    const selectedSizes = filters.size ?? [];
    if (selectedSizes.length > 0) {
      const productSizes = new Set(product.availableSizes.map(normalizeSize));
      if (!selectedSizes.some((size) => productSizes.has(normalizeSize(size)))) return false;
    }

    const selectedColors = filters.color ?? [];
    if (selectedColors.length > 0) {
      const productColors = new Set(product.availableColors.map((color) => normalizeColor(color.name)));
      if (!selectedColors.some((color) => productColors.has(normalizeColor(color)))) return false;
    }

    const selectedPrices = filters.price ?? [];
    if (selectedPrices.length > 0) {
      const productPrice = parseProductPrice((product as ProductLike).price);
      const matchedPrice = selectedPrices.some((range) => matchesPriceRange(productPrice, range));
      if (!matchedPrice) return false;
    }

    return true;
  });
}

export function hasActiveFilters(filters: StoreFilters) {
  return Object.values(filters).some((values) => values.length > 0);
}
