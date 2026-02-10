// src/components/layout/Navigation.jsx - ✅ About moved AFTER Services
import { useState } from "react";
import { ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../contexts/CartContext";

function Navigation() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCustomer = isAuthenticated && user?.role === "customer";
  const isBrand = isAuthenticated && user?.role === "brand";

  const brandMenuItems = [
    { path: "/brand", label: t("brand.overview.title") },
    { path: "/brand/quote", label: t("brand.quote.title") },
    { path: "/brand/projects", label: t("brand.projects.title") },
    { path: "/brand/profile", label: t("brand.profile.title") },
  ];

  const handleLogoClick = () => {
    navigate("/");
    setMobileOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const isActive = (path) => {
    const exactRoutes = [
      '/', 
      '/services', 
      '/about',      // ✅ POSITIONED AFTER SERVICES
      '/contact',    
      '/customer', 
      '/catalog', 
      '/customer/quote', 
      '/brand'
    ];
    
    if (exactRoutes.includes(path)) {
      return location.pathname === path
    }
    
    return location.pathname.startsWith(path)
  }

  const cartCount = getCartCount();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D9A441]/30 bg-[#E9E0D8]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9A441]">
            <span className="font-serif text-sm text-[#13293D]">LC</span>
          </div>
          <span className="font-serif text-xl tracking-[0.25em] text-[#13293D]">
            LINCES'CKF
          </span>
        </button>

        {/* Desktop Navigation - ✅ ABOUT AFTER SERVICES */}
        <nav className="hidden gap-8 md:flex">
          {/* Public Pages */}
          <button
            onClick={() => handleNavClick("/")}
            className={`hover:text-[#D9A441] ${isActive("/") ? "text-[#D9A441] font-semibold" : ""}`}
          >
            {t("nav.home")}
          </button>
          
          <button
            onClick={() => handleNavClick("/services")}
            className={`hover:text-[#D9A441] ${isActive("/services") ? "text-[#D9A441] font-semibold" : ""}`}
          >
            {t("nav.services")}
          </button>
          
          <button
            onClick={() => handleNavClick("/about")}
            className={`hover:text-[#D9A441] ${isActive("/about") ? "text-[#D9A441] font-semibold" : ""}`}
          >
            {t("nav.about")}
          </button>
          
          <button
            onClick={() => handleNavClick("/contact")}
            className={`hover:text-[#D9A441] ${isActive("/contact") ? "text-[#D9A441] font-semibold" : ""}`}
          >
            {t("footer.contactUs") || t("nav.contact") || "Contact"}
          </button>

          {/* Customer Pages */}
          {isCustomer && (
            <>
              <button
                onClick={() => handleNavClick("/customer")}
                className={`hover:text-[#D9A441] ${isActive("/customer") ? "text-[#D9A441] font-semibold" : ""}`}
              >
                {t("dashboard.customer")}
              </button>
              <button
                onClick={() => handleNavClick("/catalog")}
                className={`hover:text-[#D9A441] ${isActive("/catalog") ? "text-[#D9A441] font-semibold" : ""}`}
              >
                {t("nav.collection")}
              </button>
              <button
                onClick={() => handleNavClick("/customer/quote")}
                className={`hover:text-[#D9A441] ${isActive("/customer/quote") ? "text-[#D9A441] font-semibold" : ""}`}
              >
                {t("customer.requestQuote")}
              </button>
            </>
          )}

          {/* Brand Pages */}
          {isBrand && (
            <div className="flex gap-4">
              {brandMenuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-2 hover:text-[#D9A441] transition-all ${
                    isActive(item.path)
                      ? "text-[#D9A441] font-semibold scale-105"
                      : "text-[#181818]"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="uppercase tracking-wide text-sm">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          {!isAuthenticated ? (
            <>
              <Link
                to="/auth?mode=signin"
                className="text-md uppercase tracking-wide text-[#a437b0]"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full border border-[#e2a95e] px-4 py-2 text-md uppercase tracking-wide text-[#13293D]"
              >
                {t("nav.signUp")}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-[#13293D]/50 px-4 py-2 text-sm text-[#13293D] hover:bg-[#13293D]/10"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </button>
          )}

          {/* Cart Badge */}
          {isCustomer && cartCount > 0 && (
            <button
              onClick={() => handleNavClick("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#13293D] hover:bg-[#13293D]/10 transition-all"
            >
              <ShoppingBag className="h-5 w-5 text-[#13293D]" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D9A441] text-xs font-bold text-white shadow-lg border-2 border-white">
                {cartCount}
              </span>
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          {isCustomer && cartCount > 0 && (
            <button
              onClick={() => handleNavClick("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#13293D]"
            >
              <ShoppingBag className="h-5 w-5 text-[#13293D]" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D9A441] text-xs font-bold text-white shadow-lg border-2 border-white">
                {cartCount}
              </span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13293D]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - ✅ ABOUT AFTER SERVICES */}
      {mobileOpen && (
        <div className="border-t border-[#D9A441]/30 bg-[#F6F3F0] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6">
            {/* Public Pages */}
            <button
              onClick={() => handleNavClick("/")}
              className={`py-3 px-4 rounded-xl font-medium ${isActive("/") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
            >
              {t("nav.home")}
            </button>
            
            <button
              onClick={() => handleNavClick("/services")}
              className={`py-3 px-4 rounded-xl font-medium ${isActive("/services") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
            >
              {t("nav.services")}
            </button>
            
            <button
              onClick={() => handleNavClick("/about")}
              className={`py-3 px-4 rounded-xl font-medium ${isActive("/about") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
            >
              {t("nav.about")}
            </button>
            
            <button
              onClick={() => handleNavClick("/contact")}
              className={`py-3 px-4 rounded-xl font-medium ${isActive("/contact") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
            >
              {t("footer.contactUs") || "Contact"}
            </button>

            {/* Customer Pages */}
            {isCustomer && (
              <>
                <button
                  onClick={() => handleNavClick("/customer")}
                  className={`py-3 px-4 rounded-xl font-medium ${isActive("/customer") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
                >
                  {t("dashboard.customer")}
                </button>
                <button
                  onClick={() => handleNavClick("/catalog")}
                  className={`py-3 px-4 rounded-xl font-medium ${isActive("/catalog") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
                >
                  {t("nav.collection")}
                </button>
                <button
                  onClick={() => handleNavClick("/customer/quote")}
                  className={`py-3 px-4 rounded-xl font-medium ${isActive("/customer/quote") ? "bg-[#13293D] text-white" : "hover:bg-[#E9E0D8]"}`}
                >
                  {t("customer.requestQuote")}
                </button>
              </>
            )}

            {/* Auth Actions */}
            <div className="border-t border-[#D9A441]/20 pt-4 mt-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavClick("/auth?mode=signin")}
                    className="block w-full py-3 px-4 text-left text-[#13293D] hover:bg-[#E9E0D8] rounded-xl font-medium"
                  >
                    {t("nav.signIn")}
                  </button>
                  <button
                    onClick={() => handleNavClick("/auth?mode=signup")}
                    className="block w-full py-3 px-4 text-left bg-[#13293D] text-white rounded-xl font-medium mt-2"
                  >
                    {t("nav.signUp")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 py-3 px-4 text-left text-[#13293D] hover:bg-[#E9E0D8] rounded-xl font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  {t("nav.logout")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
