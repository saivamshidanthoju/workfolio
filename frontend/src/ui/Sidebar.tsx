import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../stores/useAuth'
import { useQuery } from 'react-query'
import { getNotifications } from '../api/notifications'
import { API_BASE_URL } from '../api/client'

const LINKS = [
  { to: '/',               label: 'Dashboard',    icon: '⊞', exact: true },
  { to: '/jobs',           label: 'Browse Jobs',  icon: '💼' },
  { to: '/my-posts',       label: 'My Posts',     icon: '📋' },
  { to: '/applications',   label: 'Applications', icon: '📨' },
  { to: '/assignments',    label: 'Assignments',  icon: '⚡' },
  { to: '/chats',          label: 'Messages',     icon: '💬' },
  { to: '/completed',      label: 'Completed',    icon: '✅' },
  { to: '/notifications',  label: 'Alerts',       icon: '🔔', badge: true },
  { to: '/search-workers', label: 'Find Workers', icon: '🔍' },
  { to: '/reviews',        label: 'Reviews',      icon: '⭐' },
]

const ACCOUNT_LINKS = [
  { to: '/profile',        label: 'Profile',      icon: '👤' },
  { to: '/worker-profile', label: 'Worker Profile', icon: '🛠' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const { data: notifs = [] } = useQuery('notifications-sidebar', getNotifications, { refetchInterval: 30000 })
  const unread = notifs.filter((n) => !n.is_read).length

  async function handleLogout() {
    logout()
    navigate('/landing')
  }

  const avatarSrc = user?.profile?.profile_image ? `${API_BASE_URL}/${user.profile.profile_image}` : null

  return (
    <motion.aside
      animate={{ width: collapsed ? '72px' : '240px' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{
        height: '100vh', position: 'sticky', top: 0, flexShrink: 0,
        background: 'rgba(7,5,15,0.98)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 20,
      }}>

      {/* Logo + collapse */}
      <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div exit={{ opacity: 0, width: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', color: '#fff', flexShrink: 0 }}>WB</div>
              <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: 'nowrap' }}>WorkBridge</span>
            </motion.div>
          )}
          {collapsed && (
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', color: '#fff' }}>WB</div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed((c) => !c)}
          style={{ padding: '0.375rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108,63,255,0.12)'; e.currentTarget.style.color = '#a99bff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>

        {/* Section label */}
        {!collapsed && (
          <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', padding: '0.25rem 0.375rem', marginBottom: '0.25rem' }}>Main</div>
        )}

        {LINKS.map(({ to, label, icon, badge, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to} end={exact}
              style={({ isActive: ia }) => ({
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: collapsed ? '0.625rem' : '0.5625rem 0.75rem',
                borderRadius: '0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none', position: 'relative',
                background: ia ? 'rgba(108,63,255,0.16)' : 'transparent',
                border: `1px solid ${ia ? 'rgba(108,63,255,0.25)' : 'transparent'}`,
                color: ia ? '#ffffff' : '#64748b',
                fontWeight: ia ? '600' : '500',
                fontSize: '0.8125rem',
                transition: 'all 0.15s ease',
              })}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#cbd5e1' } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' } }}>
              {({ isActive: ia }) => (
                <>
                  {ia && (
                    <motion.div layoutId="sidebar-active"
                      style={{ position: 'absolute', inset: 0, borderRadius: '0.75rem', background: 'rgba(108,63,255,0.16)', border: '1px solid rgba(108,63,255,0.28)', zIndex: -1 }}
                      transition={{ type: 'spring', damping: 30, stiffness: 350 }} />
                  )}
                  <span style={{ fontSize: '0.9rem', flexShrink: 0, position: 'relative' }}>
                    {icon}
                    {badge && unread > 0 && (
                      <span style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        minWidth: '14px', height: '14px', borderRadius: '9999px',
                        background: '#ef4444', color: '#fff',
                        fontSize: '0.5rem', fontWeight: '700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid #07050f', padding: '0 2px',
                      }}>{unread > 9 ? '9+' : unread}</span>
                    )}
                  </span>
                  {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
                </>
              )}
            </NavLink>
          )
        })}

        {/* Account section */}
        {!collapsed && (
          <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', padding: '0.5rem 0.375rem 0.25rem', marginTop: '0.5rem' }}>Account</div>
        )}
        {collapsed && <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />}

        {ACCOUNT_LINKS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}
            style={({ isActive: ia }) => ({
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: collapsed ? '0.625rem' : '0.5625rem 0.75rem',
              borderRadius: '0.75rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none', position: 'relative',
              background: ia ? 'rgba(108,63,255,0.16)' : 'transparent',
              border: `1px solid ${ia ? 'rgba(108,63,255,0.25)' : 'transparent'}`,
              color: ia ? '#ffffff' : '#64748b',
              fontWeight: ia ? '600' : '500',
              fontSize: '0.8125rem',
              transition: 'all 0.15s ease',
            })}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#cbd5e1' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}>
            <span style={{ fontSize: '0.9rem' }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem', borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.625rem', flexShrink: 0,
            background: 'linear-gradient(135deg,#6c3fff,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: '700', color: '#fff', overflow: 'hidden',
          }}>
            {avatarSrc ? <img src={avatarSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : (user?.email?.[0]?.toUpperCase() ?? 'U')}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div exit={{ opacity: 0, width: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0] ?? 'User'}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={handleLogout} title="Sign out"
              style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#475569', borderRadius: '0.375rem', flexShrink: 0, transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
              ⏻
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
