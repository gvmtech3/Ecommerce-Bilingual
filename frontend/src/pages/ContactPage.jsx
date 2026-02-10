// src/pages/ContactPage.jsx - ✅ 100% BILINGUAL (Left side FIXED)
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send 
} from 'lucide-react'

function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('success')
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-[#F6F3F0]">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-4xl md:text-5xl text-[#13293D] mb-6">
            {t('contact.title') || 'Contact Us'}
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed">
            {t('contact.subtitle') || `Get in touch with us. We'd love to hear from you.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Contact Info - ✅ FULLY BILINGUAL */}
          <div className="space-y-8">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#D9A441]/20 shadow-xl">
              <h3 className="font-serif text-2xl text-[#13293D] mb-6 uppercase tracking-wide">
                {t('contact.getInTouch') || 'Get In Touch'}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 hover:bg-[#E9E0D8]/50 rounded-2xl transition-all">
                  <Mail className="h-6 w-6 text-[#D9A441] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#13293D]">
                      {t('contact.emailLabel') || 'Email'}
                    </p>
                    <a href="mailto:hello@lincesckf.com" className="text-[#5A5A5A] hover:text-[#13293D] transition-colors">
                      {t('contact.email') || 'hello@lincesckf.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-[#E9E0D8]/50 rounded-2xl transition-all">
                  <Phone className="h-6 w-6 text-[#D9A441] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#13293D]">
                      {t('contact.phoneLabel') || 'Phone'}
                    </p>
                    <p className="text-[#5A5A5A]">
                      {t('contact.phone') || '+1 (555) 123-4567'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-[#E9E0D8]/50 rounded-2xl transition-all">
                  <MapPin className="h-6 w-6 text-[#D9A441] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#13293D]">
                      {t('contact.addressLabel') || 'Address'}
                    </p>
                    <p className="text-[#5A5A5A]">
                      {t('contact.addressLine1') || '123 Silk Street'}<br/>
                      {t('contact.addressLine2') || 'Fashion District, NY 10001'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Already bilingual */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#D9A441]/20 shadow-xl space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#13293D] mb-2 uppercase tracking-wide">
                  {t('contact.form.name') || 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#13293D]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 bg-white/50 transition-all"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#13293D] mb-2 uppercase tracking-wide">
                  {t('contact.form.email') || 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#13293D]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 bg-white/50 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#13293D] mb-2 uppercase tracking-wide">
                  {t('contact.form.subject') || 'Subject'}
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#13293D]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 bg-white/50 transition-all"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#13293D] mb-2 uppercase tracking-wide">
                  {t('contact.form.message') || 'Message'}
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#13293D]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 bg-white/50 transition-all resize-vertical"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-[#13293D] to-[#1A365D] text-white py-4 px-6 rounded-2xl font-serif font-semibold uppercase tracking-widest text-lg shadow-xl hover:from-[#0F1E35] hover:shadow-[#13293D]/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {t('contact.form.submit') || 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="text-center py-4 bg-green-100 border border-green-200 text-green-800 rounded-xl animate-pulse">
                  {t('contact.success') || 'Message sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
