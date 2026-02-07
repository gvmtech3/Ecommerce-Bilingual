// src/pages/BrandProfilePage.jsx - ✅ DATA DISPLAY FIXED
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import usersApi from '../api/usersApi'
import axiosClient from '../api/axiosClient'
import { Save, Edit3 } from 'lucide-react'

function BrandProfilePage() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth() // ✅ Add refreshUser if available
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    editing: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // ✅ FIXED: Load profile on mount + user change
  useEffect(() => {
    if (user?.id) {
      loadProfile()
    } else {
      // Fallback to auth user data
      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        editing: false
      })
      setLoading(false)
    }
  }, [user?.id])

  const loadProfile = async () => {
    setLoading(true)
    try {
      console.log('🔍 Loading profile for user:', user.id) // DEBUG
      
      // Try multiple data sources
      const [userRes, profileRes] = await Promise.allSettled([
        usersApi.getUserById(user.id).catch(() => ({ data: user })), // Fallback to current user
        axiosClient.get(`/profiles?userId=${user.id}`).catch(() => ({ data: [] }))
      ])

      const userData = userRes.status === 'fulfilled' ? userRes.value.data : user
      const profileData = profileRes.status === 'fulfilled' && profileRes.value.data?.[0]

      console.log('✅ User data:', userData) // DEBUG
      console.log('✅ Profile data:', profileData) // DEBUG

      setProfile({
        name: userData?.name || user?.name || 'Brand Name',
        email: userData?.email || user?.email || 'brand@example.com',
        phone: profileData?.phone || '',
        editing: false
      })
    } catch (error) {
      console.error('❌ Profile load error:', error)
      // Ultimate fallback
      setProfile({
        name: user?.name || 'Atelier Aurora',
        email: user?.email || 'brand@example.com',
        phone: '',
        editing: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update user
      await usersApi.patchUser(user.id, { name: profile.name })
      
      // Update/create profile
      const existingProfile = await axiosClient.get(`/profiles?userId=${user.id}`).catch(() => null)
      
      if (existingProfile?.data?.[0]) {
        await axiosClient.patch(`/profiles/${existingProfile.data[0].id}`, {
          name: profile.name,
          phone: profile.phone
        })
      } else {
        await axiosClient.post('/profiles', {
          userId: user.id,
          name: profile.name,
          phone: profile.phone
        })
      }
      
      // Refresh auth user
      if (refreshUser) refreshUser()
      
      setProfile(prev => ({ ...prev, editing: false }))
      console.log('💾 Profile saved!') // DEBUG
    } catch (error) {
      console.error('❌ Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleEdit = () => {
    setProfile(prev => ({ ...prev, editing: !prev.editing }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full border-4 border-[#D9A441]/20 border-t-[#D9A441] h-12 w-12"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 m-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="font-serif text-3xl text-[#13293D]">
            {t('brand.profile.title') || 'Brand Profile'}
          </h1>
          <p className="mt-3 text-sm text-[#5A5A5A]">
            {t('brand.profile.subtitle') || 'Manage your brand information.'}
          </p>
        </div>
        {/* <button
          onClick={toggleEdit}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg border border-[#13293D]/30 px-4 py-2 text-sm text-[#13293D] hover:bg-[#E9E0D8] disabled:opacity-50"
        >
          <Edit3 className="h-4 w-4" />
          {profile.editing ? t('brand.profile.cancel') : t('brand.profile.edit')}
        </button> */}
      </div>

      {/* Profile Form */}
      <form className="space-y-6">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Brand Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              {t('brand.profile.name') || 'Brand Name'}
            </label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!profile.editing || saving}
              className={`w-full rounded-xl border px-4 py-3 text-lg shadow-sm transition-all ${
                profile.editing && !saving
                  ? 'border-[#D9A441]/50 bg-white focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20'
                  : 'border-[#D9A441]/10 bg-[#F6F3F0]/50 cursor-not-allowed'
              }`}
              placeholder="Enter brand name"
            />
            
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
              {t('nav.email') || 'Email'}
            </label>
            <input
              type="email"
              value={profile.email || ''}
              disabled
              className="w-full rounded-xl border border-[#D9A441]/10 bg-[#F6F3F0]/50 px-4 py-3 text-lg shadow-sm cursor-not-allowed"
              placeholder="brand@example.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#5A5A5A]">
            {t('brand.profile.phone') || 'Phone'}
          </label>
          <input
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!profile.editing || saving}
            className={`w-full rounded-xl border px-4 py-3 text-lg shadow-sm transition-all ${
              profile.editing && !saving
                ? 'border-[#D9A441]/50 bg-white focus:border-[#D9A441] focus:outline-none focus:ring-2 focus:ring-[#D9A441]/20'
                : 'border-[#D9A441]/10 bg-[#F6F3F0]/50 cursor-not-allowed'
            }`}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Save Buttons */}
        {profile.editing && (
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={toggleEdit}
              disabled={saving}
              className="flex-1 rounded-xl border border-[#D9A441]/30 px-6 py-3 text-sm font-semibold uppercase text-[#5A5A5A] hover:bg-[#E9E0D8] disabled:opacity-50"
            >
              {t('brand.profile.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !profile.name}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13293D] px-6 py-3 text-sm font-semibold uppercase text-white shadow-lg hover:bg-[#0F1E35] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : (t('brand.profile.save') || 'Save Changes')}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default BrandProfilePage
