import { LayoutDashboard, Package, Truck, TrendingUp, CheckSquare, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
  { icon: <Package size={20} />, label: '상품 관리', path: '/products' },
  { icon: <Truck size={20} />, label: '주문/배송', path: '/orders' },
  { icon: <TrendingUp size={20} />, label: '펀딩 관리', path: '/funding' },
  { icon: <CheckSquare size={20} />, label: '리셀 검수', path: '/review' },
  { icon: <DollarSign size={20} />, label: '정산', path: '/settlement' },
];

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-900">re:own</h1>
        </Link>
      </div>
      
      <nav className="px-3 mt-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
              isActive(item.path)
                ? 'bg-[#1e40af] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="font-medium text-[15px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}