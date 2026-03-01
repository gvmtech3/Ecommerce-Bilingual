// src/pages/BrandDashboardPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { inquiriesApi } from '../api/resourcesApi'
import {
  Send, FileText, Clock, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Settings, Plus,
  Layers, Calendar, Hash, BarChart2,
  ChevronLeft, ChevronRight
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending:    { labelKey: 'brand.statuses.pending',    icon: Clock,       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  ring: 'ring-amber-200'  },
  in_review:  { labelKey: 'brand.statuses.inReview',   icon: FileText,    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   ring: 'ring-blue-200'   },
  approved:   { labelKey: 'brand.statuses.approved',   icon: CheckCircle, bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400', ring: 'ring-indigo-200' },
  production: { labelKey: 'brand.statuses.production', icon: Layers,      bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400', ring: 'ring-purple-200' },
  completed:  { labelKey: 'brand.statuses.completed',  icon: CheckCircle, bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  ring: 'ring-green-200'  },
  rejected:   { labelKey: 'brand.statuses.rejected',   icon: XCircle,     bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400',    ring: 'ring-red-200'    },
}
const getMeta = (s) => STATUS_META[s] || STATUS_META.pending

const fmtDate = (str, lang) =>
  str
    ? new Date(str).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '—'

const PAGE_SIZE = 5

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, delay = 0 }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(id)
  }, [delay])
  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-[#D9A441]/20 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">{label}</p>
        <p className="mt-0.5 font-serif text-2xl font-bold text-[#13293D]">{value}</p>
      </div>
    </div>
  )
}

// ── Inquiry card (expandable) ─────────────────────────────────────────────────
function InquiryCard({ inquiry, lang, t }) {
  const [open, setOpen] = useState(false)
  const meta = getMeta(inquiry.status)
  const StatusIcon = meta.icon

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${open ? 'border-[#D9A441]/40 shadow-md' : 'border-[#D9A441]/15 shadow-sm'} bg-white/70 backdrop-blur-sm`}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F6F3F0]/50 sm:gap-4 sm:px-6 sm:py-5"
      >
        <div className={`mt-0.5 hidden shrink-0 items-center justify-center rounded-xl p-2.5 sm:flex ${meta.bg}`}>
          <StatusIcon className={`h-4 w-4 ${meta.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-[#13293D]">
            {inquiry.description || t('brand.inquiry.noDescription', 'No description')}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-[#5A5A5A]">
            {inquiry.quantity && (
              <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{inquiry.quantity} {t('brand.inquiry.pieces', 'pcs')}</span>
            )}
            {inquiry.deadline && (
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(inquiry.deadline, lang)}</span>
            )}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(inquiry.createdAt, lang)}</span>
          </div>
        </div>
        <div className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 sm:flex ${meta.bg} ${meta.ring}`}>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${meta.text}`}>
            {t(meta.labelKey, inquiry.status)}
          </span>
        </div>
        <span className={`mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full sm:hidden ${meta.dot}`} />
        <div className="mt-0.5 shrink-0 text-[#5A5A5A]">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[#D9A441]/10 bg-[#F6F3F0]/50 px-5 py-4 sm:px-6">
          <div className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 sm:hidden ${meta.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            <span className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>
              {t(meta.labelKey, inquiry.status)}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('brand.inquiry.descriptionLabel', 'Project Brief')}
              </p>
              <p className="mt-1.5 rounded-xl bg-white/70 p-3 text-sm leading-relaxed text-[#13293D]">
                {inquiry.description || '—'}
              </p>
            </div>
            {inquiry.quantity && (
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('brand.quote.form.quantity', 'Quantity')}
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-[#13293D]">
                  {inquiry.quantity} <span className="text-sm font-normal text-[#5A5A5A]">{t('brand.inquiry.pieces', 'pcs')}</span>
                </p>
              </div>
            )}
            {inquiry.deadline && (
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('brand.quote.form.deadline', 'Deadline')}
                </p>
                <p className="mt-1 font-serif text-base font-bold text-[#13293D]">
                  {fmtDate(inquiry.deadline, lang)}
                </p>
              </div>
            )}
            {inquiry.fabrics && (
              <div className="rounded-xl bg-white/70 p-3 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('brand.quote.form.fabrics', 'Fabrics')}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-[#13293D]">
                  <Layers className="h-3.5 w-3.5 text-[#D9A441]" />
                  {inquiry.fabrics}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Pagination bar ────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPage }) {
  if (totalPages <= 1) return null

  // Build page numbers with ellipsis for large sets
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 rounded-xl border border-[#13293D]/15 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#13293D] transition-all hover:border-[#D9A441]/40 hover:bg-white disabled:opacity-30"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-[#5A5A5A]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                p === currentPage
                  ? 'bg-[#13293D] text-white shadow-sm'
                  : 'border border-[#13293D]/15 bg-white/70 text-[#13293D] hover:border-[#D9A441]/40'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 rounded-xl border border-[#13293D]/15 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#13293D] transition-all hover:border-[#D9A441]/40 hover:bg-white disabled:opacity-30"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BrandDashboardPage() {
  const { t, i18n } = useTranslation()
  const lang        = i18n.language
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [inquiries,   setInquiries]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [visible,     setVisible]     = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data } = await inquiriesApi.getByUser(user.id)
      setInquiries(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (err) {
      console.error('Brand dashboard fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { fetchData() }, [fetchData])

  // Reset to page 1 when filter changes
  useEffect(() => { setCurrentPage(1) }, [filter])

  // ── Derived lists ─────────────────────────────────────────────────────────
  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries.filter(i =>
        filter === 'pending'
          ? ['pending', 'in_review'].includes(i.status)
          : i.status === filter
      )

  const totalPages   = Math.ceil(filteredInquiries.length / PAGE_SIZE)
  const pageStart    = (currentPage - 1) * PAGE_SIZE
  const pageEnd      = pageStart + PAGE_SIZE
  const pageItems    = filteredInquiries.slice(pageStart, pageEnd)

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total      = inquiries.length
  const pending    = inquiries.filter(i => ['pending', 'in_review'].includes(i.status)).length
  const approved   = inquiries.filter(i => i.status === 'approved').length
  const completed  = inquiries.filter(i => i.status === 'completed').length

  const FILTER_OPTS = [
    { key: 'all',       label: t('brand.filter.all',       'All')       },
    { key: 'pending',   label: t('brand.filter.pending',   'Pending')   },
    { key: 'approved',  label: t('brand.filter.approved',  'Approved')  },
    { key: 'completed', label: t('brand.filter.completed', 'Completed') },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F6F3F0]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Header band ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#13293D] pb-20 pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)` }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }}
        />
        <div
          className="relative mx-auto max-w-6xl px-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('split.brandsEyebrow', 'Brand Partner')}
            </p>
          </span>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-white">{t('brand.overview.title')}</h1>
              <p className="mt-1 text-sm text-white/50">
                {t('dashboard.welcome', 'Welcome back')}, {user?.name?.split(' ')[0]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/brand/quote')}
                className="flex items-center gap-2 rounded-xl bg-[#D9A441] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#13293D] shadow-sm transition-all hover:bg-[#c4922e]"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('brand.newInquiry', 'New Inquiry')}
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:border-[#D9A441]/50 hover:text-[#D9A441] transition-all"
              >
                <Settings className="h-3.5 w-3.5" />
                {t('settings.navLabel', 'Settings')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-6xl px-4 pb-20 pt-4 transition-all duration-700 delay-100"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard icon={BarChart2}   label={t('brand.overview.stats.total',    'Total')}     value={total}     accent="bg-[#13293D]" delay={0}   />
          <StatCard icon={Clock}       label={t('brand.overview.stats.pending',  'Pending')}   value={pending}   accent="bg-amber-500" delay={100} />
          <StatCard icon={FileText}    label={t('brand.overview.stats.approved', 'Approved')}  value={approved}  accent="bg-[#ed5e25]" delay={200} />
          <StatCard icon={CheckCircle} label={t('brand.overview.stats.completed','Completed')} value={completed} accent="bg-green-500" delay={300} />
        </div>

        {/* Inquiries section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-4">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-[#D9A441]/20 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('dashboard.filterOrders', 'Filter')}
              </p>
              <div className="space-y-2">
                {FILTER_OPTS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                      filter === f.key
                        ? 'bg-[#13293D] text-white shadow-sm'
                        : 'border border-[#13293D]/15 text-[#13293D] hover:border-[#D9A441]/40 hover:bg-[#F6F3F0]'
                    }`}
                  >
                    {f.label}
                    {filter === f.key && <span className="h-1.5 w-1.5 rounded-full bg-[#D9A441]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inquiries list */}
          <div className="lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#13293D]">
                {t('brand.overview.recent', 'Recent Inquiries')}
              </h2>
              <span className="text-xs text-[#5A5A5A]">
                <span className="font-semibold text-[#13293D]">
                  {filteredInquiries.length}
                </span> {t('catalog.results', 'results')}
                {totalPages > 1 && (
                  <span className="ml-2 text-[#5A5A5A]/60">
                    · {t('pagination.page', 'Page')} {currentPage}/{totalPages}
                  </span>
                )}
              </span>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9A441]/30 bg-white/40 py-20 text-center">
                <FileText className="h-12 w-12 text-[#13293D]/20" />
                <h3 className="mt-4 font-serif text-xl text-[#13293D]">
                  {filter === 'all'
                    ? t('brand.noInquiries', 'No inquiries yet')
                    : t('brand.noInquiriesFilter', 'No inquiries in this category')}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[#5A5A5A]">
                  {filter === 'all'
                    ? t('brand.noInquiriesHint', 'Submit a quote request to get started.')
                    : t('brand.noInquiriesFilterHint', 'Try a different filter.')}
                </p>
                {filter === 'all' ? (
                  <button
                    onClick={() => navigate('/brand/quote')}
                    className="mt-5 flex items-center gap-2 rounded-full bg-[#13293D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1a3a55] transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {t('brand.quote.form.submit', 'Request a Quote')}
                  </button>
                ) : (
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-5 rounded-full border border-[#13293D]/25 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] hover:bg-[#13293D]/5 transition-all"
                  >
                    {t('dashboard.showAll', 'Show all')}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pageItems.map(inquiry => (
                    <InquiryCard key={inquiry.id} inquiry={inquiry} lang={lang} t={t} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPage={(p) => {
                    setCurrentPage(p)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}