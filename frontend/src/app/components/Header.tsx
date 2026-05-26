import { Search, Heart, ShoppingCart, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { SearchDropdown } from './SearchDropdown';
import { UserDropdown } from './UserDropdown';
import { NotificationBell } from './NotificationBell';
import { clearLoginUser, getLoginUser, LoginUser, SESSION_CHANGED_EVENT } from '../auth/session';

export function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    const syncLoginUser = () => setLoginUser(getLoginUser());

    syncLoginUser();
    window.addEventListener(SESSION_CHANGED_EVENT, syncLoginUser);
    window.addEventListener('storage', syncLoginUser);

    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, syncLoginUser);
      window.removeEventListener('storage', syncLoginUser);
    };
  }, []);

  const handleLogout = () => {
    clearLoginUser();
    setLoginUser(null);
    setIsUserDropdownOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors">re:own</h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/category/brand-store" className="text-gray-700 hover:text-gray-900 transition-colors">
                브랜드 스토어
              </Link>
              <Link to="/category/designer-store" className="text-gray-700 hover:text-gray-900 transition-colors">
                디자이너 스토어
              </Link>
              <Link to="/category/funding" className="text-gray-700 hover:text-gray-900 transition-colors">
                펀딩
              </Link>
              <Link to="/resell" className="text-gray-700 hover:text-gray-900 transition-colors">
                리셀
              </Link>
              <Link to="/vault" className="flex items-center gap-1 text-blue-900 hover:text-blue-700 transition-colors font-medium">
                <Shield className="w-4 h-4" />
                The Vault
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link to="/wishlist" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                <UserDropdown
                  isOpen={isUserDropdownOpen}
                  onClose={() => setIsUserDropdownOpen(false)}
                  isLoggedIn={!!loginUser}
                  userName={loginUser?.nickname}
                  userRole={loginUser?.role}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchDropdown isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
