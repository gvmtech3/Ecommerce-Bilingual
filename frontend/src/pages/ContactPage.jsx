// src/pages/ContactPage.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Instagram, Linkedin } from 'lucide-react'

// Embedded Google Maps iframe — replace the API key or use embed URL for your address
const MAP_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.225!2d-73.9916342!3d40.7547072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18a45987%3A0x1e507d7c5429a092!2sGarment%20District%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`

const INPUT_CLASS =
  'w-full px-4 py-3.5 rounded-xl border border-[#13293D]/15 bg-white/70 text-[#13293D] placeholder:text-[#5A5A5A]/50 text-sm focus:outline-none focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 transition-all duration-200'

function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('') // '' | 'loading' | 'success'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  const INFO_ITEMS = [
    {
      icon: Mail,
      label: t('contact.emailLabel'),
      value: t('contact.email'),
      href: `mailto:${t('contact.email')}`,
    },
    {
      icon: Phone,
      label: t('contact.phoneLabel'),
      value: t('contact.phone'),
      href: `tel:${t('contact.phone')}`,
    },
    {
      icon: MapPin,
      label: t('contact.addressLabel'),
      value: `${t('contact.addressLine1')}\n${t('contact.addressLine2')}`,
      href: 'https://maps.google.com/?q=Garment+District+New+York',
    },
    {
      icon: Clock,
      label: t('contact.hoursLabel', 'Hours'),
      value: t('contact.hoursValue', 'Mon – Fri, 9 AM – 6 PM EST'),
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F6F3F0]">
      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#13293D] pb-24 pt-20">
        {/* Decorative diagonal stripe */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(-55deg, transparent, transparent 24px, #D9A441 24px, #D9A441 25px)`,
          }}
        />
        {/* Bottom wave cutout */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#F6F3F0]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }}
        />

        <div
          className="relative mx-auto max-w-3xl px-4 text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
        >
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
              {t('contact.eyebrow', "Let's Talk")}
            </p>
            <span className="h-px w-8 bg-[#D9A441]" />
          </span>
          <h1 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
            {t('contact.title')}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-4">

        {/* Top row: info cards + form */}
        <div className="grid gap-8 lg:grid-cols-5">

          {/* LEFT — Contact info (2/5) */}
          <div
            className="flex flex-col gap-4 lg:col-span-2 transition-all duration-700 delay-100"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
          >
            <div className="rounded-3xl border border-[#D9A441]/25 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="mb-6 font-serif text-xl text-[#13293D]">
                {t('contact.getInTouch')}
              </h3>

              <div className="space-y-1">
                {INFO_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="group flex items-start gap-4 rounded-2xl p-3.5 transition-all hover:bg-[#F6F3F0]"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D9A441]/15">
                      <Icon className="h-4 w-4 text-[#D9A441]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 whitespace-pre-line text-sm text-[#13293D] hover:text-[#D9A441] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 whitespace-pre-line text-sm text-[#13293D]">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#dde3d7] bg-[#dde3d7]/60 px-5 py-4">
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-400" />
              <p className="text-xs text-[#5A5A5A]">
                {t('contact.responseTime', 'We typically reply within 24 hours.')}
              </p>
            </div>
          </div>

          {/* RIGHT — Contact form (3/5) */}
          <div
            className="lg:col-span-3 transition-all duration-700 delay-200"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
          >
            {status === 'success' ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-green-200 bg-white/70 px-8 py-20 text-center shadow-sm backdrop-blur-sm">
                <CheckCircle className="h-14 w-14 text-green-500" />
                <h3 className="mt-5 font-serif text-2xl text-[#13293D]">
                  {t('contact.successTitle', 'Message Sent!')}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5A5A5A]">
                  {t('contact.success')}
                </p>
                <button
                  onClick={() => setStatus('')}
                  className="mt-8 rounded-full border border-[#13293D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#13293D] transition-all hover:bg-[#13293D] hover:text-white"
                >
                  {t('contact.sendAnother', 'Send another message')}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-[#D9A441]/25 bg-white/70 p-8 shadow-sm backdrop-blur-sm"
              >
                <h3 className="mb-6 font-serif text-xl text-[#13293D]">
                  {t('contact.formTitle', 'Send a Message')}
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className={INPUT_CLASS}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@brand.com"
                      className={INPUT_CLASS}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder={t('contact.subjectPlaceholder', 'e.g. Custom silk order inquiry')}
                    className={INPUT_CLASS}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    placeholder={t('contact.messagePlaceholder', 'Tell us about your project, question, or idea…')}
                    className={`${INPUT_CLASS} resize-none`}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#13293D] py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#1a3a55] hover:shadow-lg disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('contact.sending', 'Sending…')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-[10px] text-[#5A5A5A]/70">
                  {t('contact.privacyNote', 'We respect your privacy. Your information is never shared.')}
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── MAP SECTION ──────────────────────────────────────────────── */}
        <div
          className="mt-10 overflow-hidden rounded-3xl border border-[#D9A441]/25 shadow-sm transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
        >
          {/* Map header bar */}
          <div className="flex items-center justify-between bg-[#13293D] px-6 py-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#D9A441]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white">
                  {t('contact.findUs', 'Find Us')}
                </p>
                <p className="text-[10px] text-white/50">
                  {t('contact.addressLine1')}, {t('contact.addressLine2')}
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Garment+District+New+York"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#D9A441]/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#D9A441] transition-all hover:bg-[#D9A441] hover:text-[#13293D]"
            >
              {t('contact.getDirections', 'Get Directions')}
            </a>
          </div>

          {/* Embedded map */}
          <div className="relative h-72 w-full bg-[#dde3d7] md:h-96">
            <iframe
              src={MAP_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Linces'CKF Location"
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage