import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const token = localStorage.getItem('wb_token')

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#080612',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3rem', height: '3rem', borderRadius: '1rem',
          background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.125rem', fontWeight: '800', color: '#fff',
          margin: '0 auto 1rem',
          animation: 'pulseSoft 1.5s ease-in-out infinite',
        }}>WB</div>
        <p style={{ color: '#475569', fontSize: '0.875rem' }}>Loading…</p>
      </div>
    </div>
  )

  if (!token && !user) return <Navigate to="/landing" replace />
  return <>{children}</>
}
