import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    category: true,
    size: true,
    color: true,
    price: true,
  });

  const filterGroups: Record<string, FilterGroup> = {
    category: {
      title: '카테고리',
      options: [
        { label: '아우터', value: 'outer' },
        { label: '상의', value: 'top' },
        { label: '하의', value: 'bottom' },
        { label: '원피스', value: 'dress' },
        { label: '가방', value: 'bag' },
        { label: '신발', value: 'shoes' },
      ],
    },
    size: {
      title: '사이즈',
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
        { label: 'Free', value: 'free' },
      ],
    },
    color: {
      title: '색상',
      options: [
        { label: '블랙', value: 'black' },
        { label: '화이트', value: 'white' },
        { label: '그레이', value: 'gray' },
        { label: '네이비', value: 'navy' },
        { label: '베이지', value: 'beige' },
        { label: '브라운', value: 'brown' },
      ],
    },
    price: {
      title: '가격대',
      options: [
        { label: '5만원 이하', value: '0-50000' },
        { label: '5만원 ~ 10만원', value: '50000-100000' },
        { label: '10만원 ~ 30만원', value: '100000-300000' },
        { label: '30만원 ~ 50만원', value: '300000-500000' },
        { label: '50만원 이상', value: '500000-' },
      ],
    },
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleFilter = (groupKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[groupKey] || [];
      const newFilters = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const updated = {
        ...prev,
        [groupKey]: newFilters,
      };

      onFilterChange?.(updated);
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange?.({});
  };

  const totalSelectedCount = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">필터</h3>
          {totalSelectedCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              초기화
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(filterGroups).map(([groupKey, group]) => (
          <div key={groupKey} className="border-b border-gray-200 pb-4 last:border-0">
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="font-semibold text-sm text-gray-900">{group.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedGroups[groupKey] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedGroups[groupKey] && (
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected = selectedFilters[groupKey]?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFilter(groupKey, option.value)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}