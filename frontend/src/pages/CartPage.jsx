// src/pages/CartPage.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { ordersApi, orderItemsApi } from '../api/resourcesApi'
import {
  ShoppingBag, Trash2, Minus, Plus,
  CheckCircle, ArrowLeft, Lock, Truck, RotateCcw
} from 'lucide-react'
import { PRODUCTS } from '../api/mockData'
import image1 from '../assets/images/customer-silk.jpg'
import image2 from '../assets/images/story-silk-detail.jpg'
import image3 from '../assets/images/hero-silk.jpg'

// ── Helpers ───────────────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGES = {
  '1': image1, '2': image2, '3': image3,
  '4': image1, '5': image2, '6': image3,
  '7': image1, '8': image2,
}

// mockData prices are in cents (7500 = $75). Normalise to dollars for display.
const toDollars = (price) => (!price ? 0 : price > 500 ? price / 100 : price)

const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(n)

const getProductImage = (item) =>
  PLACEHOLDER_IMAGES[String(item.id)] || item.image || image1

const getProductName = (item, lang) => {
  const found = PRODUCTS.find(p => String(p.id) === String(item.id))
  if (found) return lang === 'es' ? found.nameEs : found.name
  return lang === 'es' ? (item.nameEs || item.name) : (item.name || item.nameEs || 'Product')
}

const INPUT_CLASS =
  'w-full rounded-xl border border-[#13293D]/20 bg-white/70 px-4 py-3 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/50 focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20 transition-all disabled:opacity-60'

// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:    user?.name  || '',
    email:   user?.email || '',
    phone:   '',
    address: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [visible,    setVisible]    = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }))

  // Normalise all cart prices to dollars for display
  const cartWithPrices = cart.map(item => ({
    ...item,
    priceUSD: toDollars(item.price),
  }))
  const totalItems = cartWithPrices.reduce((s, i) => s + (i.quantity || 1), 0)
  const subtotal   = cartWithPrices.reduce((s, i) => s + i.priceUSD * (i.quantity || 1), 0)

  const handleQuantityChange = (id, qty) => {
    if (qty >= 1) updateQuantity(id, qty)
  }

  // ── Checkout: persist order + items to mock store ─────────────────────────
  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSubmitting(true)

    try {
      // 1. Create the order header
      const { data: newOrder } = await ordersApi.create({
        userId:    user.id,
        orderDate: new Date().toISOString(),
        status:    'placed',
        total:     Math.round(subtotal * 100), // store in cents to match mockData convention
        shippingInfo: {
          name:    formData.name,
          email:   formData.email,
          phone:   formData.phone,
          address: formData.address,
        },
      })

      // 2. Create one orderItem per cart line
      await Promise.all(
        cartWithPrices.map(item =>
          orderItemsApi.create({
            orderId:          newOrder.id,
            productId:        String(item.id),
            quantity:         item.quantity || 1,
            priceAtPurchase:  Math.round(item.priceUSD * 100), // cents
            selectedSize:     item.selectedSize  || null,
            selectedColor:    item.selectedColor || null,
          })
        )
      )

      // 3. Clear cart and navigate
      clearCart()
      navigate('/order-success', { state: { orderId: newOrder.id } })
    } catch (err) {
      console.error('Checkout error:', err)
      setSubmitting(false)
    }
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#F6F3F0] px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#dde3d7]">
          <ShoppingBag className="h-12 w-12 text-[#13293D]/40" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-[#13293D]">{t('cart.emptyTitle')}</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5A5A5A]">{t('cart.emptySubtitle')}</p>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-8 flex items-center gap-2 rounded-full bg-[#13293D] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md hover:bg-[#1a3a55] transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          {t('cart.startShopping')}
        </button>
      </div>
    )
  }

  // ── Filled cart ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F6F3F0]">

      {/* ── Header band ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#13293D] pb-20 pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div
          className="relative mx-auto max-w-6xl px-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('cart.eyebrow', 'Your Order')}
            </p>
          </span>
          <h1 className="mt-3 font-serif text-4xl text-white">{t('cart.title')}</h1>
          <p className="mt-2 text-sm text-white/50">
            {totalItems} {totalItems === 1 ? t('cart.item', 'item') : t('cart.items')} · {formatUSD(subtotal)}
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-6xl px-4 pb-20 pt-4 transition-all duration-700 delay-100 lg:grid lg:grid-cols-5 lg:gap-10"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        {/* ── LEFT: Cart items (3/5) ─────────────────────────────────────────── */}
        <div className="space-y-4 lg:col-span-3">
          <button
            onClick={() => navigate('/catalog')}
            className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#5A5A5A] hover:text-[#13293D] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('cart.continueShopping', 'Continue shopping')}
          </button>

          {cartWithPrices.map((item) => {
            const itemName = getProductName(item, lang)
            const itemImg  = getProductImage(item)
            const qty      = item.quantity || 1

            return (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white/70 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
              >
                <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                  {/* Image */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F6F3F0] sm:h-28 sm:w-24">
                    <img src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base leading-snug text-[#13293D] line-clamp-2 sm:text-lg">
                          {itemName}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {item.selectedSize && (
                            <span className="rounded-full border border-[#13293D]/15 bg-[#F6F3F0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                              {t('catalog.size', 'Size')} {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="rounded-full border border-[#13293D]/15 bg-[#F6F3F0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 font-serif text-lg font-bold text-[#13293D]">
                        {formatUSD(item.priceUSD * qty)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      {/* Qty stepper */}
                      <div className="flex items-center overflow-hidden rounded-xl border border-[#13293D]/15">
                        <button
                          onClick={() => handleQuantityChange(item.id, qty - 1)}
                          disabled={qty <= 1}
                          className="flex h-8 w-8 items-center justify-center text-[#13293D] hover:bg-[#F6F3F0] transition-colors disabled:opacity-30"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-10 items-center justify-center border-x border-[#13293D]/15 text-sm font-semibold text-[#13293D]">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-[#13293D] hover:bg-[#F6F3F0] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs text-[#5A5A5A]">
                        {formatUSD(item.priceUSD)} {t('cart.perUnit', '/ unit')}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t('cart.remove')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Mobile summary */}
          <div className="rounded-2xl border border-[#D9A441]/20 bg-white/60 px-5 py-4 lg:hidden">
            <div className="flex justify-between text-sm">
              <span className="text-[#5A5A5A]">{t('cart.subtotal')}</span>
              <span className="font-semibold text-[#13293D]">{formatUSD(subtotal)}</span>
            </div>
            <div className="mt-1.5 flex justify-between text-sm">
              <span className="text-[#5A5A5A]">{t('cart.shipping')}</span>
              <span className="font-semibold text-green-600">{t('cart.freeShipping', 'FREE')}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-[#D9A441]/20 pt-3">
              <span className="font-serif text-lg font-bold text-[#13293D]">{t('cart.total')}</span>
              <span className="font-serif text-lg font-bold text-[#13293D]">{formatUSD(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Summary + form (2/5) ──────────────────────────────────── */}
        <div className="mt-6 lg:col-span-2 lg:mt-0">
          <div className="sticky top-24 space-y-4">

            {/* Order summary card */}
            <div className="rounded-3xl border border-[#D9A441]/20 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="font-serif text-lg text-[#13293D]">{t('cart.orderSummary')}</h3>
              <div className="mt-4 space-y-2">
                {cartWithPrices.map(item => (
                  <div
                    key={`sum-${item.id}-${item.selectedSize}`}
                    className="flex items-center justify-between gap-2 text-xs text-[#5A5A5A]"
                  >
                    <span className="line-clamp-1 flex-1">{getProductName(item, lang)}</span>
                    <span className="shrink-0">×{item.quantity || 1}</span>
                    <span className="shrink-0 font-semibold text-[#13293D]">
                      {formatUSD(item.priceUSD * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-[#D9A441]/15 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5A5A5A]">{t('cart.subtotal')} ({totalItems} {t('cart.items')})</span>
                  <span className="font-semibold text-[#13293D]">{formatUSD(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5A5A5A]">{t('cart.shipping')}</span>
                  <span className="font-semibold text-green-600">{t('cart.freeShipping', 'FREE')}</span>
                </div>
                <div className="flex justify-between border-t border-[#D9A441]/15 pt-3">
                  <span className="font-serif text-xl font-bold text-[#13293D]">{t('cart.total')}</span>
                  <span className="font-serif text-xl font-bold text-[#13293D]">{formatUSD(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Checkout form card */}
            <div className="rounded-3xl border border-[#D9A441]/20 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="mb-4 font-serif text-lg text-[#13293D]">
                {t('cart.shippingDetails', 'Shipping Details')}
              </h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('cart.form.fullName')}
                    </label>
                    <input type="text" required value={formData.name} onChange={set('name')}
                      className={INPUT_CLASS} placeholder={t('cart.form.namePlaceholder')} disabled={submitting} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('cart.form.email')}
                    </label>
                    <input type="email" required value={formData.email} onChange={set('email')}
                      className={INPUT_CLASS} placeholder="you@example.com" disabled={submitting} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                    {t('cart.form.phone')}
                  </label>
                  <input type="tel" value={formData.phone} onChange={set('phone')}
                    className={INPUT_CLASS} placeholder="+1 (555) 000-0000" disabled={submitting} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                    {t('cart.form.address')}
                  </label>
                  <textarea required rows={3} value={formData.address} onChange={set('address')}
                    className={`${INPUT_CLASS} resize-none`}
                    placeholder={t('cart.form.addressPlaceholder')} disabled={submitting} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#13293D] py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#1a3a55] hover:shadow-lg disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('cart.processing')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t('cart.proceedToPayment')}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-5 border-t border-[#D9A441]/15 pt-4">
                  {[
                    { icon: Lock,      label: t('cart.secure') },
                    { icon: Truck,     label: t('cart.freeShipping', 'Free shipping') },
                    { icon: RotateCcw, label: t('catalog.easyReturns', '30-day returns') },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                      <Icon className="h-4 w-4 text-[#D9A441]" />
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-[#5A5A5A]">{label}</span>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}