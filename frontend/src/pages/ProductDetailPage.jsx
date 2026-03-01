// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { PRODUCTS, CATEGORIES } from '../api/mockData'
import {
  ShoppingBag, ChevronLeft, Star, Minus, Plus,
  Heart, Share2, CheckCircle, Truck, RotateCcw, Shield
} from 'lucide-react'
import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'

const PLACEHOLDER_IMAGES = { '1': image1, '2': image2, '3': image3, '4': image1, '5': image2, '6': image3, '7': image1, '8': image2 }
const getImage = (p) => PLACEHOLDER_IMAGES[p.id] || image1
// Each product gets 3 "gallery" images (cycle through our 3 placeholders)
const getGallery = (p) => [image1, image2, image3]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLORS = [
  { name: 'Ivory',    nameEs: 'Marfil',    hex: '#F5F0E8' },
  { name: 'Midnight', nameEs: 'Medianoche', hex: '#13293D' },
  { name: 'Blush',    nameEs: 'Rosa palo', hex: '#E8C4B0' },
  { name: 'Gold',     nameEs: 'Dorado',    hex: '#D9A441' },
]

const TAG_STYLES = {
  new:        { bg: '#ed5e25', text: '#fff' },
  bestseller: { bg: '#D9A441', text: '#13293D' },
  trending:   { bg: '#13293D', text: '#fff' },
}

// Mock reviews
const REVIEWS = [
  { id: 1, author: 'Sophie M.', rating: 5, date: '2026-01-15', text: 'Absolutely stunning quality. The silk feels incredibly luxurious.', textEs: 'Calidad absolutamente impresionante. La seda se siente increíblemente lujosa.' },
  { id: 2, author: 'Elena R.',  rating: 5, date: '2026-01-28', text: 'Perfect fit, the drape is beautiful. Will definitely order again.', textEs: 'Talla perfecta, la caída es preciosa. Definitivamente volveré a pedir.' },
  { id: 3, author: 'Clara B.',  rating: 4, date: '2026-02-03', text: 'Gorgeous piece. The colour is even more beautiful in person.', textEs: 'Una pieza preciosa. El color es aún más bonito en persona.' },
]

function StarRating({ rating, size = 'sm' }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${i <= rating ? 'fill-[#D9A441] text-[#D9A441]' : 'text-[#D9A441]/25'}`} />
      ))}
    </div>
  )
}

function formatPrice(cents, lang) {
  const eur = cents / 100
  return lang === 'es'
    ? `${eur.toLocaleString('es-ES', { minimumFractionDigits: 0 })} $`
    : `$${eur.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { addToCart } = useCart()

  const product = PRODUCTS.find(p => p.id === id)
  const category = product ? CATEGORIES.find(c => c.id === product.categoryId) : null

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize,  setSelectedSize]  = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [quantity,      setQuantity]      = useState(1)
  const [adding,        setAdding]        = useState(false)
  const [added,         setAdded]         = useState(false)
  const [wishlist,      setWishlist]      = useState(false)
  const [visible,       setVisible]       = useState(false)
  const [activeTab,     setActiveTab]     = useState('description') // description | details | reviews

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [id])

  const relatedProducts = PRODUCTS
    .filter(p => p.categoryId === product?.categoryId && p.id !== id)
    .slice(0, 3)

  const handleAddToCart = async () => {
    if (!selectedSize) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 700))
    addToCart({ ...product, selectedSize, selectedColor: selectedColor.name, quantity })
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#F6F3F0] px-4 text-center">
        <span className="text-4xl">🧵</span>
        <h2 className="font-serif text-2xl text-[#13293D]">{t('catalog.productNotFound', 'Product not found')}</h2>
        <button onClick={() => navigate('/catalog')}
          className="rounded-full bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#1a3a55]">
          {t('catalog.backToCollection', 'Back to Collection')}
        </button>
      </div>
    )
  }

  const gallery = getGallery(product)
  const outOfStock = product.stock === 0
  const tag = TAG_STYLES[product.tag]
  const name = lang === 'es' ? product.nameEs : product.name
  const description = lang === 'es' ? product.descriptionEs : product.description
  const avgRating = 4.7

  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5A5A5A]">
          <button onClick={() => navigate('/catalog')} className="hover:text-[#13293D] transition-colors flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" />
            {t('nav.collection')}
          </button>
          <span>/</span>
          <span className="text-[#13293D]">{category?.name || ''}</span>
          <span>/</span>
          <span className="text-[#13293D] font-semibold truncate max-w-40">{name}</span>
        </nav>
      </div>

      {/* ── Main product section ───────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-6xl px-4 py-8 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT: Image gallery */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Thumbnails */}
            <div className="flex flex-row gap-2 sm:flex-col">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === i ? 'border-[#D9A441]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white shadow-sm">
              <img
                src={gallery[selectedImage]}
                alt={name}
                className="h-full w-full object-cover"
                style={{ minHeight: '420px' }}
              />
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
              {/* Wishlist */}
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
              {/* Rating row */}
              <div className="mt-2 flex items-center gap-3">
                <StarRating rating={Math.round(avgRating)} size="md" />
                <span className="text-xs text-[#5A5A5A]">
                  {avgRating} · {REVIEWS.length} {t('catalog.reviews', 'reviews')}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#13293D]">
                {formatPrice(product.price, lang)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
                  {t('catalog.onlyLeft', { count: product.stock }, `Only ${product.stock} left`)}
                </span>
              )}
            </div>

            {/* Color selector */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('catalog.color', 'Colour')} — <span className="font-normal normal-case text-[#13293D]">
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
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('catalog.size', 'Size')}
                  {!selectedSize && <span className="ml-2 font-normal normal-case text-red-400">{t('catalog.selectSize', '— select one')}</span>}
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
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">{t('catalog.quantity', 'Quantity')}</p>
              <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-[#13293D]/20 w-fit">
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
                ) : added ? <CheckCircle className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
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
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#13293D]/20 text-[#5A5A5A] hover:border-[#D9A441] hover:text-[#13293D] transition-all"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Size validation hint */}
            {!selectedSize && (
              <p className="text-[10px] text-red-400">{t('catalog.sizeRequired', '* Please select a size before adding to cart')}</p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#D9A441]/15 bg-white/60 p-4">
              {[
                { icon: Truck,      labelKey: 'catalog.freeShipping',  defaultLabel: 'Free Shipping' },
                { icon: RotateCcw,  labelKey: 'catalog.easyReturns',   defaultLabel: '30-day Returns' },
                { icon: Shield,     labelKey: 'catalog.securePayment', defaultLabel: 'Secure Payment' },
              ].map(({ icon: Icon, labelKey, defaultLabel }) => (
                <div key={labelKey} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#dde3d7]">
                    <Icon className="h-3.5 w-3.5 text-[#13293D]" />
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                    {t(labelKey, defaultLabel)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Details / Reviews ────────────────────────── */}
        <div className="mt-14 border-t border-[#D9A441]/20">
          <div className="flex gap-0 border-b border-[#D9A441]/20">
            {['description', 'details', 'reviews'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#D9A441] text-[#13293D]'
                    : 'text-[#5A5A5A] hover:text-[#13293D]'
                }`}
              >
                {t(`catalog.tab_${tab}`, tab)}
                {tab === 'reviews' && <span className="ml-1.5 text-[9px] text-[#D9A441]">({REVIEWS.length})</span>}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="leading-relaxed text-sm text-[#5A5A5A]">{description}</p>
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

            {activeTab === 'details' && (
              <div className="max-w-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#D9A441]/15">
                    {[
                      [t('catalog.material', 'Material'), t('catalog.materialValue', '100% Mulberry Silk')],
                      [t('catalog.weight',   'Weight'),   t('catalog.weightValue',   '16 momme')],
                      [t('catalog.origin',   'Origin'),   t('catalog.originValue',   'Made in our atelier')],
                      [t('catalog.care',     'Care'),     t('catalog.careValue',     'Dry clean recommended')],
                      [t('catalog.stock',    'Stock'),    product.stock > 0 ? `${product.stock} ${t('catalog.units','units')}` : t('catalog.outOfStock','Out of Stock')],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-3 pr-8 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">{label}</td>
                        <td className="py-3 text-sm text-[#13293D]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-5">
                {/* Summary */}
                <div className="flex items-center gap-5 rounded-2xl border border-[#D9A441]/20 bg-white/60 p-5">
                  <div className="text-center">
                    <p className="font-serif text-5xl font-bold text-[#13293D]">{avgRating}</p>
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <p className="mt-1 text-[10px] text-[#5A5A5A]">{REVIEWS.length} {t('catalog.reviews','reviews')}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(star => {
                      const count = REVIEWS.filter(r => r.rating === star).length
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-4 text-[10px] text-[#5A5A5A]">{star}</span>
                          <div className="flex-1 rounded-full bg-[#dde3d7] h-1.5 overflow-hidden">
                            <div className="h-full rounded-full bg-[#D9A441]" style={{ width: `${(count / REVIEWS.length) * 100}%` }} />
                          </div>
                          <span className="w-4 text-[10px] text-[#5A5A5A]">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Individual reviews */}
                {REVIEWS.map(review => (
                  <div key={review.id} className="rounded-2xl border border-[#D9A441]/15 bg-white/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13293D] text-xs font-bold text-[#D9A441]">
                          {review.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#13293D]">{review.author}</p>
                          <p className="text-[10px] text-[#5A5A5A]">{new Date(review.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#5A5A5A]">
                      {lang === 'es' ? review.textEs : review.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ───────────────────────────────────────────────── */}
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
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[#D9A441]/20 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-[#F6F3F0]">
                      <img src={getImage(related)} alt={relName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="font-serif text-sm text-[#13293D] group-hover:text-[#D9A441] transition-colors line-clamp-1">{relName}</p>
                      <p className="mt-1 text-sm font-bold text-[#13293D]">{formatPrice(related.price, lang)}</p>
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