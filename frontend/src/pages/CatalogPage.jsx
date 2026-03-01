// src/pages/CatalogPage.jsx
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import {
  ShoppingBag, Filter, ChevronDown, ChevronLeft,
  ChevronRight, X, ArrowUpDown, Search, SlidersHorizontal
} from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '../api/mockData'
import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'

// Map product ids to placeholder images (replace with real imageUrl when available)
const PLACEHOLDER_IMAGES = { '1': image1, '2': image2, '3': image3, '4': image1, '5': image2, '6': image3, '7': image1, '8': image2 }
const getImage = (p) => PLACEHOLDER_IMAGES[p.id] || image1

const TAG_STYLES = {
  new:        { bg: '#ed5e25', text: '#fff' },
  bestseller: { bg: '#D9A441', text: '#13293D' },
  trending:   { bg: '#13293D', text: '#fff' },
}

const SORT_OPTIONS = [
  { value: 'default',    labelKey: 'catalog.sortDefault' },
  { value: 'price_asc',  labelKey: 'catalog.sortPriceAsc' },
  { value: 'price_desc', labelKey: 'catalog.sortPriceDesc' },
  { value: 'name_asc',   labelKey: 'catalog.sortNameAz' },
]

const ITEMS_PER_PAGE = 6 // for infinite scroll chunks

function formatPrice(cents, lang) {
  const eur = cents / 100
  return lang === 'es'
    ? `${eur.toLocaleString('es-ES', { minimumFractionDigits: 0 })} $`
    : `$${eur.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

function getCategoryName(cat, t) {
  if (cat === 'all') return t('catalog.all')
  return t(`catalog.categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, addingId, addedId, t, lang, onClick }) {
  const tag = TAG_STYLES[product.tag]
  const isAdding = addingId === product.id
  const isAdded  = addedId  === product.id
  const outOfStock = product.stock === 0

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D9A441]/50 hover:shadow-xl"
      onClick={() => onClick(product.id)}
    >
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#F6F3F0]">
        <img
          src={getImage(product)}
          alt={lang === 'es' ? product.nameEs : product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Tag badge */}
        {product.tag && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: tag.bg, color: tag.text }}
          >
            {t(`catalog.tags.${product.tag}`, product.tag)}
          </span>
        )}
        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              {t('catalog.outOfStock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
          {getCategoryName(
            CATEGORIES.find(c => c.id === product.categoryId)?.name?.toLowerCase() || '',
            t
          )}
        </p>
        <h3 className="mt-1 font-serif text-base leading-snug text-[#13293D] group-hover:text-[#D9A441] transition-colors line-clamp-2">
          {lang === 'es' ? product.nameEs : product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-serif text-lg font-bold text-[#13293D]">
            {formatPrice(product.price, lang)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); !outOfStock && onAddToCart(product) }}
            disabled={isAdding || outOfStock}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all disabled:opacity-50 ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-[#13293D] text-white hover:bg-[#1a3a55]'
            }`}
          >
            {isAdding ? (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <ShoppingBag className="h-3.5 w-3.5" />
            )}
            {isAdding ? t('catalog.adding') : isAdded ? t('catalog.added') : t('catalog.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy]                     = useState('default')
  const [search, setSearch]                     = useState('')
  const [showFilters, setShowFilters]           = useState(false)
  const [showSort, setShowSort]                 = useState(false)
  const [addingId, setAddingId]                 = useState(null)
  const [addedId, setAddedId]                   = useState(null)
  const [visibleCount, setVisibleCount]         = useState(ITEMS_PER_PAGE)
  const [visible, setVisible]                   = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // ── Filter + sort + search ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...PRODUCTS]

    // Category filter
    if (selectedCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.name.toLowerCase() === selectedCategory)
      if (cat) list = list.filter(p => p.categoryId === cat.id)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameEs.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'price_asc')  list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'name_asc')   list.sort((a, b) => (lang === 'es' ? a.nameEs.localeCompare(b.nameEs) : a.name.localeCompare(b.name)))

    return list
  }, [selectedCategory, sortBy, search, lang])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // ── Infinite scroll via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    if (!loaderRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore) setVisibleCount(c => c + ITEMS_PER_PAGE) },
      { threshold: 0.1 }
    )
    obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [hasMore])

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE) }, [selectedCategory, sortBy, search])

  const handleAddToCart = useCallback(async (product) => {
    setAddingId(product.id)
    await new Promise(r => setTimeout(r, 700))
    addToCart(product)
    setAddingId(null)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 2000)
  }, [addToCart])

  const categories = ['all', ...CATEGORIES.map(c => c.name.toLowerCase())]

  const activeFiltersCount = [selectedCategory !== 'all', sortBy !== 'default', search.trim() !== ''].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#13293D] pb-20 pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('nav.collection')}
            </p>
            <span className="h-px w-8 bg-[#D9A441]" />
          </span>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {t('catalog.pageTitle', 'Our Silk Collection')}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            {t('catalog.subtitle')}
          </p>
        </div>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-[#D9A441]/20 bg-[#F6F3F0]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">

          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('catalog.searchPlaceholder', 'Search products…')}
              className="w-full rounded-xl border border-[#13293D]/15 bg-white py-2.5 pl-9 pr-4 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/50 focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#13293D]">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => { setShowFilters(p => !p); setShowSort(false) }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                showFilters || selectedCategory !== 'all'
                  ? 'border-[#13293D] bg-[#13293D] text-white'
                  : 'border-[#13293D]/20 bg-white text-[#13293D] hover:border-[#D9A441]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t('catalog.filter')}
              {selectedCategory !== 'all' && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D9A441] text-[9px] font-bold text-[#13293D]">1</span>}
            </button>

            {showFilters && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white shadow-xl">
                {categories.map(cat => (
                  <button key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowFilters(false) }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#F6F3F0] ${
                      selectedCategory === cat ? 'text-[#D9A441]' : 'text-[#13293D]'
                    }`}
                  >
                    {getCategoryName(cat, t)}
                    {selectedCategory === cat && <span className="h-1.5 w-1.5 rounded-full bg-[#D9A441]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort button */}
          <div className="relative">
            <button
              onClick={() => { setShowSort(p => !p); setShowFilters(false) }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                showSort || sortBy !== 'default'
                  ? 'border-[#13293D] bg-[#13293D] text-white'
                  : 'border-[#13293D]/20 bg-white text-[#13293D] hover:border-[#D9A441]'
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {t('catalog.sort', 'Sort')}
              {sortBy !== 'default' && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D9A441] text-[9px] font-bold text-[#13293D]">1</span>}
            </button>

            {showSort && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white shadow-xl">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#F6F3F0] ${
                      sortBy === opt.value ? 'text-[#D9A441]' : 'text-[#13293D]'
                    }`}
                  >
                    {t(opt.labelKey, opt.value)}
                    {sortBy === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-[#D9A441]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active filter chips */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setSelectedCategory('all'); setSortBy('default'); setSearch('') }}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-red-500 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
              {t('catalog.clearAll', 'Clear all')}
            </button>
          )}

          {/* Count */}
          <p className="ml-auto hidden text-xs text-[#5A5A5A] sm:block">
            <span className="font-semibold text-[#13293D]">{filtered.length}</span> {t('catalog.results', 'results')}
          </p>
        </div>
      </div>

      {/* Click-outside overlay for dropdowns */}
      {(showFilters || showSort) && (
        <div className="fixed inset-0 z-20" onClick={() => { setShowFilters(false); setShowSort(false) }} />
      )}

      {/* ── Product grid ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8">

        {/* Active category label */}
        {selectedCategory !== 'all' && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-semibold text-[#13293D]">
              {getCategoryName(selectedCategory, t)}
            </span>
            <button onClick={() => setSelectedCategory('all')} className="text-[#5A5A5A] hover:text-[#13293D]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dde3d7] text-3xl">🧵</div>
            <h3 className="mt-4 font-serif text-xl text-[#13293D]">{t('catalog.noResults', 'No products found')}</h3>
            <p className="mt-2 text-sm text-[#5A5A5A]">{t('catalog.noResultsHint', 'Try adjusting your filters or search term.')}</p>
            <button onClick={() => { setSelectedCategory('all'); setSearch('') }}
              className="mt-5 rounded-full border border-[#13293D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] hover:bg-[#13293D] hover:text-white transition-all">
              {t('catalog.clearAll', 'Clear all')}
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, i) => (
            <div key={product.id}
              className="transition-all duration-500"
              style={{ opacity: 1, animationDelay: `${(i % ITEMS_PER_PAGE) * 60}ms` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                addingId={addingId}
                addedId={addedId}
                t={t}
                lang={lang}
                onClick={(id) => navigate(`/catalog/${id}`)}
              />
            </div>
          ))}
        </div>

        {/* Infinite scroll loader */}
        {hasMore && (
          <div ref={loaderRef} className="mt-12 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A441]/30 border-t-[#D9A441]" />
            <p className="text-xs text-[#5A5A5A]">{t('catalog.loadingMore', 'Loading more…')}</p>
          </div>
        )}

        {/* End of results */}
        {!hasMore && filtered.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-16 bg-[#D9A441]/40" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('catalog.allLoaded', 'All products shown')}
              </span>
              <span className="h-px w-16 bg-[#D9A441]/40" />
            </div>
            <p className="text-xs text-[#5A5A5A]">
              {filtered.length} {t('catalog.results', 'results')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}