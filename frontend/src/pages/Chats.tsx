import React from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMyAssignments } from '../api/assignments'
import { getMyChats } from '../api/messages'
import Badge from '../ui/Badge'
import SkeletonLoader from '../ui/SkeletonLoader'

export default function Chats() {
  const { data: assignments = [], isLoading: aLoading } = useQuery('assignments-chats', getMyAssignments)
  const { data: convos = [], isLoading: cLoading } = useQuery('chats-list', getMyChats)

  const activeAssignments = assignments.filter((a) => a.status === 'ACTIVE')

  if (aLoading || cLoading) return <SkeletonLoader type="list" rows={5} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Chats</h1>
        <p className="text-sm text-slate-400 mt-1">All your real-time assignment conversations.</p>
      </div>

      {activeAssignments.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="font-display text-xl font-semibold text-white mb-2">No active chats</h2>
          <p className="text-slate-400 mb-6">Chats open automatically when an assignment becomes active.</p>
          <Link to="/jobs" className="wb-btn-primary text-sm">Find Jobs →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeAssignments.map((a, i) => (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="wb-card flex items-center gap-5 hover:border-brand-500/30 transition-soft cursor-pointer"
              onClick={() => window.location.href = `/chat/${a.id}`}>
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>
                {a.id.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display text-sm font-semibold text-white">Assignment #{a.id.slice(0, 8)}</span>
                  <Badge status={a.status} />
                </div>
                <p className="text-xs text-slate-500">Budget: ${a.accepted_budget} · Click to open chat</p>
              </div>
              <div className="flex-shrink-0">
                <Link to={`/chat/${a.id}`} className="wb-btn-primary text-xs px-5 py-2.5">
                  Open →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
