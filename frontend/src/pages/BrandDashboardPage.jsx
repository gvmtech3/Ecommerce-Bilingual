// src/pages/BrandDashboardPage.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import dashboardApi from '../api/dashboardApi'

function BrandDashboardPage() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    dashboardApi
      .getBrandOverview(user.id)
      .then((res) => setInquiries(res.data || []))
      .finally(() => setLoading(false))
  }, [user?.id])

  const pendingCount = inquiries.filter(
    (inq) => inq.status === 'pending' || inq.status === 'in_review'
  ).length

  return (
    <div className="bg-[#F6F3F0]">
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-serif text-3xl text-[#13293D]">
          {user?.name ? `Welcome, ${user.name}.` : 'Welcome.'}
        </h1>
        <p className="mt-3 text-sm text-[#5A5A5A]">
          This is your brand dashboard. Track your service inquiries and upcoming projects.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#D9A441]/40 bg-[#F6F3F0] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B86B77]">
              Inquiries
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#13293D]">
              {loading ? '—' : inquiries.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#D9A441]/40 bg-[#F6F3F0] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B86B77]">
              In review
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#13293D]">
              {loading ? '—' : pendingCount}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BrandDashboardPage
