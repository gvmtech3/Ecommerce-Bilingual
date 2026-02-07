// src/pages/CustomerQuotePage.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { Mail, Calendar, Hash } from 'lucide-react'
import axiosClient from '../api/axiosClient'

function CustomerQuotePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    quantity: '',
    description: '',
    deadline: '',
    fabrics: ''
  })
  const [status, setStatus] = useState('idle')  // idle, submitting, success
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API
      // await axiosClient.post('/quotes', formData)
      
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setFormData({ name: '', email: '', quantity: '', description: '', deadline: '', fabrics: '' })
      }, 3000)
    } catch (error) {
      setStatus('error')
      setErrors({ submit: t('quote.form.submit') || 'Submission failed' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.quantity) newErrors.quantity = 'Quantity is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    return newErrors
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
            {t('customer.quote.title')}
          </h1>
          <p className="text-xl text-[#5A5A5A]">
            {t('customer.quote.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <div className="mb-12 p-8 bg-green-50 border-2 border-green-200 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl text-green-800 mb-4">
              {t('customer.quote.success')}
            </h2>
            <p className="text-green-700">We'll contact you within 24 hours!</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-[#D9A441]/20">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
                <Hash className="h-4 w-4" />
                {t('customer.quote.form.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50"
                disabled={status === 'submitting'}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
                <Mail className="h-4 w-4" />
                {t('customer.quote.form.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50"
                disabled={status === 'submitting'}
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              <Hash className="h-4 w-4" />
              {t('customer.quote.form.quantity')}
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50"
              disabled={status === 'submitting'}
              placeholder="e.g. 50 pieces"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              {t('customer.quote.form.description')}
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50 resize-vertical"
              disabled={status === 'submitting'}
              placeholder="Describe your custom requirements, design preferences, sizes, colors, etc."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Deadline + Fabrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
                <Calendar className="h-4 w-4" />
                {t('customer.quote.form.deadline')}
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50"
                disabled={status === 'submitting'}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
                {t('customer.quote.form.fabrics')}
              </label>
              <input
                type="text"
                value={formData.fabrics}
                onChange={(e) => setFormData({...formData, fabrics: e.target.value})}
                className="w-full p-4 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50"
                disabled={status === 'submitting'}
                placeholder="e.g. Mulberry silk, Satin, Organza"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting' || Object.keys(validateForm()).length > 0}
            className={`w-full py-6 px-8 rounded-3xl font-serif text-xl font-semibold uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 ${
              status === 'submitting'
                ? 'bg-[#5A5A5A]/80 cursor-not-allowed'
                : 'bg-linear-to-r from-[#13293D] to-[#1A365D] hover:from-[#0F1E35] hover:to-[#13293D] hover:shadow-[#13293D]/25 hover:scale-[1.02] text-white'
            }`}
          >
            {status === 'submitting' ? (
              <>
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('customer.quote.form.submit')}...
              </>
            ) : (
              t('customer.quote.form.submit')
            )}
          </button>

          {errors.submit && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-center">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CustomerQuotePage
