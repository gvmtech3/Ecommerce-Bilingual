// src/pages/BrandProjectsPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { inquiriesApi } from '../api/resourcesApi'
import {
  FileText, Calendar, Hash, Layers,
  Clock, CheckCircle, XCircle, Send,
  ChevronRight, AlertCircle
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending:    { labelKey: 'brand.statuses.pending',    icon: Clock,       bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200'  },
  in_review:  { labelKey: 'brand.statuses.inReview',   icon: FileText,    bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    border: 'border-blue-200'   },
  approved:   { labelKey: 'brand.statuses.approved',   icon: CheckCircle, bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-400',  border: 'border-indigo-200' },
  production: { labelKey: 'brand.statuses.production', icon: Layers,      bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400',  border: 'border-purple-200' },
  completed:  { labelKey: 'brand.statuses.completed',  icon: CheckCircle, bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-400',   border: 'border-green-200'  },
  rejected:   { labelKey: 'brand.statuses.rejected',   icon: XCircle,     bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400',     border: 'border-red-200'    },
}
const getMeta = (s) => STATUS_META[s] || STATUS_META.pending

const fmtDate = (str, lang) =>
  str
    ? new Date(str).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '—'

const PAGE_SIZE = 6

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status, t }) {
  const meta = getMeta(status)
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.bg} ${meta.text} ${meta.border}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
      {t(meta.labelKey, status)}
    </span>
  )
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, lang, t, index }) {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const id = setTimeout(() => setShow(true), index * 60)
    return () => clearTimeout(id)
  }, [index])

  const meta = getMeta(project.status)
  const Icon = meta.icon

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#D9A441]/40 hover:shadow-lg ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Top colour bar by status */}
      <div className={`h-1 w-full ${meta.dot}`} />

      <div className="p-5">
        {/* Header: id + status */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[11px] font-bold text-[#5A5A5A]">#{project.id}</p>
          <StatusPill status={project.status} t={t} />
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-[#13293D] group-hover:text-[#13293D]">
          {project.description || t('brand.inquiry.noDescription', 'No description provided.')}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {project.quantity && (
            <span className="flex items-center gap-1 rounded-lg bg-[#F6F3F0] px-2.5 py-1 text-[10px] font-semibold text-[#5A5A5A]">
              <Hash className="h-3 w-3 text-[#D9A441]" />
              {project.quantity} {t('brand.inquiry.pieces', 'pcs')}
            </span>
          )}
          {project.fabrics && (
            <span className="flex items-center gap-1 rounded-lg bg-[#F6F3F0] px-2.5 py-1 text-[10px] font-semibold text-[#5A5A5A]">
              <Layers className="h-3 w-3 text-[#D9A441]" />
              {project.fabrics}
            </span>
          )}
          {project.deadline && (
            <span className="flex items-center gap-1 rounded-lg bg-[#F6F3F0] px-2.5 py-1 text-[10px] font-semibold text-[#5A5A5A]">
              <Calendar className="h-3 w-3 text-[#D9A441]" />
              {fmtDate(project.deadline, lang)}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-[#D9A441]/10 pt-3">
          <span className="flex items-center gap-1 text-[10px] text-[#5A5A5A]">
            <Clock className="h-3 w-3" />
            {fmtDate(project.createdAt, lang)}
          </span>
          <button
            onClick={() => navigate('/brand')}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#13293D] opacity-0 transition-all group-hover:opacity-100"
          >
            {t('brand.projects.viewDetails', 'Details')}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BrandProjectsPage() {
  const { t, i18n } = useTranslation()
  const lang        = i18n.language
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [allProjects,  setAllProjects]  = useState([])
  const [displayed,    setDisplayed]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [loadingMore,  setLoadingMore]  = useState(false)
  const [hasMore,      setHasMore]      = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [visible,      setVisible]      = useState(false)

  const sentinelRef = useRef(null)
  const pageRef     = useRef(1)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // ── Fetch all inquiries for this user ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data } = await inquiriesApi.getByUser(user.id)
      setAllProjects(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (err) {
      console.error('Projects fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Re-slice when filter changes ──────────────────────────────────────────
  useEffect(() => {
    pageRef.current = 1
    const filtered = statusFilter === 'all'
      ? allProjects
      : allProjects.filter(p =>
          statusFilter === 'pending'
            ? ['pending', 'in_review'].includes(p.status)
            : p.status === statusFilter
        )
    setDisplayed(filtered.slice(0, PAGE_SIZE))
    setHasMore(filtered.length > PAGE_SIZE)
  }, [allProjects, statusFilter])

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const filtered = statusFilter === 'all'
      ? allProjects
      : allProjects.filter(p =>
          statusFilter === 'pending'
            ? ['pending', 'in_review'].includes(p.status)
            : p.status === statusFilter
        )

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          setTimeout(() => {
            pageRef.current += 1
            const next = filtered.slice(0, pageRef.current * PAGE_SIZE)
            setDisplayed(next)
            setHasMore(next.length < filtered.length)
            setLoadingMore(false)
          }, 500)
        }
      },
      { threshold: 0.1 }
    )

    const el = sentinelRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [allProjects, statusFilter, hasMore, loadingMore])

  const FILTER_OPTS = [
    { key: 'all',        label: t('brand.filter.all',        'All')        },
    { key: 'pending',    label: t('brand.filter.pending',    'Pending')    },
    { key: 'approved',   label: t('brand.filter.approved',   'Approved')   },
    { key: 'production', label: t('brand.projects.status.production', 'Production') },
    { key: 'completed',  label: t('brand.filter.completed',  'Completed')  },
  ]

  const filteredCount = statusFilter === 'all'
    ? allProjects.length
    : allProjects.filter(p =>
        statusFilter === 'pending'
          ? ['pending', 'in_review'].includes(p.status)
          : p.status === statusFilter
      ).length

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
          <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-serif text-4xl text-white">{t('brand.projects.title')}</h1>
              <p className="mt-1 text-sm text-white/50">{t('brand.projects.subtitle')}</p>
            </div>
            <button
              onClick={() => navigate('/brand/quote')}
              className="flex items-center gap-2 rounded-xl bg-[#D9A441] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#13293D] shadow-sm transition-all hover:bg-[#c4922e]"
            >
              <Send className="h-3.5 w-3.5" />
              {t('brand.quote.form.submit', 'Request Quote')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-6xl px-4 pb-20 pt-4 transition-all duration-700 delay-100"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all ${
                statusFilter === f.key
                  ? 'bg-[#13293D] text-white shadow-sm'
                  : 'border border-[#13293D]/20 text-[#5A5A5A] hover:border-[#D9A441]/40 hover:bg-white/60'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#5A5A5A]">
            <span className="font-semibold text-[#13293D]">{filteredCount}</span> {t('catalog.results', 'results')}
          </span>
        </div>

        {/* Grid */}
        <div className="mt-5">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9A441]/30 bg-white/40 py-24 text-center">
              <AlertCircle className="h-12 w-12 text-[#13293D]/20" />
              <h3 className="mt-4 font-serif text-xl text-[#13293D]">
                {statusFilter === 'all'
                  ? t('brand.noInquiries', 'No projects yet')
                  : t('brand.noInquiriesFilter', 'No projects with this status')}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#5A5A5A]">
                {statusFilter === 'all'
                  ? t('brand.noInquiriesHint', 'Submit a quote request to get started.')
                  : t('brand.noInquiriesFilterHint', 'Try a different filter.')}
              </p>
              {statusFilter === 'all' ? (
                <button
                  onClick={() => navigate('/brand/quote')}
                  className="mt-5 flex items-center gap-2 rounded-full bg-[#13293D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1a3a55] transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t('brand.quote.form.submit', 'Request a Quote')}
                </button>
              ) : (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="mt-5 rounded-full border border-[#13293D]/25 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] hover:bg-[#13293D]/5 transition-all"
                >
                  {t('dashboard.showAll', 'Show all')}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayed.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    lang={lang}
                    t={t}
                    index={i}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="mt-8 flex items-center justify-center py-4">
                {loadingMore && (
                  <div className="flex items-center gap-3 text-xs text-[#5A5A5A]">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9A441]/20 border-t-[#D9A441]" />
                    {t('catalog.loadingMore', 'Loading more…')}
                  </div>
                )}
                {!hasMore && displayed.length > 0 && (
                  <div className="flex items-center gap-4 text-xs text-[#5A5A5A]">
                    <span className="h-px w-16 bg-[#D9A441]/30" />
                    {t('catalog.allShown', 'All projects shown')}
                    <span className="h-px w-16 bg-[#D9A441]/30" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}