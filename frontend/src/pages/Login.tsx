import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuth((s) => s.login)
  const loading = useAuth((s) => s.loading)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(108,63,255,0.2),transparent 50%), radial-gradient(ellipse at 85% 50%, rgba(56,189,248,0.15),transparent 50%), linear-gradient(180deg,#07050f,#0d0b1a)' }}>

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col justify-between w-[45%] p-16"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>WB</div>
          <span className="font-display text-lg font-bold text-white">WorkBridge</span>
        </Link>

        <div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Your unified workspace<br />
            <span className="gradient-brand-text">starts here.</span>
          </h2>
          <p className="mt-6 text-slate-400 leading-relaxed max-w-sm">
            Manage jobs, track assignments, chat with teams, and grow your career — all from one elegant dashboard.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: '💼', text: 'Post and find jobs with smart filtering' },
              { icon: '⚡', text: 'Real-time WebSocket chat per assignment' },
              { icon: '✦',  text: 'AI assistant for instant help and summaries' },
              { icon: '⭐', text: 'Reviews and ratings to build trust' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-brand-400">{item.icon}</span>
                <span className="text-sm text-slate-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 WorkBridge</p>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>WB</div>
              <span className="font-display font-bold text-white">WorkBridge</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to your account to continue.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl px-4 py-3 text-sm text-red-300 flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="wb-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="wb-input pr-12"
                />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-soft text-xs">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="wb-btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-soft">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
