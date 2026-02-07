// src/pages/OrderSuccessPage.jsx
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function OrderSuccessPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="w-32 h-32 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
          Order Successfully Placed!
        </h1>
        <p className="text-xl text-[#5A5A5A] mb-12">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#13293D] text-white px-8 py-4 rounded-xl font-semibold uppercase tracking-wide hover:bg-[#0F1E35] shadow-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/customer')}
            className="flex-1 border border-[#13293D] text-[#13293D] px-8 py-4 rounded-xl font-semibold uppercase tracking-wide hover:bg-[#13293D] hover:text-white shadow-lg"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
