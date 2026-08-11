import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../stores/useAuth'

export default function Admin() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-slate-400 mt-1">Platform administration and monitoring.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: '👥', label: 'Total Users', value: 'N/A', color: 'rgba(108,63,255,0.2)' },
          { icon: '💼', label: 'Total Jobs', value: 'N/A', color: 'rgba(56,189,248,0.15)' },
          { icon: '⚡', label: 'Active Assignments', value: 'N/A', color: 'rgba(16,185,129,0.15)' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="wb-card text-center"
            style={{ background: s.color }}>
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="font-display text-2xl font-bold text-white">{s.value}</div>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="wb-card">
        <h2 className="font-display text-base font-semibold text-white mb-4">Admin Information</h2>
        <div className="space-y-2 text-sm text-slate-400">
          <p>✓ Logged in as admin: <span className="text-white">{user?.email}</span></p>
          <p>✓ Backend admin endpoints can be extended in <code className="text-brand-300">backend/app/api/routes/</code></p>
          <p>✓ Access the FastAPI docs at <a href="http://127.0.0.1:8000/docs" target="_blank" className="text-brand-400 hover:underline">http://127.0.0.1:8000/docs</a></p>
        </div>
      </motion.div>
    </div>
  )
}
