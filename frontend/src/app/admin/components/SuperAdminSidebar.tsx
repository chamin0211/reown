import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Package, 
  TrendingUp, 
  CheckSquare, 
  DollarSign, 
  Flag,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { clearLoginUser, getLoginUser } from '../../auth/session';

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string;
  submenus?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { 
    icon: <LayoutDashboard size={20} />, 
    label: 'Dashboard', 
    path: '/admin' 
  },
  {
    icon: <Package size={20} />,
    label: '쇼핑몰 메인',
    path: '/',
  },
  { 
    icon: <Users size={20} />, 
    label: '브랜드/셀러 관리', 
    path: '/admin/seller',
    submenus: [
      { label: '입점 심사', path: '/admin/seller/onboarding' },
      { label: '전체 셀러 목록', path: '/admin/seller/list' },
      { label: '계약/수수료 설정', path: '/admin/seller/contract' },
    ]
  },
  { 
    icon: <UserCog size={20} />, 
    label: '회원 관리', 
    path: '/admin/users',
    submenus: [
      { label: '전체 유저', path: '/admin/users/all' },
      { label: '신고/제재 목록', path: '/admin/users/reports' },
    ]
  },
  { 
    icon: <Package size={20} />, 
    label: '상품 관리', 
    path: '/admin/products',
    submenus: [
      { label: '전체 상품', path: '/admin/products' },
      { label: '승인 대기열', path: '/admin/review-queue' },
      { label: '카테고리 설정', path: '/admin/products/categories' },
    ]
  },
  { 
    icon: <TrendingUp size={20} />, 
    label: '펀딩 관리', 
    path: '/admin/funding' 
  },
  { 
    icon: <CheckSquare size={20} />, 
    label: '리셀 검수', 
    path: '/admin/resell' 
  },
  { 
    icon: <DollarSign size={20} />, 
    label: '플랫폼 정산', 
    path: '/admin/settlement',
    submenus: [
      { label: '수수료 수익 현황', path: '/admin/settlement' },
      { label: '셀러 지급 목록', path: '/admin/settlement/payout' },
      { label: '매출 & 분석 대시보드', path: '/admin/settlement/analytics' },
    ]
  },
  { 
    icon: <Flag size={20} />, 
    label: '콘텐츠 모더레이션', 
    path: '/admin/moderation',
    submenus: [
      { label: '부적절 리뷰/게시글', path: '/admin/moderation/content' },
      { label: '가품 판정 리포트', path: '/admin/moderation/fake-reports' },
    ]
  },
  { 
    icon: <Settings size={20} />, 
    label: '시스템 설정', 
    path: '/admin/settings',
    submenus: [
      { label: '배너/팝업 관리', path: '/admin/settings/banners' },
      { label: '공지사항', path: '/admin/settings/notices' },
      { label: '어드민 권한 관리', path: '/admin/settings/admins' },
    ]
  },
];

export function SuperAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  
  // Ref to track sidebar scroll position
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Load initial state from localStorage
  const getInitialExpandedMenus = (): Set<string> => {
    try {
      const saved = localStorage.getItem('sidebar-expanded-menus');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load expanded menus:', e);
    }
    return new Set(['/admin/seller', '/admin/users', '/admin/products', '/admin/settlement']);
  };
  
  const getInitialScrollPosition = (): number => {
    try {
      const saved = localStorage.getItem('sidebar-scroll-position');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      console.error('Failed to load scroll position:', e);
    }
    return 0;
  };
  
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(getInitialExpandedMenus);
  const [notificationCount] = useState(0);

  const handleLogout = () => {
    if (!confirm('로그아웃하시겠습니까?')) return;

    clearLoginUser();
    navigate('/login', { replace: true });
  };
  
  // Load initial scroll position
  useLayoutEffect(() => {
    if (sidebarRef.current) {
      const savedPosition = getInitialScrollPosition();
      sidebarRef.current.scrollTop = savedPosition;
    }
  }, []);
  
  // Save scroll position to localStorage on every scroll
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    
    const handleScroll = () => {
      try {
        localStorage.setItem('sidebar-scroll-position', sidebar.scrollTop.toString());
      } catch (e) {
        console.error('Failed to save scroll position:', e);
      }
    };
    
    sidebar.addEventListener('scroll', handleScroll, { passive: true });
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Save expanded menus to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-expanded-menus', JSON.stringify(Array.from(expandedMenus)));
    } catch (e) {
      console.error('Failed to save expanded menus:', e);
    }
  }, [expandedMenus]);
  
  // Auto-expand menu if current path matches any submenu
  useEffect(() => {
    const newExpanded = new Set(expandedMenus);
    let hasChange = false;
    
    menuItems.forEach(item => {
      if (item.submenus) {
        const hasActiveSubmenu = item.submenus.some(sub => location.pathname === sub.path);
        if (hasActiveSubmenu && !newExpanded.has(item.path)) {
          newExpanded.add(item.path);
          hasChange = true;
        }
      }
    });
    
    if (hasChange) {
      setExpandedMenus(newExpanded);
    }
  }, [location.pathname, expandedMenus]);
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  
  const isSubmenuActive = (parentPath: string, submenus?: SubMenuItem[]) => {
    if (!submenus) return false;
    return submenus.some(sub => location.pathname === sub.path);
  };

  // Multi-select accordion: Toggle individual menu without affecting others
  const toggleMenu = (path: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedMenus(newExpanded);
  };

  return (
    <aside 
      ref={sidebarRef}
      className="w-64 bg-white border-r border-gray-100 fixed left-0 top-0 bottom-0 overflow-y-auto"
      style={{ 
        height: '100vh',
        position: 'fixed',
        zIndex: 40,
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}
    >
      {/* Header - Sticky at top of sidebar */}
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <Link to="/admin" className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">re:own</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-gray-500">Super Admin</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                MASTER
              </span>
            </div>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </Link>
      </div>
      
      {/* Navigation - Scrollable Content Area */}
      <nav className="px-3 py-4 pb-28">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.submenus ? (
              <div className="transition-all duration-200 ease-in-out">
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                    isSubmenuActive(item.path, item.submenus)
                      ? 'bg-blue-50 text-[#1e40af] font-bold border-l-4 border-[#1e40af] shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 font-medium hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="transition-transform duration-200">
                      {item.icon}
                    </div>
                    <span className="text-[15px] transition-all duration-200">{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all duration-200 ${
                        isSubmenuActive(item.path, item.submenus)
                          ? 'bg-[#1e40af] text-white' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className={`transition-transform duration-300 ease-in-out ${
                    expandedMenus.has(item.path) ? 'rotate-0' : '-rotate-90'
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMenus.has(item.path) 
                      ? 'max-h-[500px] opacity-100 mt-1' 
                      : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <div className="ml-4 space-y-1 border-l-2 border-gray-200">
                    {item.submenus.map((submenu, subIndex) => (
                      <Link
                        key={subIndex}
                        to={submenu.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ml-2 ${
                          location.pathname === submenu.path
                            ? 'bg-[#1e40af] text-white font-bold shadow-md transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                        }`}
                      >
                        {submenu.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-[#1e40af] text-white shadow-md font-bold transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gray-50 font-medium hover:shadow-sm hover:translate-x-0.5'
                }`}
              >
                <div className="transition-transform duration-200">
                  {item.icon}
                </div>
                <span className="text-[15px] transition-all duration-200">{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-white text-blue-600' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - Admin Profile (Sticky at bottom) */}
      <div className="fixed bottom-0 left-0 w-64 p-4 border-t border-gray-100 bg-white shadow-xl z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{loginUser?.nickname ?? 'Super Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{loginUser?.email ?? 'admin@reown.com'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}