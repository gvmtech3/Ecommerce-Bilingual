// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { PRODUCTS, CATEGORIES } from '../api/mockData'
import { reviewsApi } from '../api/resourcesApi'
import {
  ShoppingBag, ChevronLeft, Star, Minus, Plus,
  Heart, Share2, CheckCircle, Truck, RotateCcw, Shield,
  BadgeCheck
} from 'lucide-react'
import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'

// ── Constants ─────────────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGES = {
  '1': image1, '2': image2, '3': image3,
  '4': image1, '5': image2, '6': image3,
  '7': image1, '8': image2,
}
const getImage   = (p) => PLACEHOLDER_IMAGES[p.id] || image1
const getGallery = ()  => [image1, image2, image3]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLORS = [
  { name: 'Ivory',    nameEs: 'Marfil',     hex: '#F5F0E8' },
  { name: 'Midnight', nameEs: 'Medianoche', hex: '#13293D' },
  { name: 'Blush',    nameEs: 'Rosa palo',  hex: '#E8C4B0' },
  { name: 'Gold',     nameEs: 'Dorado',     hex: '#D9A441' },
]
const TAG_STYLES = {
  new:        { bg: '#ed5e25', text: '#fff'     },
  bestseller: { bg: '#D9A441', text: '#13293D'  },
  trending:   { bg: '#13293D', text: '#fff'     },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(cents, lang) {
  const dollars = cents / 100
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(dollars)
}

function calcAvgRating(reviews) {
  if (!reviews.length) return 0
  return +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
}

// ── Sub-components ────────────────────────────────────────────────────────────
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

// ── Individual review card ────────────────────────────────────────────────────
function ReviewCard({ review, lang }) {
  const title = lang === 'es' ? (review.titleEs || review.title) : review.title
  const body  = lang === 'es' ? (review.textEs  || review.text)  : review.text
  const dateStr = new Date(review.date).toLocaleDateString(
    lang === 'es' ? 'es-ES' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="rounded-2xl border border-[#D9A441]/15 bg-white/70 p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#13293D] text-xs font-bold text-[#D9A441]">
            {review.author?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[#13293D]">{review.author}</p>
              {review.verified && (
                <BadgeCheck className="h-3.5 w-3.5 text-[#D9A441]" aria-label="Verified purchase" />
              )}
            </div>
            <p className="text-[10px] text-[#5A5A5A]">{dateStr}</p>
          </div>
        </div>
        <StarDisplay rating={review.rating} />
      </div>

      {title && (
        <p className="mt-3 text-sm font-semibold text-[#13293D]">{title}</p>
      )}
      <p className="mt-1.5 text-sm leading-relaxed text-[#5A5A5A]">{body}</p>
    </div>
  )
}

// ── Reviews tab content ───────────────────────────────────────────────────────
function ReviewsTab({ productId, lang, t }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    reviewsApi.getByProduct(productId)
      .then(({ data }) => {
        if (!cancelled) {
          // Sort newest first
          setReviews([...data].sort((a, b) => new Date(b.date) - new Date(a.date)))
        }
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441]" />
      </div>
    )
  }

  const avgRating = calcAvgRating(reviews)
  const totalCount = reviews.length

  return (
    <div className="max-w-2xl space-y-5">

      {/* ── Summary card ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#D9A441]/20 bg-white/60 p-5 sm:flex-row sm:items-center">
        {/* Score */}
        <div className="flex shrink-0 flex-col items-center text-center sm:pr-5 sm:border-r sm:border-[#D9A441]/20">
          {totalCount > 0 ? (
            <>
              <p className="font-serif text-5xl font-bold leading-none text-[#13293D]">{avgRating}</p>
              <StarDisplay rating={Math.round(avgRating)} size="md" />
              <p className="mt-1.5 text-[10px] text-[#5A5A5A]">
                {totalCount} {t('catalog.reviews', 'reviews')}
              </p>
            </>
          ) : (
            <>
              <p className="font-serif text-3xl font-bold text-[#13293D]/30">—</p>
              <p className="mt-1 text-[10px] text-[#5A5A5A]">{t('review.noReviews', 'No reviews yet')}</p>
            </>
          )}
        </div>

        {/* Rating bar chart */}
        {totalCount > 0 && (
          <div className="flex-1 space-y-1.5">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length
              const pct   = totalCount > 0 ? (count / totalCount) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-[10px] text-[#5A5A5A]">{star}</span>
                  <Star className="h-3 w-3 shrink-0 fill-[#D9A441] text-[#D9A441]" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dde3d7]">
                    <div
                      className="h-full rounded-full bg-[#D9A441] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-3 text-[10px] text-[#5A5A5A]">{count}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {totalCount === 0 && (
        <div className="rounded-2xl border border-dashed border-[#D9A441]/25 bg-white/40 px-6 py-10 text-center">
          <Star className="mx-auto h-10 w-10 text-[#D9A441]/30" />
          <p className="mt-3 font-serif text-lg text-[#13293D]">
            {t('review.beFirst', 'Be the first to review this product')}
          </p>
          <p className="mt-1 text-xs text-[#5A5A5A]">
            {t('review.purchaseToReview', 'Purchase and receive your order to leave a review.')}
          </p>
        </div>
      )}

      {/* ── Individual review cards ────────────────────────────────────────── */}
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} lang={lang} />
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const { t, i18n }   = useTranslation()
  const lang           = i18n.language
  const { addToCart }  = useCart()

  const product  = PRODUCTS.find(p => p.id === id)
  const category = product ? CATEGORIES.find(c => c.id === product.categoryId) : null

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize,  setSelectedSize]  = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [quantity,      setQuantity]      = useState(1)
  const [adding,        setAdding]        = useState(false)
  const [added,         setAdded]         = useState(false)
  const [wishlist,      setWishlist]      = useState(false)
  const [visible,       setVisible]       = useState(false)
  const [activeTab,     setActiveTab]     = useState('description')

  // Live review count + avg shown in header & tab badge
  const [reviewSummary, setReviewSummary] = useState({ count: 0, avg: 0 })

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [id])

  // Reset state when navigating between products
  useEffect(() => {
    setSelectedImage(0)
    setSelectedSize('')
    setSelectedColor(COLORS[0])
    setQuantity(1)
    setAdded(false)
    setActiveTab('description')
  }, [id])

  // Pre-fetch review summary for the header rating row
  useEffect(() => {
    if (!id) return
    reviewsApi.getByProduct(id)
      .then(({ data }) => {
        setReviewSummary({
          count: data.length,
          avg:   calcAvgRating(data),
        })
      })
      .catch(() => {})
  }, [id])

  const relatedProducts = PRODUCTS
    .filter(p => p.categoryId === product?.categoryId && p.id !== id)
    .slice(0, 3)

  const handleAddToCart = async () => {
    if (!selectedSize) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 600))
    addToCart({ ...product, selectedSize, selectedColor: selectedColor.name, quantity })
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#F6F3F0] px-4 text-center">
        <span className="text-4xl">🧵</span>
        <h2 className="font-serif text-2xl text-[#13293D]">
          {t('catalog.productNotFound', 'Product not found')}
        </h2>
        <button onClick={() => navigate('/catalog')}
          className="rounded-full bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1a3a55] transition-all">
          {t('catalog.backToCollection', 'Back to Collection')}
        </button>
      </div>
    )
  }

  const gallery    = getGallery()
  const outOfStock = product.stock === 0
  const tag        = TAG_STYLES[product.tag]
  const name       = lang === 'es' ? product.nameEs      : product.name
  const description= lang === 'es' ? product.descriptionEs : product.description

  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5A5A5A]">
          <button onClick={() => navigate('/catalog')}
            className="flex items-center gap-1 hover:text-[#13293D] transition-colors">
            <ChevronLeft className="h-3 w-3" />
            {t('nav.collection')}
          </button>
          <span>/</span>
          <span className="text-[#13293D]">{lang === 'es' ? category?.nameEs : category?.name}</span>
          <span>/</span>
          <span className="max-w-40 truncate font-semibold text-[#13293D]">{name}</span>
        </nav>
      </div>

      {/* ── Main product area ───────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-6xl px-4 py-8 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT: Gallery */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Thumbnails */}
            <div className="flex flex-row gap-2 sm:flex-col">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === i ? 'border-[#D9A441]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white shadow-sm">
              <img src={gallery[selectedImage]} alt={name}
                className="h-full w-full object-cover" style={{ minHeight: '420px' }} />
              {product.tag && (
                <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow"
                  style={{ backgroundColor: tag.bg, color: tag.text }}>
                  {t(`catalog.tags.${product.tag}`, product.tag)}
                </span>
              )}
              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <span className="rounded-full bg-[#13293D] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white">
                    {t('catalog.outOfStock', 'Out of Stock')}
                  </span>
                </div>
              )}
              <button onClick={() => setWishlist(p => !p)}
                className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                  wishlist ? 'border-red-300 bg-red-50 text-red-400' : 'border-white/60 bg-white/80 text-[#5A5A5A] hover:text-red-400'
                }`}>
                <Heart className={`h-4 w-4 ${wishlist ? 'fill-red-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {lang === 'es' ? category?.nameEs : category?.name}
              </p>
              <h1 className="mt-1 font-serif text-3xl leading-tight text-[#13293D] md:text-4xl">{name}</h1>

              {/* Live rating row */}
              <div className="mt-2 flex items-center gap-3">
                {reviewSummary.count > 0 ? (
                  <>
                    <StarDisplay rating={Math.round(reviewSummary.avg)} size="md" />
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs text-[#5A5A5A] underline underline-offset-2 hover:text-[#13293D] transition-colors"
                    >
                      {reviewSummary.avg} · {reviewSummary.count} {t('catalog.reviews', 'reviews')}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[#5A5A5A]">
                    {t('review.noReviews', 'No reviews yet')}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#13293D]">
                {formatPrice(product.price, lang)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
                  {t('catalog.onlyLeft', `Only ${product.stock} left`, { count: product.stock })}
                </span>
              )}
            </div>

            {/* Colour */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('catalog.color', 'Colour')} —{' '}
                <span className="font-normal normal-case text-[#13293D]">
                  {lang === 'es' ? selectedColor.nameEs : selectedColor.name}
                </span>
              </p>
              <div className="flex gap-2">
                {COLORS.map(color => (
                  <button key={color.name} onClick={() => setSelectedColor(color)}
                    title={lang === 'es' ? color.nameEs : color.name}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name ? 'scale-110 border-[#13293D] shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('catalog.size', 'Size')}
                  {!selectedSize && (
                    <span className="ml-2 font-normal normal-case text-red-400">
                      {t('catalog.selectSize', '— select one')}
                    </span>
                  )}
                </p>
                <button className="text-[10px] text-[#D9A441] underline underline-offset-2">
                  {t('catalog.sizeGuide', 'Size guide')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-[#13293D] bg-[#13293D] text-white'
                        : 'border-[#13293D]/20 text-[#13293D] hover:border-[#D9A441]'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('catalog.quantity', 'Quantity')}
              </p>
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#13293D]/20">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-[#13293D] hover:bg-[#F6F3F0] transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-[#13293D]/20 text-sm font-semibold text-[#13293D]">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))}
                  className="flex h-10 w-10 items-center justify-center text-[#13293D] hover:bg-[#F6F3F0] transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || outOfStock || !selectedSize}
                className={`flex flex-1 items-center justify-center gap-2.5 rounded-2xl py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all disabled:opacity-50 ${
                  added ? 'bg-green-500' : 'bg-[#13293D] hover:bg-[#1a3a55] hover:shadow-lg'
                }`}
              >
                {adding ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : added ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                {adding
                  ? t('catalog.adding')
                  : added
                  ? t('catalog.added')
                  : !selectedSize
                  ? t('catalog.selectSizeFirst', 'Select a size')
                  : outOfStock
                  ? t('catalog.outOfStock', 'Out of Stock')
                  : t('catalog.addToCart')}
              </button>
              <button
                onClick={() => navigator.share?.({ title: name, url: window.location.href })}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#13293D]/20 text-[#5A5A5A] hover:border-[#D9A441] hover:text-[#13293D] transition-all">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {!selectedSize && (
              <p className="text-[10px] text-red-400">
                {t('catalog.sizeRequired', '* Please select a size before adding to cart')}
              </p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#D9A441]/15 bg-white/60 p-4">
              {[
                { icon: Truck,     labelKey: 'catalog.freeShipping',  def: 'Free Shipping'    },
                { icon: RotateCcw, labelKey: 'catalog.easyReturns',   def: '30-day Returns'   },
                { icon: Shield,    labelKey: 'catalog.securePayment', def: 'Secure Payment'   },
              ].map(({ icon: Icon, labelKey, def }) => (
                <div key={labelKey} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#dde3d7]">
                    <Icon className="h-3.5 w-3.5 text-[#13293D]" />
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                    {t(labelKey, def)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="mt-14 border-t border-[#D9A441]/20">
          <div className="flex border-b border-[#D9A441]/20">
            {['description', 'details', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#D9A441] text-[#13293D]'
                    : 'text-[#5A5A5A] hover:text-[#13293D]'
                }`}>
                {t(`catalog.tab_${tab}`, tab)}
                {tab === 'reviews' && reviewSummary.count > 0 && (
                  <span className="ml-1.5 text-[9px] text-[#D9A441]">({reviewSummary.count})</span>
                )}
              </button>
            ))}
          </div>

          <div className="py-8">

            {/* Description */}
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-sm leading-relaxed text-[#5A5A5A]">{description}</p>
                <ul className="mt-6 space-y-2">
                  {[
                    t('catalog.detail1', '100% pure silk'),
                    t('catalog.detail2', 'Dry clean or gentle hand wash'),
                    t('catalog.detail3', 'Made in our atelier — small-batch production'),
                    t('catalog.detail4', 'Model is 175cm and wears size S'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#5A5A5A]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A441]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Details */}
            {activeTab === 'details' && (
              <div className="max-w-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#D9A441]/15">
                    {[
                      [t('catalog.material','Material'), t('catalog.materialValue','100% Mulberry Silk')],
                      [t('catalog.weight',  'Weight'),   t('catalog.weightValue',  '16 momme')],
                      [t('catalog.origin',  'Origin'),   t('catalog.originValue',  'Made in our atelier')],
                      [t('catalog.care',    'Care'),     t('catalog.careValue',    'Dry clean recommended')],
                      [t('catalog.stock',   'Stock'),    product.stock > 0
                        ? `${product.stock} ${t('catalog.units','units')}`
                        : t('catalog.outOfStock','Out of Stock')],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-3 pr-8 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                          {label}
                        </td>
                        <td className="py-3 text-sm text-[#13293D]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews — live from reviewsApi */}
            {activeTab === 'reviews' && (
              <ReviewsTab productId={id} lang={lang} t={t} />
            )}

          </div>
        </div>

        {/* ── Related products ──────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-[#D9A441]/20 pt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-[#ed5e25]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ed5e25]">
                    {t('catalog.youMayAlsoLike', 'You may also like')}
                  </p>
                </span>
                <h3 className="mt-1 font-serif text-xl text-[#13293D]">
                  {t('catalog.relatedProducts', 'Related Products')}
                </h3>
              </div>
              <button onClick={() => navigate('/catalog')}
                className="text-xs font-semibold uppercase tracking-wide text-[#13293D] underline underline-offset-4 hover:text-[#D9A441] transition-colors">
                {t('categories.viewAll', 'View all')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {relatedProducts.map(related => {
                const relName = lang === 'es' ? related.nameEs : related.name
                return (
                  <div key={related.id}
                    onClick={() => { navigate(`/catalog/${related.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-4/3 overflow-hidden bg-[#F6F3F0]">
                      <img src={getImage(related)} alt={relName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 font-serif text-sm text-[#13293D] transition-colors group-hover:text-[#D9A441]">
                        {relName}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#13293D]">
                        {formatPrice(related.price, lang)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}