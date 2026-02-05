// src/pages/CustomerDashboardPage.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import dashboardApi from '../api/dashboardApi'

function CustomerDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    dashboardApi
      .getCustomerOverview(user.id)
      .then((res) => setOrders(res.data || []))
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="bg-[#F6F3F0]">
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-serif text-3xl text-[#13293D]">
          {user?.name ? `Welcome back, ${user.name}.` : 'Welcome back.'}
        </h1>
        <p className="mt-3 text-sm text-[#5A5A5A]">
          Here you can review your recent orders and access your silk collection.
        </p>

        {/* Simple overview */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#D9A441]/40 bg-[#F6F3F0] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B86B77]">
              Orders
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#13293D]">
              {loading ? '—' : orders.length}
            </p>
          </div>

          {/* You can add more cards later, e.g. total spent, etc. */}
        </div>
      </section>
    </div>
  )
}

export default CustomerDashboardPage
