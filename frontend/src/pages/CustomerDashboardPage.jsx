// src/pages/CustomerDashboardPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ordersApi, orderItemsApi, reviewsApi } from '../api/resourcesApi'
import { PRODUCTS } from '../api/mockData'
import {
  ShoppingBag, Package, Truck, CheckCircle,
  Clock, ChevronDown, ChevronUp, Settings,
  MapPin, Calendar, Star, Edit3, Send, X
} from 'lucide-react'
import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'

// ── Constants & helpers ───────────────────────────────────────────────────────
const PLACEHOLDER_IMAGES = {
  '1': image1, '2': image2, '3': image3,
  '4': image1, '5': image2, '6': image3,
  '7': image1, '8': image2,
}
const toDollars = (p) => (!p ? 0 : p > 500 ? p / 100 : p)
const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

const parseOrderDate = (order) => {
  const raw = order.orderDate ?? order.date
  if (!raw) return new Date(0)
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date(0) : d
}
const pastMonthThreshold = () => { const d = new Date(); d.setDate(d.getDate() - 30); d.setHours(0,0,0,0); return d }
const pastYearThreshold  = () => { const d = new Date(); d.setDate(d.getDate() - 365); d.setHours(0,0,0,0); return d }

const STATUS_META = {
  placed:     { labelKey: 'dashboard.statuses.placed',     icon: Clock,       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  ring: 'ring-amber-200'  },
  processing: { labelKey: 'dashboard.statuses.processing', icon: Package,     bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   ring: 'ring-blue-200'   },
  shipped:    { labelKey: 'dashboard.statuses.shipped',    icon: Truck,       bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400', ring: 'ring-indigo-200' },
  delivered:  { labelKey: 'dashboard.statuses.delivered',  icon: CheckCircle, bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  ring: 'ring-green-200'  },
}
const getMeta = (s) => STATUS_META[s] || STATUS_META.placed

// ── Star picker ───────────────────────────────────────────────────────────────
function StarPicker({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const dim = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`${dim} transition-colors ${
            i <= (hovered || value) ? 'fill-[#D9A441] text-[#D9A441]' : 'text-[#D9A441]/25'
          }`} />
        </button>
      ))}
    </div>
  )
}

// ── Static star display ───────────────────────────────────────────────────────
function StarDisplay({ rating, size = 'sm' }) {
  const dim = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${dim} ${i <= rating ? 'fill-[#D9A441] text-[#D9A441]' : 'text-[#D9A441]/25'}`} />
      ))}
    </div>
  )
}

// ── Review form (inline) ──────────────────────────────────────────────────────
function ReviewForm({ item, product, user, lang, t, onSubmitted }) {
  const [rating, setRating]     = useState(0)
  const [title,  setTitle]      = useState('')
  const [body,   setBody]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [error,  setError]      = useState('')

  const name = product ? (lang === 'es' ? product.nameEs : product.name) : `Product #${item.productId}`
  const img  = product ? (PLACEHOLDER_IMAGES[product.id] || image1) : image1

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError(t('review.errorRating', 'Please select a star rating.')); return }
    if (!body.trim()) { setError(t('review.errorBody',   'Please write a short review.')); return }
    setSaving(true)
    setError('')
    try {
      await reviewsApi.create({
        productId: String(item.productId),
        userId:    String(user.id),
        orderId:   String(item.orderId),
        author:    user.name,
        rating,
        title:     title.trim() || (lang === 'es' ? 'Mi reseña' : 'My review'),
        titleEs:   title.trim() || 'Mi reseña',
        text:      body.trim(),
        textEs:    body.trim(),   // customer writes in their language — stored as-is
        verified:  true,
      })
      onSubmitted(String(item.productId))
    } catch (err) {
      if (err?.response?.status === 409)
        setError(t('review.errorDuplicate', 'You have already reviewed this product.'))
      else
        setError(t('review.errorGeneric', 'Something went wrong. Please try again.'))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#D9A441]/20 bg-white/80 p-4 shadow-sm">
      {/* Product header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-10 shrink-0 overflow-hidden rounded-xl bg-[#dde3d7]">
          <img src={img} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D9A441]">
            {t('review.writeReview', 'Write a review')}
          </p>
          <p className="text-sm font-semibold text-[#13293D] line-clamp-1">{name}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
          {t('review.yourRating', 'Your rating')} <span className="text-red-400">*</span>
        </p>
        <StarPicker value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A] mb-1.5">
          {t('review.titleLabel', 'Title')}
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
          className="w-full rounded-xl border border-[#13293D]/20 bg-white/80 px-3 py-2.5 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/40 focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20 transition-all"
          placeholder={t('review.titlePlaceholder', 'Summarise your experience…')}
          disabled={saving}
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A] mb-1.5">
          {t('review.bodyLabel', 'Your review')} <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={3}
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-[#13293D]/20 bg-white/80 px-3 py-2.5 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/40 focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20 transition-all"
          placeholder={t('review.bodyPlaceholder', 'What did you love? Quality, fit, feel…')}
          disabled={saving}
        />
        <p className="mt-1 text-right text-[10px] text-[#5A5A5A]/60">{body.length}/500</p>
      </div>

      {error && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#13293D] py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#1a3a55] disabled:opacity-60"
      >
        {saving ? (
          <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{t('review.submitting', 'Submitting…')}</>
        ) : (
          <><Send className="h-3.5 w-3.5" />{t('review.submit', 'Submit Review')}</>
        )}
      </button>
    </form>
  )
}

// ── Submitted review display ──────────────────────────────────────────────────
function SubmittedReview({ review, lang, t }) {
  const title = lang === 'es' ? review.titleEs : review.title
  const body  = lang === 'es' ? review.textEs  : review.text
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-green-600">
          {t('review.reviewed', 'Review submitted')}
        </span>
      </div>
      <StarDisplay rating={review.rating} />
      {title && <p className="mt-2 text-sm font-semibold text-[#13293D]">{title}</p>}
      <p className="mt-1 text-xs leading-relaxed text-[#5A5A5A]">{body}</p>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, delay: d = 0 }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const id = setTimeout(() => setShow(true), d); return () => clearTimeout(id) }, [d])
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

// ── Order card (expandable, with per-item review flow) ────────────────────────
function OrderCard({ order, items, lang, t, user, userReviews, onReviewSubmitted }) {
  const [open, setOpen] = useState(false)
  // Track which items have their review form open in this session
  const [openForms, setOpenForms] = useState({})

  const meta = getMeta(order.status)
  const StatusIcon = meta.icon
  const isDelivered = order.status === 'delivered'

  const total = order.total
    ? toDollars(order.total)
    : items.reduce((s, i) => s + toDollars(i.priceAtPurchase) * (i.quantity || 1), 0)

  const dateStr = parseOrderDate(order).toLocaleDateString(
    lang === 'es' ? 'es-ES' : 'en-GB',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )

  const toggleForm = (productId) =>
    setOpenForms(p => ({ ...p, [productId]: !p[productId] }))

  const getReview = (productId) =>
    userReviews.find(r => String(r.productId) === String(productId))

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${open ? 'border-[#D9A441]/40 shadow-md' : 'border-[#D9A441]/15 shadow-sm'} bg-white/70 backdrop-blur-sm`}>

      {/* ── Summary row ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(p => !p)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#F6F3F0]/50 transition-colors sm:gap-4 sm:px-6 sm:py-5"
      >
        <div className={`hidden shrink-0 items-center justify-center rounded-xl p-2.5 sm:flex ${meta.bg}`}>
          <StatusIcon className={`h-4 w-4 ${meta.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-bold text-[#13293D]">#{order.id}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#5A5A5A]">
            <Calendar className="h-3 w-3" />{dateStr}
          </div>
        </div>
        <div className="hidden text-center sm:block">
          <p className="font-serif text-base font-bold text-[#13293D]">{items.length}</p>
          <p className="text-[10px] text-[#5A5A5A]">{t('dashboard.items')}</p>
        </div>
        <div className="text-right">
          <p className="font-serif text-base font-bold text-[#13293D] sm:text-lg">{formatUSD(total)}</p>
          <p className="text-[10px] text-[#5A5A5A]">{t('cart.total')}</p>
        </div>
        {/* Status pill (desktop) */}
        <div className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 sm:flex ${meta.bg} ${meta.ring}`}>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${meta.text}`}>
            {t(meta.labelKey, order.status)}
          </span>
        </div>
        {/* Status dot (mobile) */}
        <span className={`flex h-2.5 w-2.5 shrink-0 rounded-full sm:hidden ${meta.dot}`} />
        <div className="shrink-0 text-[#5A5A5A]">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* ── Expanded detail ──────────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-[#D9A441]/10 bg-[#F6F3F0]/50 px-5 py-4 sm:px-6">
          {/* Mobile status */}
          <div className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 sm:hidden ${meta.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            <span className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>
              {t(meta.labelKey, order.status)}
            </span>
          </div>

          {/* Shipping info */}
          {order.shippingInfo?.address && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-[#D9A441]/15 bg-white/60 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A441]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('cart.shippingDetails', 'Shipped to')}
                </p>
                <p className="mt-0.5 text-xs text-[#13293D]">
                  {order.shippingInfo.name} · {order.shippingInfo.address}
                </p>
              </div>
            </div>
          )}

          {/* Delivered review prompt banner */}
          {isDelivered && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-[#D9A441]/10 px-4 py-3">
              <Star className="h-4 w-4 shrink-0 text-[#D9A441] fill-[#D9A441]" />
              <p className="text-xs leading-relaxed text-[#13293D]">
                <span className="font-semibold">{t('review.deliveredPromptTitle', 'How was your order?')}</span>
                {' '}{t('review.deliveredPromptBody', 'Share your experience and help others.')}
              </p>
            </div>
          )}

          {/* Item lines */}
          {items.length === 0 ? (
            <p className="text-xs text-[#5A5A5A]">{t('dashboard.noItems', 'No item details available.')}</p>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const product = PRODUCTS.find(p => String(p.id) === String(item.productId))
                const itemName  = product ? (lang === 'es' ? product.nameEs : product.name) : `Product #${item.productId}`
                const img       = product ? (PLACEHOLDER_IMAGES[product.id] || image1) : image1
                const unitUSD   = toDollars(item.priceAtPurchase)
                const qty       = item.quantity || 1
                const review    = getReview(item.productId)
                const formOpen  = openForms[item.productId]

                return (
                  <div key={item.id} className="rounded-2xl bg-white/80 overflow-hidden border border-[#D9A441]/10">
                    {/* Product row */}
                    <div className="flex items-center gap-3 p-3">
                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-[#dde3d7]">
                        <img src={img} alt={itemName} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#13293D]">{itemName}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {item.selectedSize && (
                            <span className="rounded-full bg-[#F6F3F0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                              {t('catalog.size', 'Size')} {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="rounded-full bg-[#F6F3F0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-[#5A5A5A]">{formatUSD(unitUSD)} × {qty}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <p className="font-serif text-sm font-bold text-[#13293D]">{formatUSD(unitUSD * qty)}</p>
                        {/* Review CTA — only on delivered orders */}
                        {isDelivered && !review && (
                          <button
                            onClick={() => toggleForm(item.productId)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                              formOpen
                                ? 'bg-[#F6F3F0] text-[#5A5A5A]'
                                : 'bg-[#13293D] text-white hover:bg-[#1a3a55]'
                            }`}
                          >
                            {formOpen ? <><X className="h-3 w-3" />{t('review.cancel', 'Cancel')}</> : <><Edit3 className="h-3 w-3" />{t('review.writeReview', 'Review')}</>}
                          </button>
                        )}
                        {/* Already reviewed badge */}
                        {isDelivered && review && (
                          <div className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-[10px] font-semibold text-green-600">{t('review.reviewed', 'Reviewed')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline review form (toggled) */}
                    {isDelivered && !review && formOpen && (
                      <div className="border-t border-[#D9A441]/10 p-3">
                        <ReviewForm
                          item={{ ...item, orderId: order.id }}
                          product={product}
                          user={user}
                          lang={lang}
                          t={t}
                          onSubmitted={(productId) => {
                            toggleForm(productId)
                            onReviewSubmitted()
                          }}
                        />
                      </div>
                    )}

                    {/* Submitted review preview */}
                    {isDelivered && review && (
                      <div className="border-t border-[#D9A441]/10 p-3">
                        <SubmittedReview review={review} lang={lang} t={t} />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Order total */}
              <div className="flex justify-between rounded-xl bg-[#13293D] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{t('cart.total')}</span>
                <span className="font-serif text-sm font-bold text-[#D9A441]">{formatUSD(total)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomerDashboardPage() {
  const { t, i18n }  = useTranslation()
  const lang          = i18n.language
  const { user }      = useAuth()
  const navigate      = useNavigate()

  const [orders,      setOrders]      = useState([])
  const [allItems,    setAllItems]    = useState({})
  const [userReviews, setUserReviews] = useState([]) // all reviews by this user
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('latest')
  const [visible,     setVisible]     = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      // Fetch orders
      const { data: userOrders } = await ordersApi.getByUser(user.id)
      userOrders.sort((a, b) => parseOrderDate(b) - parseOrderDate(a))

      // Fetch order items in parallel
      const itemsMap = {}
      await Promise.all(
        userOrders.map(async (order) => {
          try {
            const { data: items } = await orderItemsApi.getByOrder(order.id)
            itemsMap[order.id] = items
          } catch {
            itemsMap[order.id] = []
          }
        })
      )

      // Fetch user's reviews
      const { data: reviews } = await reviewsApi.getByUser(user.id)

      setOrders(userOrders)
      setAllItems(itemsMap)
      setUserReviews(reviews)
    } catch (err) {
      console.error('Dashboard fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { fetchData() }, [fetchData])

  // Re-fetch reviews only (lightweight) when a new review is submitted
  const refreshReviews = useCallback(async () => {
    if (!user?.id) return
    try {
      const { data: reviews } = await reviewsApi.getByUser(user.id)
      setUserReviews(reviews)
    } catch (err) {
      console.error('Review refresh:', err)
    }
  }, [user?.id])

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredOrders = orders.filter(order => {
    if (filter === 'latest') return true
    const d = parseOrderDate(order)
    if (filter === 'month') return d >= pastMonthThreshold()
    if (filter === 'year')  return d >= pastYearThreshold()
    return true
  })

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalSpent = orders.reduce((sum, o) => {
    if (o.total) return sum + toDollars(o.total)
    const items = allItems[o.id] || []
    return sum + items.reduce((s, i) => s + toDollars(i.priceAtPurchase) * (i.quantity || 1), 0)
  }, 0)
  const deliveredCount = orders.filter(o => o.status === 'delivered').length
  const activeCount    = orders.filter(o => ['placed','processing','shipped'].includes(o.status)).length

  const FILTERS = [
    { key: 'latest', label: t('dashboard.latest') },
    { key: 'month',  label: t('dashboard.pastMonth') },
    { key: 'year',   label: t('dashboard.pastYear') },
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
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('dashboard.eyebrow', 'My Account')}
            </p>
          </span>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-white">{t('dashboard.customer')}</h1>
              <p className="mt-1 text-sm text-white/50">
                {t('dashboard.welcome', 'Welcome back')}, {user?.name?.split(' ')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-4 transition-all duration-700 delay-100"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard icon={ShoppingBag} label={t('dashboard.totalOrders')}            value={orders.length}        accent="bg-[#13293D]" delay={0}   />
          <StatCard icon={CheckCircle} label={t('dashboard.delivered', 'Delivered')} value={deliveredCount}        accent="bg-green-500" delay={100} />
          <StatCard icon={Truck}       label={t('dashboard.active', 'Active')}       value={activeCount}           accent="bg-[#ed5e25]" delay={200} />
          <StatCard icon={Package}     label={t('dashboard.totalSpent')}             value={formatUSD(totalSpent)} accent="bg-[#D9A441]" delay={300} />
        </div>

        {/* Orders + sidebar */}
        <div className="mt-8 grid gap-6 lg:grid-cols-4">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-[#D9A441]/20 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('dashboard.filterOrders')}
              </p>
              <div className="space-y-2">
                {FILTERS.map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                      filter === f.key
                        ? 'bg-[#13293D] text-white shadow-sm'
                        : 'border border-[#13293D]/15 text-[#13293D] hover:border-[#D9A441]/40 hover:bg-[#F6F3F0]'
                    }`}>
                    {f.label}
                    {filter === f.key && <span className="h-1.5 w-1.5 rounded-full bg-[#D9A441]" />}
                  </button>
                ))}
              </div>

              {filter !== 'latest' && (
                <p className="mt-3 rounded-xl bg-[#F6F3F0] px-3 py-2 text-[10px] leading-relaxed text-[#5A5A5A]">
                  {filter === 'month'
                    ? t('dashboard.filterHintMonth', 'Past 30 days')
                    : t('dashboard.filterHintYear',  'Past 365 days')}
                </p>
              )}

              <div className="mt-5 border-t border-[#D9A441]/15 pt-4">
                <button onClick={() => navigate('/catalog')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F6F3F0] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] hover:bg-[#dde3d7] transition-colors">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {t('cart.startShopping')}
                </button>
              </div>
            </div>
          </div>

          {/* Orders list */}
          <div className="lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#13293D]">
                {t('dashboard.myOrders', { count: filteredOrders.length })}
              </h2>
              <span className="text-xs text-[#5A5A5A]">
                <span className="font-semibold text-[#13293D]">{filteredOrders.length}</span> {t('catalog.results', 'results')}
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9A441]/30 bg-white/40 py-20 text-center">
                <ShoppingBag className="h-12 w-12 text-[#13293D]/20" />
                <h3 className="mt-4 font-serif text-xl text-[#13293D]">
                  {filter === 'latest' ? t('dashboard.noOrders') : t('dashboard.noOrdersInRange', 'No orders in this period')}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[#5A5A5A]">
                  {filter === 'latest' ? t('dashboard.noOrdersHint') : t('dashboard.noOrdersRangeHint')}
                </p>
                {filter === 'latest' ? (
                  <button onClick={() => navigate('/catalog')}
                    className="mt-5 rounded-full bg-[#13293D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1a3a55] transition-all">
                    {t('catalog.pageTitle', 'Browse Collection')}
                  </button>
                ) : (
                  <button onClick={() => setFilter('latest')}
                    className="mt-5 rounded-full border border-[#13293D]/25 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] hover:bg-[#13293D]/5 transition-all">
                    {t('dashboard.showAll', 'Show all orders')}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    items={allItems[order.id] || []}
                    lang={lang}
                    t={t}
                    user={user}
                    userReviews={userReviews}
                    onReviewSubmitted={refreshReviews}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}