// src/components/home/AIRecommendations.jsx
// AI-driven personalized recommendations powered by Claude
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import image1 from '../../assets/images/about_2.jpg'
import image2 from '../../assets/images/auth-atelier.jpg'
import image3 from '../../assets/images/image3.jpg'
import image4 from '../../assets/images/image4.jpg'
import image5 from '../../assets/images/image5.jpg'
import image6 from '../../assets/images/image6.jpg'
import image7 from '../../assets/images/patnerships.jpg'

// Mock product catalog with real image URLs added
const PRODUCTS = [
  { 
    id: 1, 
    name: 'Silk Charmeuse Blouse', 
    nameEs: 'Blusa de Seda Charmeuse', 
    category: 'blouses', 
    price: 189, 
    tag: 'bestseller',
    imageUrl: image1
  },
  { 
    id: 2, 
    name: 'Flowing Silk Dress', 
    nameEs: 'Vestido de Seda Fluido', 
    category: 'dresses', 
    price: 295, 
    tag: 'new',
    imageUrl: image2
  },
  { 
    id: 3, 
    name: 'Handpainted Silk Scarf', 
    nameEs: 'Pañuelo de Seda Pintado a Mano', 
    category: 'scarves', 
    price: 95, 
    tag: 'new',
    imageUrl: image3
  },
  { 
    id: 4, 
    name: 'Classic Silk Shirt', 
    nameEs: 'Camisa Clásica de Seda', 
    category: 'shirts', 
    price: 165, 
    tag: 'bestseller',
    imageUrl: image4
  },
  { 
    id: 5, 
    name: 'Silk Lounge Robe', 
    nameEs: 'Bata de Seda Loungewear', 
    category: 'robes', 
    price: 245, 
    tag: 'trending',
    imageUrl: image5
  },
  { 
    id: 6, 
    name: 'Structured Silk Top', 
    nameEs: 'Top Estructurado de Seda', 
    category: 'tops', 
    price: 135, 
    tag: 'trending',
    imageUrl: image6
  },
  { 
    id: 7, 
    name: 'Midnight Silk Pajamas', 
    nameEs: 'Pijamas de Seda Nocturna', 
    category: 'sleepwear', 
    price: 210, 
    tag: 'bestseller',
    imageUrl: image7
  },
]

const TAG_COLORS = {
  new: { bg: '#ed5e25', text: 'white' },
  bestseller: { bg: '#D9A441', text: '#13293D' },
  trending: { bg: '#13293D', text: 'white' },
}

function ProductCard({ product, lang, onAddToCart }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const name = lang === 'es' ? product.nameEs : product.name
  const tagColors = TAG_COLORS[product.tag] || TAG_COLORS.new

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#D9A441]/30 bg-[#F6F3F0] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/auth`)}
    >
      {/* Product image - Replaced emojis with real images */}
      <div className="aspect-3/4 w-full overflow-hidden bg-[#dde3d7]">
        <img 
          src={product.imageUrl} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Tag */}
      <span
        className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
        style={{ backgroundColor: tagColors.bg, color: tagColors.text }}
      >
        {t(`catalog.tags.${product.tag}`, product.tag)}
      </span>

      {/* Info */}
      <div className="p-4 bg-white/50 backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">
          {t(`catalog.categories.${product.category}`, product.category)}
        </p>
        <h3 className="mt-1 font-serif text-sm text-[#13293D] truncate">{name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#13293D]">${product.price}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product)
            }}
            className="rounded-full bg-[#13293D] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1a3a55]"
          >
            {t('catalog.addToCart', 'Add')}
          </button>
        </div>
      </div>
    </div>
  )
}

function AIRecommendations() {
  const { t, i18n } = useTranslation()
  const lang = i18n?.language || 'en'
  const [loading, setLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [recommended, setRecommended] = useState(PRODUCTS.slice(0, 4))
  const [preference, setPreference] = useState('')
  const navigate = useNavigate();

  const fetchRecommendations = async (userPreference) => {
    setLoading(true)
    setAiMessage('')
    try {
      const systemPrompt = `You are a personal shopping assistant for Linces'CKF, a premium silk garment brand. 
Respond in ${lang === 'es' ? 'Spanish' : 'English'} only.
Given a user preference or occasion, suggest 1-2 sentences of warm, personal shopping advice and pick the best 4 product IDs from this list: ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, tag: p.tag })))}
Respond ONLY with valid JSON: { "message": "...", "productIds": [1,2,3,4] }`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE', // Make sure this is handled securely via backend in production
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Haiku is faster and cheaper for this use case
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPreference
                ? `I'm looking for: ${userPreference}`
                : lang === 'es'
                ? 'Muéstrame los mejores productos para empezar'
                : 'Show me the best pieces to get started',
            },
          ],
        }),
      })

      const data = await response.json()
      const text = data.content?.map((c) => c.text || '').join('') || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      setAiMessage(parsed.message || '')
      const ids = parsed.productIds || []
      const picks = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
      setRecommended(picks.length >= 2 ? picks : PRODUCTS.slice(0, 4))
    } catch (err) {
      console.error(err)
      // Fallback to default products on error
      setRecommended(PRODUCTS.slice(0, 4))
      setAiMessage(
        lang === 'es'
          ? 'Aquí tienes nuestra selección destacada de seda premium.'
          : 'Here are some of our featured silk pieces curated just for you.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Load default recommendations on mount
  useEffect(() => {
    fetchRecommendations('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const handleAddToCart = (product) => {
    navigate('/auth')
    console.log('Add to cart:', product)
  }

  const QUICK_FILTERS = [
    { label: t('ai.filterEveryday', 'Everyday'), value: 'everyday wear' },
    { label: t('ai.filterFormal', 'Formal'), value: 'formal occasion' },
    { label: t('ai.filterGift', 'Gift'), value: 'gift for someone special' },
    { label: t('ai.filterWork', 'Work'), value: 'work and office' },
  ]

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#ed5e25]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ed5e25]">
              {t('ai.eyebrow', 'Curated For You')}
            </p>
            <span className="h-px w-6 bg-[#ed5e25]" />
          </span>
          <h2 className="mt-2 font-serif text-2xl text-[#13293D] md:text-3xl">
            {t('ai.title', 'AI-Powered Recommendations')}
          </h2>
          <p className="mt-2 text-sm text-[#5A5A5A]">
            {t('ai.subtitle', 'Tell us what you need and we\'ll find your perfect silk match.')}
          </p>
        </div>

        {/* AI Search Bar */}
        <div className="mx-auto mb-6 max-w-xl">
          <div className="flex overflow-hidden rounded-full border border-[#D9A441]/50 bg-[#F6F3F0] shadow-sm focus-within:border-[#D9A441] focus-within:ring-2 focus-within:ring-[#D9A441]/20 transition-all">
            <input
              type="text"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRecommendations(preference)}
              placeholder={t('ai.inputPlaceholder', 'e.g. a gift, summer occasion, workwear…')}
              className="flex-1 bg-transparent px-5 py-3 text-sm text-[#13293D] placeholder:text-[#5A5A5A]/60 focus:outline-none"
            />
            <button
              onClick={() => fetchRecommendations(preference)}
              disabled={loading}
              className="m-1 rounded-full bg-[#13293D] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#1a3a55] disabled:opacity-60"
            >
              {loading ? '...' : t('ai.searchBtn', 'Find')}
            </button>
          </div>

          {/* Quick filter pills */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setPreference(f.value)
                  fetchRecommendations(f.value)
                }}
                className="rounded-full border border-[#13293D]/20 px-4 py-1.5 text-xs text-[#5A5A5A] transition-all hover:border-[#D9A441] hover:text-[#13293D]"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI message */}
        {aiMessage && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-[#D9A441]/30 bg-[#F6F3F0] px-5 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9A441] text-[10px] font-bold text-[#13293D]">
                AI
              </span>
              <p className="text-sm leading-relaxed text-[#5A5A5A]">{aiMessage}</p>
            </div>
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-[#F6F3F0] overflow-hidden border border-gray-100">
                <div className="aspect-3/4 bg-[#dde3d7]/50" />
                <div className="p-4 bg-white/50">
                  <div className="h-2 w-1/3 rounded bg-[#dde3d7]" />
                  <div className="mt-3 h-3 w-3/4 rounded bg-[#dde3d7]" />
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 w-1/4 rounded bg-[#dde3d7]" />
                    <div className="h-6 w-1/4 rounded-full bg-[#dde3d7]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {recommended.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AIRecommendations