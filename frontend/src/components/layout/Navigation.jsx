// src/components/layout/Navigation.jsx
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
  const isBrand    = isAuthenticated && user?.role === "brand";

  // ── Shown only when NOT logged in ───────────────────────────────────────
  const publicLinks = [
    { path: "/",         label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/about",    label: t("nav.about") },
    { path: "/contact",  label: t("footer.contactUs") || "Contact" },
  ];

  // ── Shown only when logged in as customer ────────────────────────────────
  const customerLinks = [
    { path: "/customer",       label: t("dashboard.customer") },
    { path: "/catalog",        label: t("nav.collection") },
    { path: "/customer/quote", label: t("customer.requestQuote") },
    { path: "/settings", label: t("settings.navLabel", "Settings") }
  ];

  // ── Shown only when logged in as brand ──────────────────────────────────
  const brandLinks = [
    { path: "/brand",          label: t("brand.overview.title") },
    { path: "/brand/quote",    label: t("brand.quote.title") },
    { path: "/brand/projects", label: t("brand.projects.title") },
    { path: "/settings", label: t("settings.navLabel", "Settings") }
  ];

  // Pick which link set to render — mutually exclusive
  const activeLinks = isCustomer ? customerLinks : isBrand ? brandLinks : publicLinks;

  const exactRoutes = ["/", "/services", "/about", "/contact", "/customer", "/catalog", "/customer/quote", "/brand"];
  const isActive = (path) =>
    exactRoutes.includes(path)
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const handleNavClick = (path) => { navigate(path); setMobileOpen(false); };
  const handleLogoClick = () => { navigate("/"); setMobileOpen(false); };
  const handleLogout = () => { logout(); setMobileOpen(false); };

  const cartCount = getCartCount();

  const NavBtn = ({ path, label }) => (
    <button
      onClick={() => handleNavClick(path)}
      className={`text-sm transition-colors hover:text-[#D9A441] ${
        isActive(path) ? "font-semibold text-[#D9A441]" : "text-[#13293D]"
      }`}
    >
      {label}
    </button>
  );

  const MobileNavBtn = ({ path, label }) => (
    <button
      onClick={() => handleNavClick(path)}
      className={`w-full rounded-xl px-4 py-3 text-left font-medium transition-colors ${
        isActive(path) ? "bg-[#13293D] text-white" : "text-[#13293D] hover:bg-[#E9E0D8]"
      }`}
    >
      {label}
    </button>
  );

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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {activeLinks.map((link) => (
            <NavBtn key={link.path} {...link} />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to="/auth?mode=signin"
                className="text-sm uppercase tracking-wide text-[#13293D] hover:text-[#D9A441] transition-colors"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full border border-[#D9A441] px-4 py-2 text-sm uppercase tracking-wide text-[#13293D] transition-all hover:bg-[#D9A441]/10"
              >
                {t("nav.signUp")}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-[#13293D]/50 px-4 py-2 text-sm text-[#13293D] hover:bg-[#13293D]/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </button>
          )}

          {isCustomer && cartCount > 0 && (
            <button
              onClick={() => handleNavClick("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#13293D] hover:bg-[#13293D]/10 transition-all"
            >
              <ShoppingBag className="h-5 w-5 text-[#13293D]" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#D9A441] text-[10px] font-bold text-white shadow">
                {cartCount}
              </span>
            </button>
          )}
        </div>

        {/* Mobile: language + cart + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          {isCustomer && cartCount > 0 && (
            <button
              onClick={() => handleNavClick("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#13293D]"
            >
              <ShoppingBag className="h-5 w-5 text-[#13293D]" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#D9A441] text-[10px] font-bold text-white shadow">
                {cartCount}
              </span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13293D]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#D9A441]/30 bg-[#F6F3F0] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5">
            {activeLinks.map((link) => (
              <MobileNavBtn key={link.path} {...link} />
            ))}

            <div className="mt-2 border-t border-[#D9A441]/20 pt-4">
              {!isAuthenticated ? (
                <>
                  <MobileNavBtn path="/auth?mode=signin" label={t("nav.signIn")} />
                  <button
                    onClick={() => handleNavClick("/auth?mode=signup")}
                    className="mt-2 w-full rounded-xl bg-[#13293D] px-4 py-3 text-left font-medium text-white"
                  >
                    {t("nav.signUp")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-[#13293D] hover:bg-[#E9E0D8]"
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