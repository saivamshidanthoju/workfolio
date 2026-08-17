import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  // If already logged in, redirect home
  useEffect(() => {
    const token = localStorage.getItem('wb_token')
    if (token && user) {
      navigate('/')
    }
  }, [user, navigate])

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
    <div className="min-h-screen bg-slate-50 text-slate-700 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* ── Ambient Glowing Blobs (Light mode) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-100/30 blur-[130px] animate-pulse-soft" />
        <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-cyan-50/20 blur-[120px]" />
      </div>

      {/* ── Back to Homepage Link (Clean) ── */}
      <div className="absolute top-8 left-8 z-10">
        <Link 
          to="/landing" 
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-soft"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Homepage
        </Link>
      </div>

      {/* ── Form Card ── */}
      <motion.div 
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-bold text-base shadow-sm mb-4">
            WB
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Sign in to access your unified contract workspace.
          </p>
        </div>

        {/* Alert Error Box */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 rounded-2xl px-4 py-3 text-xs sm:text-sm text-rose-800 bg-rose-50 border border-rose-200 flex items-start gap-2.5 overflow-hidden"
            >
              <svg className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-500">Email Address</label>
            <input
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4.5 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_15px_rgba(108,63,255,0.08)] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-500">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4.5 pr-14 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_15px_rgba(108,63,255,0.08)] transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs transition-soft font-semibold"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <motion.button
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-sm shadow-sm hover:shadow-md transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </motion.button>
        </form>

        {/* Footer Text */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500">
          New to WorkBridge?{' '}
          <Link 
            to="/register" 
            className="font-bold text-brand-500 hover:text-brand-600 transition-soft"
          >
            Create an Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
