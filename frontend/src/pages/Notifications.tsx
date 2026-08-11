import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notifications'
import type { Notification } from '../types'

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  APPLICATION: { icon: '📨', color: 'text-blue-400' },
  ASSIGNMENT:  { icon: '⚡', color: 'text-brand-400' },
  MESSAGE:     { icon: '💬', color: 'text-pink-400' },
  REVIEW:      { icon: '⭐', color: 'text-amber-400' },
  SYSTEM:      { icon: '🔔', color: 'text-slate-400' },
}

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60)    return `${Math.floor(s)}s ago`
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Notifications() {
  const qc = useQueryClient()
  const { data: notifs = [], isLoading } = useQuery('notifications', getNotifications, { refetchInterval: 30000 })
  const unread = notifs.filter((n) => !n.is_read)

  async function handleRead(id: string) {
    await markAsRead(id)
    qc.invalidateQueries('notifications')
    qc.invalidateQueries('notifications-sidebar')
  }
  async function handleReadAll() {
    await markAllAsRead()
    qc.invalidateQueries('notifications')
    qc.invalidateQueries('notifications-sidebar')
  }
  async function handleDelete(id: string) {
    await deleteNotification(id)
    qc.invalidateQueries('notifications')
    qc.invalidateQueries('notifications-sidebar')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1">
            {unread.length > 0 ? <><span className="text-brand-300 font-semibold">{unread.length} unread</span> notifications</> : 'All caught up!'}
          </p>
        </div>
        {unread.length > 0 && (
          <button onClick={handleReadAll} className="wb-btn-ghost text-sm py-2">
            ✓ Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="wb-card flex gap-4 animate-pulse">
              <div className="skeleton h-11 w-11 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🔔</div>
          <h2 className="font-display text-xl font-semibold text-white mb-2">No notifications yet</h2>
          <p className="text-slate-400">We'll let you know when something happens.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifs.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.SYSTEM
              return (
                <motion.div key={n.id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="wb-card flex items-start gap-4 cursor-default"
                  style={!n.is_read ? {
                    background: 'rgba(108,63,255,0.06)',
                    borderColor: 'rgba(108,63,255,0.2)',
                  } : {}}>
                  {/* Icon */}
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl ${n.is_read ? 'opacity-60' : ''}`}
                    style={{ background: n.is_read ? 'rgba(255,255,255,0.04)' : 'rgba(108,63,255,0.12)' }}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${n.is_read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                      {!n.is_read && <div className="h-2 w-2 rounded-full bg-brand-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] text-slate-600">{timeAgo(n.created_at)}</span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${cfg.color}`}>{n.type}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    {!n.is_read && (
                      <button onClick={() => handleRead(n.id)}
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-brand-400 hover:bg-brand-500/15 transition-soft text-xs">
                        ✓
                      </button>
                    )}
                    <button onClick={() => handleDelete(n.id)}
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-soft">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
