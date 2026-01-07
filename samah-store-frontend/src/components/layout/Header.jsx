/**
 * SAMAH STORE - Header Component
 * Fashion retail navigation (Zara/Mango style)
 */

import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Logo from '../Logo';

// Navigation - single product store (scalable)
const NAV_LINKS = [
  { name: 'جديد', href: '/products?sort=createdAt,desc', highlight: true },
  { name: 'المنتجات', href: '/products' },
  { name: 'عنّا', href: '/about' },
  { name: 'المساعدة', href: '/contact' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory-100">
        {/* Announcement Bar */}
        <div className="bg-rose-300 text-charcoal-800 text-center py-2.5 px-4">
          <p className="text-xs font-medium tracking-wide">
            شحن مجاني للطلبات فوق 50 دينار — Free Shipping Over 50 JOD
          </p>
        </div>

        {/* Main Header */}
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-charcoal-700 hover:text-berry-500 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Logo - Center on mobile, left on desktop */}
            <Link 
              to="/" 
              className="flex-shrink-0 hover:opacity-80 transition-opacity text-charcoal-800"
            >
              <span className="hidden sm:block">
                <Logo variant="header" />
              </span>
              <span className="sm:hidden">
                <Logo variant="icon" />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[13px] tracking-wide transition-colors duration-200
                    ${link.highlight 
                      ? 'text-berry-500 font-medium' 
                      : 'text-charcoal-700 hover:text-berry-500'
                    }
                    ${location.pathname === link.href ? 'text-berry-500' : ''}
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-charcoal-600 hover:text-berry-500 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center gap-3 mr-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-1.5 text-[13px] text-berry-600 hover:text-berry-700 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>لوحة الإدارة</span>
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="text-[13px] text-charcoal-700 hover:text-berry-500 transition-colors"
                    >
                      طلباتي
                    </Link>
                    <button
                      onClick={logout}
                      className="text-[13px] text-charcoal-500 hover:text-berry-500 transition-colors"
                    >
                      خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[13px] text-charcoal-700 hover:text-berry-500 transition-colors"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      to="/register"
                      className="text-[13px] px-4 py-2 bg-berry-500 text-white rounded-lg hover:bg-berry-600 transition-colors font-medium"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                )}
              </div>

              {/* Account (Mobile only) */}
              <Link
                to={isAuthenticated ? '/orders' : '/login'}
                className="lg:hidden p-2.5 text-charcoal-600 hover:text-berry-500 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 text-charcoal-600 hover:text-berry-500 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-berry-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-charcoal-200 bg-white animate-fade-in">
            <div className="container-main py-4">
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="ابحثي عن منتج..."
                  className="input-field text-center"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-charcoal-900/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-ivory-100 animate-slide-in shadow-elevated">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-5 border-b border-charcoal-200">
              <Logo variant="header" className="text-charcoal-800" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-charcoal-600 hover:text-berry-500"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-5 overflow-y-auto h-[calc(100vh-80px)]">
              {/* Navigation */}
              <nav className="space-y-1 mb-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-base rounded-lg transition-colors
                      ${link.highlight ? 'text-berry-500 font-medium' : 'text-charcoal-700'}
                      hover:bg-rose-100
                    `}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="h-px bg-charcoal-200 mb-6" />

              {/* Account Section */}
              <div className="space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 text-base text-charcoal-700 rounded-lg hover:bg-rose-100"
                    >
                      طلباتي
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="block w-full text-right py-3 px-4 text-base text-berry-500 rounded-lg hover:bg-rose-100"
                    >
                      تسجيل خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 text-base text-charcoal-700 rounded-lg hover:bg-rose-100"
                    >
                      تسجيل دخول
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 text-base text-berry-500 font-medium rounded-lg hover:bg-rose-100"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                )}
              </div>

              {/* Contact */}
              <div className="mt-8 p-4 bg-rose-100 rounded-xl">
                <p className="text-xs text-charcoal-500 mb-1">تواصلي معنا</p>
                <p className="text-sm font-medium text-charcoal-700">+962 79 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
