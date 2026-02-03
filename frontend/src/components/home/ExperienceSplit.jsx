import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function ExperienceSplit() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        {/* Customers */}
        <div className="group rounded-3xl border border-[#D9A441]/40 bg-[#F6F3F0] p-8 transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs uppercase tracking-[0.25em] text-[#5A5A5A]">
            {t('split.customersEyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[#13293D]">
            {t('split.customersTitle')}
          </h2>
          <p className="mt-3 text-sm text-[#5A5A5A]">
            {t('split.customersDescription')}
          </p>
          <button
            onClick={() => navigate('/auth?mode=signin')}
            className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#13293D] underline underline-offset-4"
          >
            {t('split.customersCta')}
          </button>
        </div>

        {/* Brands */}
        <div className="group rounded-3xl border border-[#13293D]/40 bg-[#13293D] p-8 text-white transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D9A441]">
            {t('split.brandsEyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-2xl">
            {t('split.brandsTitle')}
          </h2>
          <p className="mt-3 text-sm text-[#F6F3F0]/80">
            {t('split.brandsDescription')}
          </p>
          <button
            onClick={() => navigate('/services')}
            className="mt-6 text-xs font-semibold uppercase tracking-wide"
          >
            {t('split.brandsCta')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ExperienceSplit
