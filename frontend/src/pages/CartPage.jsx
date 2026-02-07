// src/pages/CartPage.jsx - COMPLETE BILINGUAL VERSION
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, Minus, Plus, CheckCircle } from 'lucide-react'

function CartPage() {
  const { t } = useTranslation()
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      updateQuantity(id, quantity)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // ✅ CLEAR CART ON SUCCESSFUL ORDER
    clearCart()
    
    setSubmitting(false)
    navigate('/order-success')
  }

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-28 h-28 mx-auto mb-12 bg-[#F6F3F0] rounded-3xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="h-16 w-16 text-[#5A5A5A]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
            {t('cart.emptyTitle') || 'Your Cart is Empty'}
          </h1>
          <p className="text-xl text-[#5A5A5A] mb-12 leading-relaxed max-w-md mx-auto">
            {t('cart.emptySubtitle') || "You haven't added any items to your cart yet."}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="inline-flex items-center gap-3 bg-linear-to-r from-[#13293D] to-[#1A365D] text-white px-10 py-5 rounded-3xl font-serif text-xl font-semibold uppercase tracking-wider shadow-2xl hover:from-[#0F1E35] hover:shadow-[#13293D]/25 hover:scale-[1.02] transition-all duration-300"
          >
            {t('cart.startShopping') || 'Start Shopping'}
          </button>
        </div>
      </div>
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = getCartTotal()

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-4">
            {t('cart.title') || 'Shopping Cart'}
          </h1>
          <p className="text-xl text-[#5A5A5A]">
            {t('cart.subtitle') || `Review your ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-[#D9A441]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-6 lg:gap-8">
                  {/* Product Image */}
                  <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-linear-to-br from-[#F6F3F0] to-[#E9E0D8] shadow-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl md:text-2xl text-[#13293D] mb-3 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-baseline justify-between mb-6">
                      <span className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
                        ${item.price.toFixed(0)}
                      </span>
                      <span className="text-sm text-[#5A5A5A] font-medium uppercase tracking-wide hidden md:inline">
                        per unit
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center bg-white/50 border-2 border-[#13293D]/20 rounded-2xl p-2 shadow-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#13293D]/30 hover:bg-[#E9E0D8] hover:border-[#13293D]/50 transition-all shadow-sm hover:shadow-md text-[#13293D] hover:scale-105"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        
                        <span className="w-16 text-center text-xl font-bold text-[#13293D] px-4 select-none">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#13293D]/30 hover:bg-[#E9E0D8] hover:border-[#13293D]/50 transition-all shadow-sm hover:shadow-md text-[#13293D] hover:scale-105"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold uppercase text-sm tracking-wide hover:scale-105 transition-all p-2 -m-2 rounded-xl hover:bg-red-50"
                        title={t('cart.remove') || 'Remove item'}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="hidden md:inline">{t('cart.remove') || 'Remove'}</span>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-bold text-[#13293D] tracking-tight">
                        ${(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-[#D9A441]/20 shadow-2xl">
              {/* Order Summary */}
              <div className="border-b border-[#D9A441]/20 pb-8 mb-8">
                <h3 className="font-serif text-2xl md:text-3xl text-[#13293D] mb-8">
                  {t('cart.orderSummary') || 'Order Summary'}
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-lg">
                    <span>{t('cart.totalItems') || 'Total Items'}:</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-xl">
                    <span>{t('cart.subtotal') || 'Subtotal'}:</span>
                    <span className="font-bold text-[#13293D]">${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#5A5A5A]">
                    <span>{t('cart.shipping') || 'Shipping'}:</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="pt-4 border-t border-[#D9A441]/20">
                    <div className="flex justify-between text-2xl md:text-3xl font-serif font-bold text-[#13293D]">
                      <span>{t('cart.total') || 'Total'}:</span>
                      <span>${subtotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A] mb-3">
                    {t('cart.form.fullName') || 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50 shadow-sm transition-all"
                    placeholder={t('cart.form.namePlaceholder') || 'John Doe'}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A] mb-3">
                    {t('cart.form.email') || 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-5 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50 shadow-sm transition-all"
                    placeholder="john@example.com"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A] mb-3">
                    {t('cart.form.phone') || 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-5 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50 shadow-sm transition-all"
                    placeholder="+1 (555) 123-4567"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A] mb-3">
                    {t('cart.form.address') || 'Shipping Address'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-5 border border-[#13293D]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D9A441]/30 bg-white/50 shadow-sm transition-all resize-vertical"
                    placeholder={t('cart.form.addressPlaceholder') || '123 Silk Street, Fashion District, NYC 10001'}
                    disabled={submitting}
                  />
                </div>

                {/* Checkout Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-6 px-8 rounded-3xl font-serif text-xl font-semibold uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 group ${
                    submitting
                      ? 'bg-[#5A5A5A]/80 cursor-not-allowed scale-95'
                      : 'bg-linear-to-r from-[#13293D] to-[#1A365D] hover:from-[#0F1E35] hover:to-[#13293D] hover:shadow-[#13293D]/25 hover:scale-[1.02] text-white'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{t('cart.processing') || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      <span>{t('cart.proceedToPayment') || 'Proceed to Payment'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Secure Payment Note */}
              <div className="mt-8 pt-8 border-t border-[#D9A441]/20 text-center">
                <p className="text-sm text-[#5A5A5A]">
                  🔒 {t('cart.secure') || 'Secure checkout with SSL encryption'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
