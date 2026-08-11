import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { getMyWorkerProfile, updateWorkerProfile } from '../api/workerProfile'
import StarRating from '../ui/StarRating'
import Badge from '../ui/Badge'
import type { WorkerProfileUpdate } from '../types'

const AVAILABILITY_OPTIONS = ['AVAILABLE', 'BUSY', 'OFFLINE'] as const

export default function WorkerProfile() {
  const qc = useQueryClient()
  const { data: wp, isLoading } = useQuery('worker-profile', getMyWorkerProfile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<WorkerProfileUpdate>({})

  React.useEffect(() => {
    if (wp) setForm({
      headline: wp.headline ?? '',
      skills: wp.skills ?? '',
      experience_years: wp.experience_years,
      hourly_rate: wp.hourly_rate,
      availability: wp.availability,
      portfolio_url: wp.portfolio_url ?? '',
      github_url: wp.github_url ?? '',
      linkedin_url: wp.linkedin_url ?? '',
    })
  }, [wp])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await updateWorkerProfile(form)
      qc.invalidateQueries('worker-profile')
      qc.invalidateQueries('dashboard')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Failed to save worker profile.') }
    finally { setSaving(false) }
  }

  if (isLoading) return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="skeleton h-8 w-48" />
      <div className="wb-card space-y-4">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-10 w-full" />)}
      </div>
    </div>
  )

  const skills = wp?.skills?.split(',').map((s) => s.trim()).filter(Boolean) ?? []

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Worker Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Your professional profile visible to potential employers.</p>
      </div>

      {/* Stats preview */}
      {wp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="wb-card flex flex-wrap items-center gap-6"
          style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.07))', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="text-center">
            <StarRating value={Math.round(wp.average_rating)} readonly size="sm" />
            <p className="text-[10px] text-slate-500 mt-1">{wp.average_rating.toFixed(1)} / 5.0</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{wp.completed_works}</div>
            <p className="text-[10px] text-slate-500">Jobs Done</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">${wp.hourly_rate}</div>
            <p className="text-[10px] text-slate-500">Per Hour</p>
          </div>
          <div className="text-center">
            <Badge status={wp.availability} />
            <p className="text-[10px] text-slate-500 mt-1">Availability</p>
          </div>
          {wp.is_verified && (
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-emerald-300"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              ✓ Verified Worker
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <div className="rounded-2xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>
      )}

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="wb-card">
        <h2 className="font-display text-base font-semibold text-white mb-5">Professional Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Professional Headline</label>
            <input value={form.headline ?? ''} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              placeholder="e.g. Full-Stack Developer · 5+ years" className="wb-input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Skills (comma-separated)</label>
            <input value={form.skills ?? ''} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="React, TypeScript, Node.js, Python…" className="wb-input" />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <span key={s} className="wb-chip border text-xs" style={{ background: 'rgba(108,63,255,0.12)', borderColor: 'rgba(108,63,255,0.25)', color: '#a99bff' }}>{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Experience (years)</label>
              <input type="number" min="0" max="50" value={form.experience_years ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, experience_years: +e.target.value }))} className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Hourly Rate ($)</label>
              <input type="number" min="1" value={form.hourly_rate ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, hourly_rate: +e.target.value }))} className="wb-input" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Availability Status</label>
              <div className="flex gap-3">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button type="button" key={opt} onClick={() => setForm((f) => ({ ...f, availability: opt }))}
                    className={`flex-1 rounded-2xl py-2.5 text-sm font-medium transition-soft ${form.availability === opt ? 'text-white' : 'text-slate-500'}`}
                    style={form.availability === opt
                      ? { background: opt === 'AVAILABLE' ? 'rgba(16,185,129,0.3)' : opt === 'BUSY' ? 'rgba(245,158,11,0.3)' : 'rgba(100,116,139,0.3)', border: `1px solid ${opt === 'AVAILABLE' ? 'rgba(16,185,129,0.5)' : opt === 'BUSY' ? 'rgba(245,158,11,0.5)' : 'rgba(100,116,139,0.5)'}` }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-slate-400">Links</label>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 w-24 text-xs">🌐 Portfolio</span>
              <input value={form.portfolio_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, portfolio_url: e.target.value }))}
                placeholder="https://yoursite.com" className="wb-input flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 w-24 text-xs">🐙 GitHub</span>
              <input value={form.github_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
                placeholder="https://github.com/..." className="wb-input flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 w-24 text-xs">💼 LinkedIn</span>
              <input value={form.linkedin_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/..." className="wb-input flex-1" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="wb-btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Worker Profile'}
            </button>
            {saved && <span className="text-sm text-emerald-400">✓ Saved!</span>}
          </div>
        </form>
      </motion.div>
    </div>
  )
}
