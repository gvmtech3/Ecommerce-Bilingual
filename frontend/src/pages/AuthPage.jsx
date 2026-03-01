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

  // Signup fake submit - redirects to signin
  const handleFakeSubmit = (role) => {
    // Store selected role in localStorage for signin
    localStorage.setItem('signupRole', role)
    setMode('signin') // Switch to signin tab
  }

  return (
    <div>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#D9A441]/40 bg-[#efd6c0] shadow-sm md:mt-10 md:flex-row">
        {/* Left: image + message */}
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
          <div className="flex rounded-full bg-[#E9E0D8] p-1 text-xs font-semibold uppercase tracking-wide">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full px-4 py-2 transition-all cursor-pointer ${
                !isSignup
                  ? 'bg-[#13293D] text-white shadow-md'
                  : 'bg-transparent text-[#5A5A5A] hover:text-[#13293D]'
              }`}
            >
              {t('nav.signIn')}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-4 py-2 transition-all cursor-pointer ${
                isSignup
                  ? 'bg-[#13293D] text-white shadow-md'
                  : 'bg-transparent text-[#5A5A5A] hover:text-[#13293D]'
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
            <SigninForm loginAsCustomer={loginAsCustomer} loginAsBrand={loginAsBrand} navigate={navigate} />
          )}

          {/* Switch link */}
          <div className="mt-6 text-center text-xs text-[#5A5A5A]">
            {!isSignup ? (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#13293D] underline underline-offset-4 hover:text-[#D9A441] cursor-pointer"
              >
                {t('auth.switchToSignup')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#13293D] underline underline-offset-4 hover:text-[#D9A441] cursor-pointer"
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

function SigninForm({ loginAsCustomer, loginAsBrand, navigate }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check credentials against your db.json
    const credentials = [
      { email: 'customer@example.com', password: 'demo', role: 'customer' },
      { email: 'brand@example.com', password: 'demo', role: 'brand' }
    ]

    const matchedUser = credentials.find(
      (cred) => cred.email === formData.email && cred.password === formData.password
    )

    setTimeout(() => {
      if (matchedUser) {
        // Use stored signup role or default to matched role
        const role = localStorage.getItem('signupRole') || matchedUser.role
        
        if (role === 'customer') {
          
          loginAsCustomer()
          navigate('/customer')
        } else {
          loginAsBrand()
          navigate('/brand')
        }
        // Clear stored role
        localStorage.removeItem('signupRole')
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 1000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs text-[#181818]">
      {error && (
        <div className="rounded-lg bg-red-50/80 border border-red-200 p-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.email')}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D] focus:ring-1 focus:ring-[#13293D]/20"
          placeholder="customer@example.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.password')}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D] focus:ring-1 focus:ring-[#13293D]/20"
          placeholder="demo"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[11px] text-[#5A5A5A]">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="h-3 w-3 rounded border border-[#13293D]/40 bg-[#F6F3F0] focus:ring-[#13293D]"
            disabled={loading}
          />
          <span>{t('auth.rememberMe')}</span>
        </label>
        <button
          type="button"
          className="text-[11px] text-[#13293D] underline underline-offset-4 hover:text-[#D9A441] cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {t('auth.forgotPassword')}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.email || !formData.password}
        className="mt-4 w-full rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0F1E35}"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            Signing In...
          </span>
        ) : (
          t('auth.signinCta')
        )}
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
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs text-[#181818]">
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.email')}
        </label>
        <input
          type="email"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D] focus:ring-1 focus:ring-[#13293D]/20"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.password')}
        </label>
        <input
          type="password"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D] focus:ring-1 focus:ring-[#13293D]/20"
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5A5A5A]">
          {t('auth.confirmPassword')}
        </label>
        <input
          type="password"
          className="block w-full rounded-full border border-[#13293D]/30 bg-[#F6F3F0] px-4 py-2 text-xs text-[#181818] outline-none focus:border-[#13293D] focus:ring-1 focus:ring-[#13293D]/20"
          placeholder="••••••••"
          required
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
            className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all cursor-pointer ${
              role === 'customer'
                ? 'border-[#13293D] bg-[#13293D] text-white shadow-md hover:bg-[#0F1E35]'
                : 'border-[#13293D]/30 bg-[#F6F3F0] text-[#5A5A5A] hover:border-[#13293D]/50'
            }`}
          >
            {t('auth.roleCustomer')}
          </button>
          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`flex-1 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all cursor-pointer ${
              role === 'brand'
                ? 'border-[#13293D] bg-[#13293D] text-white shadow-md hover:bg-[#0F1E35]'
                : 'border-[#13293D]/30 bg-[#F6F3F0] text-[#5A5A5A] hover:border-[#13293D]/50'
            }`}
          >
            {t('auth.roleBrand')}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-[#13293D] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#0F1E35] transition-all shadow-md"
      >
        {t('auth.signupCta')}
      </button>
    </form>
  )
}

export default AuthPage
