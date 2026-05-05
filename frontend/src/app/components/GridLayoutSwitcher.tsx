import { Grid3x3, LayoutGrid, Grid2x2 } from 'lucide-react';

interface GridLayoutSwitcherProps {
  currentColumns: 3 | 4 | 6;
  onColumnsChange: (columns: 3 | 4 | 6) => void;
}

export function GridLayoutSwitcher({ currentColumns, onColumnsChange }: GridLayoutSwitcherProps) {
  const layouts = [
    { columns: 3 as const, icon: Grid3x3, label: '3열' },
    { columns: 4 as const, icon: LayoutGrid, label: '4열' },
    { columns: 6 as const, icon: Grid2x2, label: '6열' },
  ];

  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
      {layouts.map(({ columns, icon: Icon, label }) => (
        <button
          key={columns}
          onClick={() => onColumnsChange(columns)}
          className={`px-3 py-1.5 rounded-md transition-all ${
            currentColumns === columns
              ? 'bg-blue-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
