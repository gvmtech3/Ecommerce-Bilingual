import { useTranslation } from 'react-i18next'

function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language

  const base = 'text-md uppercase transition-colors'

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => i18n.changeLanguage('es')}
        className={
          current === 'es'
            ? `${base} font-semibold text-[#13293D]`
            : `${base} text-[#5A5A5A]`
        }
      >
        ES
      </button>
      <span className="text-[#5A5A5A]">/</span>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={
          current === 'en'
            ? `${base} font-semibold text-[#13293D]`
            : `${base} text-[#5A5A5A]`
        }
      >
        EN
      </button>
    </div>
  )
}

export default LanguageToggle
