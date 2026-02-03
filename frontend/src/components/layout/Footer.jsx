// src/components/layout/Footer.jsx
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[#D9A441]/30 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-md text-[#5A5A5A] md:flex-row">
        <p>
          {t('footer.line1', { year })}
        </p>
        <p>
          {t('footer.line2')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
