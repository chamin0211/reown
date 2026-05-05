import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface ProductSectionProps {
  title: string;
  id?: string;
  linkHref?: string;
  linkText?: string;
  onLinkClick?: () => void;
  children: ReactNode;
}

export function ProductSection({
                                 title,
                                 id,
                                 linkHref,
                                 linkText = '전체보기',
                                 onLinkClick,
                                 children,
                               }: ProductSectionProps) {
  return (
      <section id={id} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

            {linkHref ? (
                <Link
                    to={linkHref}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {linkText}
                  <ChevronRight className="w-5 h-5" />
                </Link>
            ) : (
                <button
                    onClick={onLinkClick}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {linkText}
                  <ChevronRight className="w-5 h-5" />
                </button>
            )}
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </section>
  );
}