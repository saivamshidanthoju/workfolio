import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import AIConsole from './AIConsole'

const PAGE_TITLES: Record<string, string> = {
  '/':               'Dashboard',
  '/jobs':           'Browse Jobs',
  '/my-posts':       'My Job Posts',
  '/applications':   'Applications',
  '/assignments':    'Assignments',
  '/chats':          'Messages',
  '/completed':      'Completed Works',
  '/notifications':  'Notifications',
  '/profile':        'Your Profile',
  '/worker-profile': 'Worker Profile',
  '/search-workers': 'Find Workers',
  '/reviews':        'Reviews',
  '/admin':          'Admin Panel',
}

export default function Layout() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? (
    location.pathname.startsWith('/chat/') ? 'Chat' : 'WorkBridge'
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080612' }}>
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top header bar */}
        <header style={{
          height: '60px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.75rem',
          background: 'rgba(8,6,18,0.9)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <AnimatePresence mode="wait">
              <motion.h1 key={title}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', fontFamily: "'Plus Jakarta Sans',sans-serif", margin: 0 }}>
                {title}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulseSoft 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#34d399' }}>Live</span>
            </div>

            {/* AI chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(108,63,255,0.1)', border: '1px solid rgba(108,63,255,0.2)' }}>
              <span style={{ fontSize: '0.6875rem' }}>✦</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#a99bff' }}>AI Active</span>
            </div>
          </div>
        </header>

        {/* Page content with transition */}
        <main style={{ flex: 1, overflow: 'auto', padding: '1.75rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI widget */}
      <AIConsole />
    </div>
  )
}
