// src/pages/OrderSuccessPage.jsx - ✅ 100% BILINGUAL
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function OrderSuccessPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="w-32 h-32 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
          {t('order.successTitle') || 'Order Successfully Placed!'}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#5A5A5A] mb-12 leading-relaxed max-w-lg mx-auto">
          {t('order.successMessage') || 'Thank you for your purchase. Your order has been confirmed and will be processed shortly.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-linear-to-r from-[#13293D] to-[#1A365D] text-white px-8 py-4 rounded-2xl font-serif font-semibold uppercase tracking-wider text-lg shadow-xl hover:from-[#0F1E35] hover:shadow-[#13293D]/25 hover:scale-[1.02] transition-all duration-300"
          >
            {t('order.continueShopping') || 'Continue Shopping'}
          </button>
          
          <button
            onClick={() => navigate('/customer')}
            className="flex-1 border-2 border-[#13293D]/50 text-[#13293D] px-8 py-4 rounded-2xl font-serif font-semibold uppercase tracking-wider text-lg hover:bg-[#13293D] hover:text-white hover:shadow-lg hover:border-[#13293D] transition-all duration-300 shadow-md"
          >
            {t('order.viewOrders') || 'View Orders'}
          </button>
        </div>

        {/* Order Number & Tracking */}
        <div className="mt-12 pt-12 border-t border-[#D9A441]/20 max-w-md mx-auto">
          <p className="text-sm text-[#5A5A5A] mb-4">
            {t('order.trackingInfo') || 'You will receive a confirmation email with your order number and tracking details shortly.'}
          </p>
          <div className="bg-[#F6F3F0]/50 p-6 rounded-2xl">
            <p className="text-xs text-[#5A5A5A] uppercase tracking-wide font-semibold mb-1">
              {t('order.orderNumber') || 'Order Number'}
            </p>
            <p className="font-mono text-lg font-bold text-[#13293D]">
              #ORD-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
