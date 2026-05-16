import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, Package, ShoppingBag, Sparkles, DollarSign, Store, Bell, User, LogOut, TrendingUp, Gavel, Truck } from "lucide-react";
import { clearLoginUser } from "../../auth/session";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/seller", label: "홈", icon: Home, end: true },
  { to: "/", label: "쇼핑몰 메인", icon: Store, end: true },
  { to: "/seller/products", label: "상품 관리", icon: Package },
  { to: "/seller/orders", label: "주문/출고 관리", icon: ShoppingBag },
  { to: "/seller/funding", label: "펀딩 관리", icon: TrendingUp },
  { to: "/seller/resell", label: "리셀 관리", icon: Gavel },
  { to: "/seller/resell-sales", label: "리셀 거래/배송", icon: Truck },
  { to: "/seller/limited-editions", label: "디자이너 한정판", icon: Sparkles },
  { to: "/seller/settlement", label: "정산 내역", icon: DollarSign },
  { to: "/seller/profile", label: "브랜드 프로필", icon: Store },
];

export function Layout() {
  const navigate = useNavigate();
  const { brandName, loginUser, roleType } = useAuth();

  const handleLogout = () => {
    if (!confirm("로그아웃하시겠습니까?")) return;

    clearLoginUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">re:own</h1>
          <p className="text-sm text-gray-500 mt-1">Seller Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="text-xs text-gray-500">
            고객센터: 1588-0000<br />
            평일 09:00-18:00
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">{brandName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 p-2 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-right leading-tight">
                <div className="text-sm text-gray-700">{loginUser?.nickname ?? '판매자'}</div>
                <div className="text-xs text-gray-400">{roleType}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
