import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMyAssignments, completeAssignment, cancelAssignment } from '../api/assignments'
import { useAuth } from '../stores/useAuth'
import Badge from '../ui/Badge'
import SkeletonLoader from '../ui/SkeletonLoader'
import type { Assignment } from '../types'

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Assignments() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'active' | 'completed' | 'all'>('active')
  const [busy, setBusy] = useState<string | null>(null)

  const { data: assignments = [], isLoading } = useQuery('assignments', getMyAssignments)

  const filtered = {
    active:    assignments.filter((a) => a.status === 'ACTIVE'),
    completed: assignments.filter((a) => a.status === 'COMPLETED'),
    all:       assignments,
  }[tab]

  async function doComplete(id: string) {
    if (!confirm('Mark this assignment as completed?')) return
    setBusy(id)
    try { await completeAssignment(id); qc.invalidateQueries('assignments') }
    finally { setBusy(null) }
  }
  async function doCancel(id: string) {
    if (!confirm('Cancel this assignment?')) return
    setBusy(id)
    try { await cancelAssignment(id); qc.invalidateQueries('assignments') }
    finally { setBusy(null) }
  }

  const counts = {
    active: assignments.filter((a) => a.status === 'ACTIVE').length,
    completed: assignments.filter((a) => a.status === 'COMPLETED').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Assignments</h1>
          <p className="text-sm text-slate-400 mt-1">Track all your active and completed work assignments.</p>
        </div>
        {/* Summary chips */}
        <div className="flex gap-3">
          <div className="rounded-2xl px-4 py-2 text-sm" style={{ background: 'rgba(108,63,255,0.1)', border: '1px solid rgba(108,63,255,0.2)' }}>
            <span className="text-brand-300 font-bold">{counts.active}</span>
            <span className="text-slate-500 ml-1">Active</span>
          </div>
          <div className="rounded-2xl px-4 py-2 text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-emerald-300 font-bold">{counts.completed}</span>
            <span className="text-slate-500 ml-1">Done</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl p-1 w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {(['active', 'completed', 'all'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-soft capitalize ${tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={tab === t ? { background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', boxShadow: '0 4px 16px rgba(108,63,255,0.3)' } : {}}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)} {t !== 'all' && `(${counts[t] ?? assignments.length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonLoader type="list" rows={5} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">{tab === 'active' ? '⚡' : '📋'}</div>
          <p className="text-slate-400">No {tab} assignments at the moment.</p>
          {tab === 'active' && <Link to="/jobs" className="mt-4 wb-btn-primary text-sm inline-flex">Browse Jobs →</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="wb-card">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                {/* Icon */}
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: a.status === 'ACTIVE' ? 'rgba(108,63,255,0.2)' : a.status === 'COMPLETED' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)' }}>
                  {a.status === 'ACTIVE' ? '⚡' : a.status === 'COMPLETED' ? '✅' : '❌'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-display text-base font-semibold text-white">Assignment #{a.id.slice(0, 8)}</span>
                    <Badge status={a.status} />
                    {a.client_id === user?.id && (
                      <span className="wb-chip bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 text-[10px]">You're Employer</span>
                    )}
                    {a.worker_id === user?.id && (
                      <span className="wb-chip bg-pink-500/15 text-pink-300 border border-pink-500/20 text-[10px]">You're Worker</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest">Budget</p>
                      <p className="text-sm font-semibold text-white mt-1">${a.accepted_budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest">Started</p>
                      <p className="text-sm text-slate-300 mt-1">{fmt(a.started_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest">Completed</p>
                      <p className="text-sm text-slate-300 mt-1">{fmt(a.completed_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest">Created</p>
                      <p className="text-sm text-slate-300 mt-1">{fmt(a.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link to={`/chat/${a.id}`}
                    className="wb-btn-primary text-xs px-4 py-2">
                    💬 Chat
                  </Link>
                  {a.status === 'ACTIVE' && (
                    <>
                      <button onClick={() => doComplete(a.id)} disabled={busy === a.id}
                        className="wb-btn-ghost text-xs px-3 py-2 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50">
                        {busy === a.id ? '…' : '✓ Done'}
                      </button>
                      <button onClick={() => doCancel(a.id)} disabled={busy === a.id}
                        className="wb-btn-danger text-xs px-3 py-2 disabled:opacity-50">
                        {busy === a.id ? '…' : 'Cancel'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
