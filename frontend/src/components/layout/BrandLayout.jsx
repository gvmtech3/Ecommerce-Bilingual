// src/components/layout/BrandLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { ChevronLeft, LogOut } from 'lucide-react'

function BrandLayout() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/brand', label: t('brand.overview.title'), icon: '📊' },
    { path: '/brand/quote', label: t('brand.quote.title'), icon: '✉️' },
    { path: '/brand/projects', label: t('brand.projects.title'), icon: '📋' },
    { path: '/brand/profile', label: t('brand.profile.title'), icon: '👤' }
  ]

  const getPageTitle = () => {
    if (location.pathname.includes('quote')) return t('brand.quote.title')
    if (location.pathname.includes('projects')) return t('brand.projects.title')
    if (location.pathname.includes('profile')) return t('brand.profile.title')
    return t('brand.overview.title')
  }

  return (
    <div className="min-h-screen bg-[#F6F3F0]">
      <div className="mx-auto flex max-w-6xl gap-6 p-6 md:p-8 lg:flex">
        {/* Sidebar */}
        <nav className="hidden w-64 flex-col gap-1 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-[#13293D] text-white shadow-md'
                  : 'text-[#181818] hover:bg-[#E9E0D8] hover:text-[#D9A441]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button + content */}
        <div className="flex flex-1 flex-col lg:ml-0">
          {/* Mobile tabs */}
          <nav className="flex gap-1 rounded-xl bg-[#E9E0D8] p-1 lg:hidden">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all md:px-4 ${
                  location.pathname === item.path
                    ? 'bg-[#13293D] text-white shadow-md'
                    : 'text-[#5A5A5A] hover:bg-white hover:text-[#D9A441]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Main content */}
          <main className="mt-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default BrandLayout
