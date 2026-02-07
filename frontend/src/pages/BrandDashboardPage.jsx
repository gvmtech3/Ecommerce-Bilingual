// src/pages/BrandDashboardPage.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import dashboardApi from '../api/dashboardApi'

function BrandDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    if (!user?.id) return
    dashboardApi
      .getBrandOverview(user.id)
      .then((res) => {
        const inquiries = res.data || []
        setStats({
          total: inquiries.length,
          pending: inquiries.filter(i => i.status === 'pending' || i.status === 'in_review').length,
          completed: inquiries.filter(i => i.status === 'completed').length
        })
        setRecent(inquiries.slice(0, 3))
      })
      .catch(console.error)
  }, [user?.id])

  return (
    <div className="mx-auto flex flex-col max-w-6xl gap-6 p-6 md:p-8 lg:flex">
      <h1 className="font-serif text-3xl text-[#13293D]">
        {t('brand.overview.title')}
      </h1>
      <p className="mt-3 text-sm text-[#5A5A5A]">
        {t('brand.overview.subtitle')}
      </p>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#D9A441]/40 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#B86B77]">
            {t('brand.overview.stats.total')}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#13293D]">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-[#D9A441]/40 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#B86B77]">
            {t('brand.overview.stats.pending')}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#13293D]">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-2xl border border-[#D9A441]/40 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#B86B77]">
            {t('brand.overview.stats.completed')}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#13293D]">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="mt-12">
        <h2 className="mb-6 font-serif text-xl text-[#13293D]">
          {t('brand.overview.recent')}
        </h2>
        <div className="space-y-4">
          {recent.length ? (
            recent.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between rounded-xl border border-[#D9A441]/20 bg-white p-6 hover:shadow-md"
              >
                <div>
                  <h3 className="font-medium text-[#13293D]">
                    {inquiry.description?.slice(0, 50)}...
                  </h3>
                  <p className="mt-1 text-sm text-[#5A5A5A]">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-[#E9E0D8]/50 px-3 py-1 text-xs font-semibold uppercase text-[#B86B77]">
                  {inquiry.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-[#5A5A5A] py-12">
              No recent inquiries.{' '}
              <a href="/brand/quote" className="text-[#13293D] underline">
                Create one now
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrandDashboardPage
