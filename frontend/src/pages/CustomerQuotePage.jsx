// src/pages/CustomerQuotePage.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { inquiriesApi } from '../api/resourcesApi'
import {
  Send, CheckCircle, User, Mail, Hash,
  Calendar, Layers, FileText, ArrowLeft
} from 'lucide-react'

const INPUT_CLASS =
  'w-full rounded-xl border border-[#13293D]/20 bg-white/80 px-4 py-3 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/40 transition-all duration-200 focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20 disabled:opacity-60'

// ── Floating label field ──────────────────────────────────────────────────────
function Field({ icon: Icon, label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#D9A441]" />}
        {label}
        {optional && (
          <span className="font-normal normal-case tracking-normal text-[#5A5A5A]/60">(optional)</span>
        )}
        {!optional && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] font-semibold text-red-400">{error}</p>}
    </div>
  )
}

// ── Process step pill ─────────────────────────────────────────────────────────
function Step({ num, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9A441] text-[10px] font-bold text-[#13293D]">
        {num}
      </span>
      <span className="text-xs text-[#5A5A5A]">{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CustomerQuotePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:        user?.name  || '',
    email:       user?.email || '',
    quantity:    '',
    description: '',
    deadline:    '',
    fabrics:     '',
  })
  const [errors,    setErrors]  = useState({})
  const [status,    setStatus]  = useState('idle') // idle | submitting | success
  const [visible,   setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const set = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.quantity || Number(formData.quantity) < 1)
      e.quantity = t('customer.quote.errors.quantity', 'Please enter a valid quantity.')
    if (!formData.description.trim())
      e.description = t('customer.quote.errors.description', 'Please describe your project.')
    if (!formData.deadline)
      e.deadline = t('customer.quote.errors.deadline', 'Please select a deadline.')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('submitting')
    try {
      await inquiriesApi.create({
        userId:      user?.id,
        name:        formData.name,
        email:       formData.email,
        quantity:    Number(formData.quantity),
        description: formData.description,
        deadline:    formData.deadline,
        fabrics:     formData.fabrics,
        status:      'pending',
        createdAt:   new Date().toISOString(),
      })
      setStatus('success')
    } catch (err) {
      console.error('Quote submission error:', err)
      setErrors({ submit: t('customer.quote.errors.submit', 'Submission failed. Please try again.') })
      setStatus('idle')
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3F0] px-4">
        <div className="w-full max-w-md text-center">
          {/* Animated check */}
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#D9A441]/15" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-3 rounded-full bg-[#D9A441]/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#13293D] shadow-xl">
              <CheckCircle className="h-10 w-10 text-[#D9A441]" />
            </div>
          </div>

          <h1 className="mt-6 font-serif text-3xl text-[#13293D]">
            {t('customer.quote.successTitle', 'Quote Request Sent!')}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#5A5A5A]">
            {t('customer.quote.successMsg', "We'll review your request and reach out within 24 hours.")}
          </p>

          {/* Ref number */}
          <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-[#D9A441]/20 bg-white/80 px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
              {t('customer.quote.refNumber', 'Reference')}
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wider text-[#13293D]">
              #QT-{Date.now().toString().slice(-6)}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/customer')}
              className="flex items-center justify-center gap-2 rounded-full bg-[#13293D] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#1a3a55]"
            >
              {t('order.viewOrders', 'View Dashboard')}
            </button>
            <button
              onClick={() => { setStatus('idle'); setFormData({ name: user?.name || '', email: user?.email || '', quantity: '', description: '', deadline: '', fabrics: '' }) }}
              className="flex items-center justify-center gap-2 rounded-full border border-[#13293D]/25 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#13293D] transition-all hover:bg-[#13293D]/5"
            >
              {t('brand.quote.newRequest', 'New Request')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Header band ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#13293D] pb-20 pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div
          className="relative mx-auto max-w-3xl px-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('catalog.backToCollection', 'Back')}
          </button>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('split.customersEyebrow', 'Custom Order')}
            </p>
          </span>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {t('customer.quote.title')}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
            {t('customer.quote.subtitle')}
          </p>
        </div>
      </div>

      {/* ── Body: sidebar + form ─────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-3xl px-4 pb-20 pt-4 transition-all duration-700 delay-100 lg:grid lg:grid-cols-5 lg:gap-8"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >

        {/* Sidebar */}
        <aside className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-24 rounded-3xl border border-[#D9A441]/20 bg-white/60 p-6 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
              {t('services.processTitle', 'What happens next')}
            </p>
            <div className="mt-5 space-y-4">
              <Step num="1" label={t('services.step1Title', 'We receive your brief')} />
              <Step num="2" label={t('services.step2Title', 'Our team reviews it')} />
              <Step num="3" label={t('services.step3Title', 'We send you a quote')} />
              <Step num="4" label={t('services.step4Title', 'Production begins')} />
            </div>

            {/* Estimated response */}
            <div className="mt-6 rounded-2xl bg-[#13293D] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D9A441]">
                {t('customer.quote.responseTime', 'Response time')}
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {t('customer.quote.responseValue', 'Within 24 hours')}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-[#dde3d7]/60 px-4 py-3">
              <p className="text-xs leading-relaxed text-[#5A5A5A]">
                {t('brand.quote.trustNote', 'All inquiries are treated with full confidentiality.')}
              </p>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#D9A441]/20 bg-white/70 p-6 shadow-sm backdrop-blur-sm md:p-8"
          >
            <h2 className="font-serif text-xl text-[#13293D]">
              {t('brand.quote.formHeading', 'Project Details')}
            </h2>
            <p className="mt-1 text-xs text-[#5A5A5A]">
              {t('brand.quote.formSubheading', 'The more detail you provide, the faster we can quote.')}
            </p>

            <div className="mt-6 space-y-5">

              {/* Name + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={User} label={t('customer.quote.form.name')}>
                  <input type="text" value={formData.name} onChange={set('name')}
                    className={INPUT_CLASS}
                    placeholder={t('cart.form.namePlaceholder', 'Your name')}
                    disabled={status === 'submitting'} />
                </Field>
                <Field icon={Mail} label={t('customer.quote.form.email')}>
                  <input type="email" value={formData.email} onChange={set('email')}
                    className={INPUT_CLASS}
                    placeholder="you@example.com"
                    disabled={status === 'submitting'} />
                </Field>
              </div>

              {/* Quantity */}
              <Field icon={Hash} label={t('customer.quote.form.quantity')} error={errors.quantity}>
                <input type="number" min="1" value={formData.quantity} onChange={set('quantity')}
                  className={`${INPUT_CLASS} ${errors.quantity ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder={t('brand.quote.quantityPlaceholder', 'e.g. 50 pieces')}
                  disabled={status === 'submitting'} required />
              </Field>

              {/* Description */}
              <Field icon={FileText} label={t('customer.quote.form.description')} error={errors.description}>
                <textarea rows={5} value={formData.description} onChange={set('description')}
                  className={`${INPUT_CLASS} resize-none ${errors.description ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder={t('brand.quote.descriptionPlaceholder', 'Garment types, sizes, colors, finishing details…')}
                  disabled={status === 'submitting'} required />
                <p className="text-right text-[10px] text-[#5A5A5A]/60">
                  {formData.description.length} {t('brand.quote.chars', 'chars')}
                </p>
              </Field>

              {/* Deadline + Fabrics */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={Calendar} label={t('customer.quote.form.deadline')} error={errors.deadline}>
                  <input type="date" value={formData.deadline} onChange={set('deadline')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`${INPUT_CLASS} ${errors.deadline ? 'border-red-300 focus:ring-red-200' : ''}`}
                    disabled={status === 'submitting'} required />
                </Field>
                <Field icon={Layers} label={t('customer.quote.form.fabrics')} optional>
                  <input type="text" value={formData.fabrics} onChange={set('fabrics')}
                    className={INPUT_CLASS}
                    placeholder={t('brand.quote.fabricsPlaceholder', 'e.g. Mulberry silk, Satin')}
                    disabled={status === 'submitting'} />
                </Field>
              </div>

              {/* Mobile: what happens next */}
              <div className="rounded-2xl border border-[#D9A441]/20 bg-[#F6F3F0] p-4 lg:hidden">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('brand.quote.whatHappensNext', 'What happens next?')}
                </p>
                <div className="space-y-2.5">
                  {[1, 2, 3, 4].map(n => (
                    <Step key={n} num={n} label={t(`services.step${n}Title`, `Step ${n}`)} />
                  ))}
                </div>
              </div>

              {/* Error */}
              {errors.submit && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#13293D] py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#1a3a55] hover:shadow-lg disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('brand.quote.submitting', 'Submitting…')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('customer.quote.form.submit')}
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-[#5A5A5A]/60">
                {t('brand.quote.privacyNote', 'Your brief is treated with full confidentiality.')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}