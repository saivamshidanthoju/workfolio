import React from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { getMyAssignments } from '../api/assignments'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import SkeletonLoader from '../ui/SkeletonLoader'

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CompletedWorks() {
  const { data: assignments = [], isLoading } = useQuery('assignments-completed', getMyAssignments)
  const completed = assignments.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED')

  const totalEarnings = completed
    .filter((a) => a.status === 'COMPLETED')
    .reduce((s, a) => s + a.accepted_budget, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Completed Works</h1>
          <p className="text-sm text-slate-400 mt-1">History of all your finished and cancelled assignments.</p>
        </div>
        <div className="rounded-2xl px-5 py-3 text-sm text-center"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total Earned</p>
          <p className="font-display text-xl font-bold text-emerald-300 mt-0.5">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader type="list" rows={5} />
      ) : completed.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display text-xl font-semibold text-white mb-2">No completed works yet</h2>
          <p className="text-slate-400 mb-6">Your finished assignments will appear here.</p>
          <Link to="/assignments" className="wb-btn-primary text-sm">View Active Assignments →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((a, i) => (
            <motion.div key={a.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="wb-card flex flex-col md:flex-row md:items-center gap-5">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: a.status === 'COMPLETED' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)' }}>
                {a.status === 'COMPLETED' ? '✅' : '❌'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-display text-base font-semibold text-white">Assignment #{a.id.slice(0, 8)}</span>
                  <Badge status={a.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-slate-600 uppercase tracking-wider text-[10px]">Budget</p>
                    <p className="text-white font-semibold mt-0.5">${a.accepted_budget}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 uppercase tracking-wider text-[10px]">Started</p>
                    <p className="text-slate-300 mt-0.5">{fmt(a.started_at)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 uppercase tracking-wider text-[10px]">Finished</p>
                    <p className="text-slate-300 mt-0.5">{fmt(a.completed_at)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 uppercase tracking-wider text-[10px]">Created</p>
                    <p className="text-slate-300 mt-0.5">{fmt(a.created_at)}</p>
                  </div>
                </div>
              </div>
              <Link to="/reviews" className="wb-btn-ghost text-xs px-4 py-2 flex-shrink-0">
                Review →
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
