// src/components/layout/Navigation.jsx
import { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Navigation() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isCustomer = isAuthenticated && user?.role === 'customer'

  const handleLogoClick = () => {
    navigate('/')
    setMobileOpen(false)
  }

  const handleNavClick = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D9A441]/30 bg-[#E9E0D8]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Left: Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9A441]">
            <span className="font-serif text-sm text-[#13293D]">LC</span>
          </div>
          <span className="font-serif text-xl tracking-[0.25em] text-[#13293D]">
            LINCES’CKF
          </span>
        </button>

        {/* Center: Desktop Links */}
        <nav className="hidden gap-8 text-md uppercase text-[#181818] md:flex">
          <button
            onClick={() => handleNavClick('/')}
            className={`hover:text-[#D9A441] ${
              isActive('/') ? 'text-[#D9A441]' : ''
            }`}
          >
            {t('nav.home')}
          </button>

          {isCustomer && (
            <button
              onClick={() => handleNavClick('/catalog')}
              className={`hover:text-[#D9A441] ${
                isActive('/catalog') ? 'text-[#D9A441]' : ''
              }`}
            >
              {t('nav.collection')}
            </button>
          )}

          <button
            onClick={() => handleNavClick('/services')}
            className={`hover:text-[#D9A441] ${
              isActive('/services') ? 'text-[#D9A441]' : ''
            }`}
          >
            {t('nav.services')}
          </button>
          <button
            onClick={() => handleNavClick('/about')}
            className={`hover:text-[#D9A441] ${
              isActive('/about') ? 'text-[#D9A441]' : ''
            }`}
          >
            {t('nav.about')}
          </button>
        </nav>

        {/* Right: Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to="/auth?mode=signin"
                className="text-md uppercase tracking-wide text-[#a437b0]"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full border border-[#e2a95e] px-4 py-2 text-md uppercase tracking-wide text-[#13293D]"
              >
                {t('nav.signUp')}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-md uppercase tracking-wide text-[#13293D]"
            >
              Logout
            </button>
          )}

          {isCustomer && (
            <button
              onClick={() => handleNavClick('/cart')}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#13293D]"
            >
              <ShoppingBag className="h-4 w-4 text-[#13293D]" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#13293D] text-[10px] text-white">
                0
              </span>
            </button>
          )}
        </div>

        {/* Mobile: right side (language + hamburger + optional cart) */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />

          {isCustomer && (
            <button
              onClick={() => {
                handleNavClick('/cart')
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#13293D]"
            >
              <ShoppingBag className="h-4 w-4 text-[#13293D]" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#13293D] text-[10px] text-white">
                0
              </span>
            </button>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#13293D]"
          >
            {mobileOpen ? (
              <X className="h-4 w-4 text-[#13293D]" />
            ) : (
              <Menu className="h-4 w-4 text-[#13293D]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="border-t border-[#D9A441]/30 bg-[#F6F3F0] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-md uppercase text-[#181818]">
            <button
              onClick={() => handleNavClick('/')}
              className={`py-2 text-left hover:text-[#D9A441] ${
                isActive('/') ? 'text-[#D9A441]' : ''
              }`}
            >
              {t('nav.home')}
            </button>

            {isCustomer && (
              <button
                onClick={() => handleNavClick('/catalog')}
                className={`py-2 text-left hover:text-[#D9A441] ${
                  isActive('/catalog') ? 'text-[#D9A441]' : ''
                }`}
              >
                {t('nav.collection')}
              </button>
            )}

            <button
              onClick={() => handleNavClick('/services')}
              className={`py-2 text-left hover:text-[#D9A441] ${
                isActive('/services') ? 'text-[#D9A441]' : ''
              }`}
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`py-2 text-left hover:text-[#D9A441] ${
                isActive('/about') ? 'text-[#D9A441]' : ''
              }`}
            >
              {t('nav.about')}
            </button>

            <div className="mt-2 border-t border-[#D9A441]/20 pt-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavClick('/auth?mode=signin')}
                    className="block w-full py-2 text-left text-[#13293D]"
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => handleNavClick('/auth?mode=signup')}
                    className="mt-1 block w-full rounded-full border border-[#13293D] px-4 py-2 text-left text-[#13293D]"
                  >
                    {t('nav.signUp')}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full py-2 text-left text-[#13293D]"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navigation
