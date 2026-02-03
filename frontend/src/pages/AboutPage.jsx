import { useTranslation } from 'react-i18next'
import About1 from '../assets/images/about_1.jpg'
import About2 from '../assets/images/about_2.jpg'

function AboutPage() {
  const { t } = useTranslation()

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        {/* INTRO TEXT */}
        <div className="max-w-3xl">
          <p className="text-md font-semibold uppercase tracking-[0.25em] text-[#ed5e25]">
            {t('about.eyebrow')}
          </p>

          <h1 className="mt-4 font-serif text-3xl text-[#13293D] md:text-4xl">
            {t('about.title')}
          </h1>

          <p className="mt-4 text-sm text-[#5A5A5A] md:text-base">
            {t('about.intro1')}
          </p>

          <p className="mt-3 text-sm text-[#5A5A5A] md:text-base">
            {t('about.intro2')}
          </p>
        </div>

        {/* IMAGE + COPY SECTION */}
        <div className="mt-14 flex flex-col gap-10 md:flex-row">
          {/* LEFT */}
          <div className="md:w-1/2">
            <div className="overflow-hidden rounded-3xl border border-[#D9A441]/40">
              <img
                src={About1}
                alt="Customer wearing a silk outfit from Linces’CKF"
                className="h-105 w-full object-cover"
              />
            </div>

            <h2 className="mt-5 font-serif text-xl text-[#13293D]">
              {t('about.customerTitle')}
            </h2>

            <p className="mt-2 text-sm text-[#5A5A5A]">
              {t('about.customerText')}
            </p>
          </div>

          {/* RIGHT */}
          <div className="md:w-1/2">
            <div className="overflow-hidden rounded-3xl border border-[#D9A441]/40">
              <img
                src={About2}
                alt="Close-up of silk fabric used by Linces’CKF"
                className="h-105 w-full object-cover"
              />
            </div>

            <h2 className="mt-5 font-serif text-xl text-[#13293D]">
              {t('about.craftTitle')}
            </h2>

            <p className="mt-2 text-sm text-[#5A5A5A]">
              {t('about.craftText')}
            </p>
          </div>
        </div>

        {/* VALUES SECTION */}
        <div className="mt-16 flex flex-col gap-8 md:flex-row">
          <div className="flex-1 rounded-2xl border border-[#D9A441]/40 bg-[#F2EFEA] p-4">
            <h3 className="font-serif text-lg text-[#13293D]">
              {t('about.valuesQuietTitle')}
            </h3>
            <p className="mt-2 text-sm text-[#5A5A5A]">
              {t('about.valuesQuietText')}
            </p>
          </div>

          <div className="flex-1 rounded-2xl border border-[#D9A441]/40 bg-[#F2EFEA] p-4">
            <h3 className="font-serif text-lg text-[#13293D]">
              {t('about.valuesResponsibleTitle')}
            </h3>
            <p className="mt-2 text-sm text-[#5A5A5A]">
              {t('about.valuesResponsibleText')}
            </p>
          </div>

          <div className="flex-1 rounded-2xl border border-[#D9A441]/40 bg-[#F2EFEA] p-4">
            <h3 className="font-serif text-lg text-[#13293D]">
              {t('about.valuesCollabTitle')}
            </h3>
            <p className="mt-2 text-sm text-[#5A5A5A]">
              {t('about.valuesCollabText')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
