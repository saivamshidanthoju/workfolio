import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { getMyApplications } from '../api/applications'
import { acceptApplication, rejectApplication, withdrawApplication } from '../api/applications'
import { getMyPosts } from '../api/works'
import { getWorkApplications } from '../api/applications'
import { useAuth } from '../stores/useAuth'
import Badge from '../ui/Badge'
import SkeletonLoader from '../ui/SkeletonLoader'
import type { Application } from '../types'

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Applications() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'mine' | 'received'>('mine')
  const [selectedWork, setSelectedWork] = useState<string>('')
  const [busy, setBusy] = useState<string | null>(null)

  const { data: myApps = [], isLoading: myLoading } = useQuery('my-applications', getMyApplications)
  const { data: myPosts = [] } = useQuery('my-posts', getMyPosts)
  const { data: receivedApps = [], isLoading: receivedLoading } = useQuery(
    ['work-applications', selectedWork],
    () => getWorkApplications(selectedWork),
    { enabled: !!selectedWork }
  )

  async function accept(id: string) {
    setBusy(id)
    try { await acceptApplication(id); qc.invalidateQueries(['work-applications']) }
    finally { setBusy(null) }
  }
  async function reject(id: string) {
    setBusy(id)
    try { await rejectApplication(id); qc.invalidateQueries(['work-applications']) }
    finally { setBusy(null) }
  }
  async function withdraw(id: string) {
    if (!confirm('Withdraw this application?')) return
    setBusy(id)
    try { await withdrawApplication(id); qc.invalidateQueries('my-applications') }
    finally { setBusy(null) }
  }

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'text-amber-400', ACCEPTED: 'text-emerald-400',
    REJECTED: 'text-red-400', WITHDRAWN: 'text-slate-500', SHORTLISTED: 'text-blue-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Applications</h1>
        <p className="text-sm text-slate-400 mt-1">Track your job applications and review incoming applicants.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl p-1 w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {(['mine', 'received'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition-soft ${tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={tab === t ? { background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', boxShadow: '0 4px 16px rgba(108,63,255,0.3)' } : {}}>
            {t === 'mine' ? `My Applications (${myApps.length})` : `Received (${receivedApps.length})`}
          </button>
        ))}
      </div>

      {/* My Applications */}
      {tab === 'mine' && (
        <div>
          {myLoading ? <SkeletonLoader type="list" rows={5} /> : myApps.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-400">You haven't applied to any jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myApps.map((app, i) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="wb-card flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-white truncate">Application #{app.id.slice(0, 8)}</span>
                      <Badge status={app.status} />
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Applied {timeAgo(app.created_at)} · Budget: ${app.expected_budget}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{app.proposal}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {app.status === 'PENDING' && (
                      <button onClick={() => withdraw(app.id)} disabled={busy === app.id}
                        className="wb-btn-danger text-xs px-3 py-1.5 disabled:opacity-50">
                        {busy === app.id ? '…' : 'Withdraw'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Received Applications */}
      {tab === 'received' && (
        <div className="space-y-5">
          {/* Work selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Select your job post to see applicants:</label>
            <select value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)} className="wb-input max-w-sm">
              <option value="">— Choose a job post —</option>
              {myPosts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {!selectedWork ? (
            <div className="text-center py-16 text-slate-500 text-sm">Select a job post to see who applied.</div>
          ) : receivedLoading ? <SkeletonLoader type="list" rows={4} /> : receivedApps.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">👀</div>
              <p className="text-slate-400">No applications yet for this job.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedApps.map((app, i) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="wb-card flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#6c3fff,#ec4899)' }}>
                        {app.worker_id.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Applicant #{app.worker_id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-500">{timeAgo(app.created_at)} · Expected: ${app.expected_budget}</p>
                      </div>
                      <Badge status={app.status} />
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{app.proposal}</p>
                  </div>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => accept(app.id)} disabled={busy === app.id}
                        className="wb-btn-primary text-xs px-4 py-2 disabled:opacity-50">
                        {busy === app.id ? '…' : '✓ Accept'}
                      </button>
                      <button onClick={() => reject(app.id)} disabled={busy === app.id}
                        className="wb-btn-danger text-xs px-3 py-2 disabled:opacity-50">
                        {busy === app.id ? '…' : '✗ Reject'}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
