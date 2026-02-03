import { useTranslation } from 'react-i18next'
import storySilkDetail from '../../assets/images/story-silk-detail.jpg'

function BrandStoryTeaser() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#dde3d7]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 md:flex-row">
        <div className="w-full md:w-1/2">
          <p className="text-md font-semibold uppercase tracking-[0.25em] text-[#ed5e25]">
            {t('story.eyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[#13293D]">
            {t('story.title')}
          </h2>
          <p className="mt-4 text-sm text-[#5A5A5A]">
            {t('story.description')}
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <div className="aspect-4/3 w-full overflow-hidden rounded-3xl border border-[#D9A441]/40 bg-neutral-200">
            <img
              src={storySilkDetail}
              alt="Detail of silk fabric from Linces’CKF"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStoryTeaser
