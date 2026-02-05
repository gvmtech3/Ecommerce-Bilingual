// src/pages/AuthPage.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import authHero from '../assets/images/auth-atelier.jpg'
import { useAuth } from '../hooks/useAuth'

function useModeFromQuery() {
  const location = useLocation()
  const [mode, setMode] = useState('signin')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qMode = params.get('mode')
    if (qMode === 'signup') setMode('signup')
    else setMode('signin')
  }, [location.search])

  return [mode, setMode]
}

function AuthPage() {
  const { t } = useTranslation()
  const [mode, setMode] = useModeFromQuery()
  const { loginAsCustomer, loginAsBrand, user } = useAuth()
  const navigate = useNavigate()

  const isSignup = mode === 'signup'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer')
      } else {
        navigate('/brand')
      }
    }
  }, [user, navigate])

  // temporary fake submit
  const handleFakeSubmit = (role) => {
    if (role === 'customer') {
      loginAsCustomer()
      navigate('/customer')
    } else {
      loginAsBrand()
      navigate('/brand')
    }
  }

  // SignIn fake submit
  const handleSigninSubmit = (e) => {
    e.preventDefault()
    // Simulate credentials check - for now use fake login
    loginAsCustomer() // Default to customer for signin
    navigate('/customer')
  }

  return (
    <div>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#D9A441]/40 bg-[#efd6c0] shadow-sm md:mt-10 md:flex-row">
        {/* Left: image + message (hidden on very small screens) */}
        <div className="relative hidden w-full bg-[#F6F3F0] md:block md:w-1/2">
          <div className="absolute inset-0">
            <img
              src={authHero}
              alt="Silk garment and atelier mood for Linces'CKF"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative flex h-full flex-col justify-end bg-linear-to-t from-black/55 via-black/10 to-transparent p-8 text-white">
            <h2 className="font-serif text-2xl">
              {t('auth.imageTitle')}
            </h2>
            <p className="mt-3 text-xs text-white/80">
              {t('auth.imageText')}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full px-4 py-8 md:w-1/2 md:px-8 md:py-10">
          {/* Tabs */}
          <div className="flex rounded-full bg-[#E9E0D8] p-1 text-xs font-semibold uppercase tracking-wide text-[#5A5A5A]">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full px-4 py-2 transition cursor-pointer ${
                !isSignup
                  ? 'bg-[#13293D] text-white'
                  : 'bg-transparent text-[#5A5A5A]'
              }`}
            >
              {t('nav.signIn')}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-4 py-2 transition cursor-pointer ${
                isSignup
                  ? 'bg-[#13293D] text-white'
                  : 'bg-transparent text-[#5A5A5A]'
              }`}
            >
              {t('nav.signUp')}
            </button>
          </div>

          {/* Title + subtitle */}
          <div className="mt-6">
            <h1 className="font-serif text-2xl text-[#13293D]">
              {isSignup ? t('auth.signupTitle') : t('auth.signinTitle')}
            </h1>
            <p className="mt-2 text-xs text-[#5A5A5A]">
              {isSignup ? t('auth.signupSubtitle') : t('auth.signinSubtitle')}
            </p>
          </div>

          {/* Form */}
          {isSignup ? (
            <SignupForm onFakeSubmit={handleFakeSubmit} />
          ) : (
            <SigninForm onSubmit={handleSigninSubmit} />
          )}

          {/* Switch link */}
          <div className="mt-6 text-center text-xs text-[#5A5A5A]">
            {!isSignup ? (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#13293D] underline underline-offset-4 cursor-pointer"
              >
                {t('auth.switchToSignup')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#13293D] underline underline-offset-4 cursor-pointer"
              >
                {t('auth.switchToSignin')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SigninForm({ onSubmit }) {
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 text-xs text-[#181818]">
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.email')}
        </label>
        <input
          type="email"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D]"
          placeholder="customer@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.password')}
        </label>
        <input
          type="password"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D]"
          placeholder="demo"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[11px] text-[#5A5A5A]">
          <input
            type="checkbox"
            className="h-3 w-3 rounded border border-[#13293D]/40 bg-[#F6F3F0]"
          />
          <span>{t('auth.rememberMe')}</span>
        </label>
        <button
          type="button"
          className="text-[11px] text-[#13293D] underline cursor-pointer underline-offset-4"
        >
          {t('auth.forgotPassword')}
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white cursor-pointer"
      >
        {t('auth.signinCta')}
      </button>
    </form>
  )
}

function SignupForm({ onFakeSubmit }) {
  const { t } = useTranslation()
  const [role, setRole] = useState('customer')

  const handleSubmit = (e) => {
    e.preventDefault()
    onFakeSubmit(role)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 text-xs text-[#181818]"
    >
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.email')}
        </label>
        <input
          type="email"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.password')}
        </label>
        <input
          type="password"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D]"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.confirmPassword')}
        </label>
        <input
          type="password"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D]"
          placeholder="••••••••"
        />
      </div>

      {/* Role selector */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.roleLabel')}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide cursor-pointer ${
              role === 'customer'
                ? 'border-[#13293D] bg-[#13293D] text-white'
                : 'border-[#13293D]/30 bg-[#F6F3F0] text-[#5A5A5A]'
            }`}
          >
            {t('auth.roleCustomer')}
          </button>
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide cursor-pointer ${
              role === 'brand'
                ? 'border-[#13293D] bg-[#13293D] text-white'
                : 'border-[#13293D]/30 bg-[#F6F3F0] text-[#5A5A5A]'
            }`}
          >
            {t('auth.roleBrand')}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white cursor-pointer"
      >
        {t('auth.signupCta')}
      </button>
    </form>
  )
}

export default AuthPage
