import React, { useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { getMyProfile, updateProfile, updateProfileImage } from '../api/profile'
import { API_BASE_URL } from '../api/client'
import type { ProfileUpdate } from '../types'

export default function Profile() {
  const qc = useQueryClient()
  const { data: profile, isLoading } = useQuery('profile', getMyProfile)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<ProfileUpdate>({})
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  function syncForm() {
    if (profile) setForm({
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      bio: profile.bio ?? '',
      address: profile.address ?? '',
      location: profile.location ?? '',
    })
  }
  React.useEffect(() => { syncForm() }, [profile])

  async function handleImageUpload(file: File) {
    setUploading(true)
    try {
      await updateProfileImage(file)
      qc.invalidateQueries('profile')
      qc.invalidateQueries('dashboard')
    } catch { setError('Image upload failed.') }
    finally { setUploading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await updateProfile(form)
      qc.invalidateQueries('profile')
      qc.invalidateQueries('dashboard')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Failed to save profile.') }
    finally { setSaving(false) }
  }

  if (isLoading) return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="skeleton h-8 w-40" />
      <div className="wb-card space-y-4">
        <div className="skeleton h-24 w-24 rounded-2xl" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    </div>
  )

  const avatarSrc = profile?.profile_image ? `${API_BASE_URL}/${profile.profile_image}` : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Your Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your public identity and contact details.</p>
      </div>

      {error && (
        <div className="rounded-2xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>
      )}

      {/* Avatar Upload */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="wb-card">
        <h2 className="font-display text-base font-semibold text-white mb-5">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div
            className={`relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-soft ${dragOver ? 'ring-2 ring-brand-400' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f) }}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#6c3fff,#ec4899)' }}>
                {profile?.full_name?.[0] ?? '?'}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} className="wb-btn-ghost text-sm py-2">
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>
            <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Drop or click to change.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wb-card">
        <h2 className="font-display text-base font-semibold text-white mb-5">Personal Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Full Name</label>
              <input value={form.full_name ?? ''} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="Your full name" className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Phone</label>
              <input value={form.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 ..." className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Location</label>
              <input value={form.location ?? ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, Country" className="wb-input" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Address</label>
              <input value={form.address ?? ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Street address" className="wb-input" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Bio</label>
              <textarea rows={4} value={form.bio ?? ''} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Tell others about yourself…" className="wb-input resize-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="wb-btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saved && <span className="text-sm text-emerald-400">✓ Saved successfully!</span>}
          </div>
        </form>
      </motion.div>
    </div>
  )
}
