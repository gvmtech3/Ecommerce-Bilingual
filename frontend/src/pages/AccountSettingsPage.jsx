// src/pages/AccountSettingsPage.jsx
// Single unified settings page for both customer and brand roles
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import usersApi from '../api/usersApi'
import axiosClient from '../api/axiosClient'
import {
  User, Lock, Bell, Save, Edit3, X,
  CheckCircle, Eye, EyeOff, ShoppingBag, Briefcase
} from 'lucide-react'

// ── Shared input style ────────────────────────────────────────────────────────
const inputBase =
  'w-full rounded-xl border px-4 py-3 text-sm text-[#13293D] transition-all duration-200 focus:outline-none'
const inputActive =
  `${inputBase} border-[#D9A441]/60 bg-white focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20`
const inputDisabled =
  `${inputBase} border-[#D9A441]/15 bg-[#F6F3F0]/60 cursor-not-allowed text-[#5A5A5A]`

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-[#F6F3F0]">
      <div className="relative mt-0.5 shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div
          className={`h-6 w-11 rounded-full transition-colors duration-200 ${
            checked ? 'bg-[#13293D]' : 'bg-[#D9A441]/30'
          }`}
        />
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#13293D]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#5A5A5A]">{description}</p>}
      </div>
    </label>
  )
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, subtitle, children, action }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#D9A441]/20 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#D9A441]/15 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#13293D]">
            <Icon className="h-4 w-4 text-[#D9A441]" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-[#13293D]">{title}</h2>
            {subtitle && <p className="text-xs text-[#5A5A5A]">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  )
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#13293D] px-5 py-4 text-white shadow-2xl animate-[fadeUp_0.3s_ease]">
      <CheckCircle className="h-5 w-5 text-[#D9A441]" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AccountSettingsPage() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth()

  const isCustomer = user?.role === 'customer'
  const isBrand    = user?.role === 'brand'

  // ── Profile state ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)

  // Brand-only extra fields
  const [brandExtra, setBrandExtra] = useState({ companySize: '', website: '', industry: '' })

  // ── Password state ─────────────────────────────────────────────────────────
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdError, setPwdError] = useState('')

  // ── Notification state ─────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailOrders:    true,
    emailMarketing: false,
    smsOrders:      false,
    smsMarketing:   false,
    // brand-only
    emailQuotes:    true,
    emailProjects:  true,
    smsQuotes:      false,
  })
  const [notifSaving, setNotifSaving] = useState(false)

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState('')

  // ── Load profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    ;(async () => {
      setProfileLoading(true)
      try {
        const [userRes, profileRes] = await Promise.allSettled([
          usersApi.getUserById(user.id),
          axiosClient.get(`/profiles?userId=${user.id}`),
        ])
        const ud = userRes.status === 'fulfilled' ? userRes.value.data : user
        const pd = profileRes.status === 'fulfilled' ? profileRes.value.data?.[0] : null
        setProfile({
          name:  ud?.name  || user?.name  || '',
          email: ud?.email || user?.email || '',
          phone: pd?.phone || '',
        })
        if (isBrand && pd) {
          setBrandExtra({
            companySize: pd.companySize || '',
            website:     pd.website     || '',
            industry:    pd.industry    || '',
          })
        }
      } catch {
        setProfile({ name: user?.name || '', email: user?.email || '', phone: '' })
      } finally {
        setProfileLoading(false)
      }
    })()
  }, [user?.id])

  // ── Save profile ───────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setProfileSaving(true)
    try {
      await usersApi.patchUser(user.id, { name: profile.name })
      const existing = await axiosClient.get(`/profiles?userId=${user.id}`).catch(() => null)
      const payload = { name: profile.name, phone: profile.phone, ...(isBrand ? brandExtra : {}) }
      if (existing?.data?.[0]) {
        await axiosClient.patch(`/profiles/${existing.data[0].id}`, payload)
      } else {
        await axiosClient.post('/profiles', { userId: user.id, ...payload })
      }
      if (refreshUser) refreshUser()
      setProfileEditing(false)
      setToast(t('settings.profileSaved', 'Profile updated successfully!'))
    } catch {
      setToast(t('settings.saveError', 'Something went wrong. Try again.'))
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Save password ──────────────────────────────────────────────────────────
  const savePassword = async () => {
    setPwdError('')
    if (pwd.next !== pwd.confirm) {
      setPwdError(t('settings.passwordMismatch', 'New passwords do not match.'))
      return
    }
    if (pwd.next.length < 8) {
      setPwdError(t('settings.passwordShort', 'Password must be at least 8 characters.'))
      return
    }
    setPwdSaving(true)
    try {
      await axiosClient.patch(`/users/${user.id}/password`, {
        currentPassword: pwd.current,
        newPassword: pwd.next,
      })
      setPwd({ current: '', next: '', confirm: '' })
      setToast(t('settings.passwordSaved', 'Password changed successfully!'))
    } catch {
      setPwdError(t('settings.passwordError', 'Current password is incorrect.'))
    } finally {
      setPwdSaving(false)
    }
  }

  // ── Save notifications ─────────────────────────────────────────────────────
  const saveNotifs = async () => {
    setNotifSaving(true)
    try {
      await axiosClient.patch(`/profiles/notifications/${user.id}`, notifs).catch(() => {})
      setToast(t('settings.notifSaved', 'Notification preferences saved!'))
    } finally {
      setNotifSaving(false)
    }
  }

  const toggleNotif = (key) => setNotifs((p) => ({ ...p, [key]: !p[key] }))

  // ── Password field helper ──────────────────────────────────────────────────
  const PwdField = ({ field, label }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">{label}</label>
      <div className="relative">
        <input
          type={showPwd[field] ? 'text' : 'password'}
          value={pwd[field]}
          onChange={(e) => setPwd((p) => ({ ...p, [field]: e.target.value }))}
          className={`${inputActive} pr-11`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPwd((p) => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#13293D]"
        >
          {showPwd[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441]" />
      </div>
    )
  }

  const RoleBadge = isCustomer
    ? () => (
        <span className="flex items-center gap-1.5 rounded-full bg-[#F6F3F0] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#13293D]">
          <ShoppingBag className="h-3 w-3" /> {t('auth.roleCustomer')}
        </span>
      )
    : () => (
        <span className="flex items-center gap-1.5 rounded-full bg-[#13293D]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#13293D]">
          <Briefcase className="h-3 w-3" /> {t('auth.roleBrand')}
        </span>
      )

  return (
    <>
      {/* Page */}
      <div className="min-h-screen bg-[#F6F3F0]">
        {/* Header band */}
        <div className="relative overflow-hidden bg-[#13293D] pb-20 pt-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `repeating-linear-gradient(-55deg,transparent,transparent 22px,#D9A441 22px,#D9A441 23px)`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F3F0]"
            style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
          <div className="relative mx-auto max-w-3xl px-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#D9A441]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
                {t('settings.eyebrow', 'My Account')}
              </p>
            </div>
            <h1 className="mt-3 font-serif text-4xl text-white">
              {t('settings.title', 'Account Settings')}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {t('settings.subtitle', 'Manage your profile, security, and notification preferences.')}
            </p>
            <div className="mt-4">
              <RoleBadge />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl space-y-6 px-4 pb-20 pt-2">

          {/* ── 1. PROFILE ──────────────────────────────────────────────── */}
          <SectionCard
            icon={User}
            title={t('settings.profileTitle', 'Profile Information')}
            subtitle={t('settings.profileSubtitle', 'Update your personal details')}
            action={
              profileEditing ? (
                <button
                  onClick={() => setProfileEditing(false)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#D9A441]/30 px-3 py-1.5 text-xs text-[#5A5A5A] hover:bg-[#F6F3F0]"
                >
                  <X className="h-3.5 w-3.5" /> {t('brand.profile.cancel')}
                </button>
              ) : (
                <button
                  onClick={() => setProfileEditing(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#13293D]/20 px-3 py-1.5 text-xs text-[#13293D] hover:bg-[#F6F3F0]"
                >
                  <Edit3 className="h-3.5 w-3.5" /> {t('brand.profile.edit')}
                </button>
              )
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {isBrand ? t('brand.profile.name') : t('settings.fullName', 'Full Name')}
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  disabled={!profileEditing || profileSaving}
                  className={profileEditing ? inputActive : inputDisabled}
                  placeholder="Your name"
                />
              </div>

              {/* Email — always read-only */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('contact.form.email', 'Email')}
                  <span className="ml-2 font-normal normal-case tracking-normal text-[#D9A441]">
                    {t('settings.readOnly', '(read-only)')}
                  </span>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={inputDisabled}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 sm:col-span-2 sm:max-w-xs">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                  {t('brand.profile.phone')}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  disabled={!profileEditing || profileSaving}
                  className={profileEditing ? inputActive : inputDisabled}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Brand-only extra fields */}
              {isBrand && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('settings.website', 'Website')}
                    </label>
                    <input
                      type="url"
                      value={brandExtra.website}
                      onChange={(e) => setBrandExtra((p) => ({ ...p, website: e.target.value }))}
                      disabled={!profileEditing || profileSaving}
                      className={profileEditing ? inputActive : inputDisabled}
                      placeholder="https://yourbrand.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('settings.industry', 'Industry')}
                    </label>
                    <input
                      type="text"
                      value={brandExtra.industry}
                      onChange={(e) => setBrandExtra((p) => ({ ...p, industry: e.target.value }))}
                      disabled={!profileEditing || profileSaving}
                      className={profileEditing ? inputActive : inputDisabled}
                      placeholder="Fashion, Luxury, etc."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2 sm:max-w-xs">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                      {t('settings.companySize', 'Company Size')}
                    </label>
                    <select
                      value={brandExtra.companySize}
                      onChange={(e) => setBrandExtra((p) => ({ ...p, companySize: e.target.value }))}
                      disabled={!profileEditing || profileSaving}
                      className={profileEditing ? inputActive : inputDisabled}
                    >
                      <option value="">Select…</option>
                      {['1–10', '11–50', '51–200', '201–500', '500+'].map((s) => (
                        <option key={s} value={s}>{s} {t('settings.employees', 'employees')}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {profileEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={profileSaving || !profile.name}
                  className="flex items-center gap-2 rounded-xl bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-[#1a3a55] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {profileSaving
                    ? t('settings.saving', 'Saving…')
                    : t('brand.profile.save')}
                </button>
              </div>
            )}
          </SectionCard>

          {/* ── 2. PASSWORD ─────────────────────────────────────────────── */}
          <SectionCard
            icon={Lock}
            title={t('settings.passwordTitle', 'Change Password')}
            subtitle={t('settings.passwordSubtitle', 'Keep your account secure')}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <PwdField field="current" label={t('settings.currentPassword', 'Current Password')} />
              </div>
              <PwdField field="next"    label={t('settings.newPassword', 'New Password')} />
              <PwdField field="confirm" label={t('settings.confirmPassword', 'Confirm New Password')} />
            </div>

            {pwdError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-600 border border-red-100">
                {pwdError}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={savePassword}
                disabled={pwdSaving || !pwd.current || !pwd.next || !pwd.confirm}
                className="flex items-center gap-2 rounded-xl bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-[#1a3a55] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {pwdSaving
                  ? t('settings.saving', 'Saving…')
                  : t('settings.updatePassword', 'Update Password')}
              </button>
            </div>
          </SectionCard>

          {/* ── 3. NOTIFICATIONS ────────────────────────────────────────── */}
          <SectionCard
            icon={Bell}
            title={t('settings.notifTitle', 'Notification Preferences')}
            subtitle={t('settings.notifSubtitle', 'Choose how you hear from us')}
          >
            {/* Email */}
            <div className="mb-2">
              <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('settings.emailNotifs', 'Email Notifications')}
              </p>
              <div className="mt-2 divide-y divide-[#D9A441]/10 rounded-2xl border border-[#D9A441]/15 overflow-hidden">
                <Toggle
                  checked={notifs.emailOrders}
                  onChange={() => toggleNotif('emailOrders')}
                  label={t('settings.emailOrders', isCustomer ? 'Order updates' : 'Order & production updates')}
                  description={t('settings.emailOrdersDesc', 'Confirmations, shipping, and delivery status')}
                />
                {isBrand && (
                  <>
                    <Toggle
                      checked={notifs.emailQuotes}
                      onChange={() => toggleNotif('emailQuotes')}
                      label={t('settings.emailQuotes', 'Quote responses')}
                      description={t('settings.emailQuotesDesc', 'When your quote requests receive a reply')}
                    />
                    <Toggle
                      checked={notifs.emailProjects}
                      onChange={() => toggleNotif('emailProjects')}
                      label={t('settings.emailProjects', 'Project milestones')}
                      description={t('settings.emailProjectsDesc', 'Updates on sampling, production, and delivery stages')}
                    />
                  </>
                )}
                <Toggle
                  checked={notifs.emailMarketing}
                  onChange={() => toggleNotif('emailMarketing')}
                  label={t('settings.emailMarketing', 'News & promotions')}
                  description={t('settings.emailMarketingDesc', 'New collections, offers, and brand updates')}
                />
              </div>
            </div>

            {/* SMS */}
            <div className="mt-5">
              <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A5A]">
                {t('settings.smsNotifs', 'SMS Notifications')}
              </p>
              <div className="mt-2 divide-y divide-[#D9A441]/10 rounded-2xl border border-[#D9A441]/15 overflow-hidden">
                <Toggle
                  checked={notifs.smsOrders}
                  onChange={() => toggleNotif('smsOrders')}
                  label={t('settings.smsOrders', 'Order alerts via SMS')}
                  description={t('settings.smsOrdersDesc', 'Text messages for key order status changes')}
                />
                {isBrand && (
                  <Toggle
                    checked={notifs.smsQuotes}
                    onChange={() => toggleNotif('smsQuotes')}
                    label={t('settings.smsQuotes', 'Quote alerts via SMS')}
                    description={t('settings.smsQuotesDesc', 'Text when a quote response is ready')}
                  />
                )}
                <Toggle
                  checked={notifs.smsMarketing}
                  onChange={() => toggleNotif('smsMarketing')}
                  label={t('settings.smsMarketing', 'Promotions via SMS')}
                  description={t('settings.smsMarketingDesc', 'Exclusive deals and new arrival alerts')}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveNotifs}
                disabled={notifSaving}
                className="flex items-center gap-2 rounded-xl bg-[#13293D] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-[#1a3a55] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {notifSaving
                  ? t('settings.saving', 'Saving…')
                  : t('settings.saveNotifs', 'Save Preferences')}
              </button>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Fade-up keyframe */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}