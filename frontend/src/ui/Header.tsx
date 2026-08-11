import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'
import { useQuery } from 'react-query'
import { getNotifications } from '../api/notifications'

interface HeaderProps {
  title?: string
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: notifs = [] } = useQuery('notifications-sidebar', getNotifications, {
    staleTime: 15000,
  })
  const unreadCount = notifs.filter((n) => !n.is_read).length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(10,8,22,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div>
        {title ? (
          <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
        ) : (
          <div>
            <p className="text-xs text-slate-500">{greeting} 👋</p>
            <h1 className="font-display text-xl font-semibold text-white">
              {user?.email?.split('@')[0] ?? 'Welcome'}
            </h1>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-soft"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="notif-dot" />
          )}
        </Link>

        {/* AI Assistant Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400"
          style={{ background: 'rgba(108,63,255,0.1)', border: '1px solid rgba(108,63,255,0.2)' }}>
          <span className="animate-pulse-soft">✦</span>
          <span>AI On</span>
        </div>
      </div>
    </header>
  )
}
