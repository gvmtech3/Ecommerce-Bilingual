import { useTranslation } from 'react-i18next'
import heroSilk from '../../assets/images/hero-silk.jpg'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section>
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 px-4 py-12 md:flex-row md:py-20">
        <div className="w-full md:w-1/2">
          <p className="text-md font-semibold uppercase tracking-[0.25em] text-[#ed5e25]">
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-[#13293D] md:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mt-4 max-w-md text-sm text-[#5A5A5A] md:text-base">
            {t('hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="rounded-full bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white"
            >
              {t('hero.primaryCta')}
            </button>
            <button
              onClick={() => navigate('/services')}
              className="rounded-full border border-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#13293D]"
            >
              {t('hero.secondaryCta')}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="aspect-4/5 w-full overflow-hidden rounded-3xl border border-[#D9A441]/60 bg-[#F6F3F0]">
            <img
              src={heroSilk}
              alt="Silk garment from Linces’CKF collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
