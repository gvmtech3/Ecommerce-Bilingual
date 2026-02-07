// src/pages/BrandQuotePage.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import dashboardApi from '../api/dashboardApi'

function BrandQuotePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    quantity: '',
    description: '',
    deadline: '',
    fabrics: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      await dashboardApi.createServiceInquiry({
        userId: user.id,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      setSuccess(true)
      setFormData({ quantity: '', description: '', deadline: '', fabrics: '' })
    } catch (error) {
      console.error('Failed to create inquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="mb-4 rounded-full bg-green-100 p-4">
          <span className="text-2xl">✅</span>
        </div>
        <h1 className="font-serif text-2xl text-[#13293D]">
          Quote Request Submitted!
        </h1>
        <p className="mt-3 text-sm text-[#5A5A5A] max-w-md">
          We'll review your inquiry and get back to you within 48 hours.
        </p>
        <a
          href="/brand"
          className="mt-6 rounded-full border border-[#13293D] px-8 py-3 text-sm font-semibold uppercase text-[#13293D] hover:bg-[#13293D] hover:text-white"
        >
          View Dashboard
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col max-w-6xl gap-6 p-6 md:p-8 lg:flex">
      <h1 className="font-serif text-3xl text-[#13293D]">
        {t('brand.quote.title')}
      </h1>
      <p className="mt-3 text-sm text-[#5A5A5A]">
        {t('brand.quote.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
            {t('brand.quote.form.quantity')}
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full rounded-xl border border-[#13293D]/30 bg-white px-4 py-3 text-lg shadow-sm focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20"
            placeholder="e.g. 50 pieces"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
            {t('brand.quote.form.description')}
          </label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-[#13293D]/30 bg-white px-4 py-3 text-lg shadow-sm focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20"
            placeholder="Describe your project: garment types, sizes, colors, etc."
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              {t('brand.quote.form.deadline')}
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full rounded-xl border border-[#13293D]/30 bg-white px-4 py-3 text-lg shadow-sm focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              {t('brand.quote.form.fabrics')}
            </label>
            <input
              type="text"
              value={formData.fabrics}
              onChange={(e) => setFormData({ ...formData, fabrics: e.target.value })}
              className="w-full rounded-xl border border-[#13293D]/30 bg-white px-4 py-3 text-lg shadow-sm focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20"
              placeholder="e.g. 19 momme silk, sand wash"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#13293D] px-8 py-4 text-lg font-semibold uppercase tracking-wide text-white shadow-lg hover:bg-[#0F1E35] disabled:opacity-50"
        >
          {loading ? 'Submitting...' : t('brand.quote.form.submit')}
        </button>
      </form>
    </div>
  )
}

export default BrandQuotePage
