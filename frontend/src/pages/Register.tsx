import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register, login, loading, user } = useAuth()
  
  // Registration flow state
  const [step, setStep] = useState(0) // 0: Form, 1: Success loader redirect
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('wb_token')
    if (token && user && step === 0) {
      navigate('/')
    }
  }, [user, navigate, step])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { 
      setError('Passwords do not match.')
      return 
    }
    if (password.length < 8) { 
      setError('Password must be at least 8 characters.')
      return 
    }

    try {
      await register({ email, password })
      await login(email, password)
      setStep(1)
      setTimeout(() => navigate('/'), 1500)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. This email may already be in use.')
    }
  }

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0
    if (password.length < 6) return 1
    if (password.length < 8) return 2
    if (password.length < 12) return 3
    return 4
  }

  const strength = getPasswordStrength()
  const strengthLabels = ['', 'Too Weak', 'Almost There', 'Good Security', 'Excellent ✓']
  const strengthColors = [
    'bg-slate-200',
    'bg-rose-500',
    'bg-amber-500',
    'bg-brand-500',
    'bg-emerald-500'
  ]
  const strengthTextColors = [
    'text-slate-400',
    'text-rose-500',
    'text-amber-500',
    'text-brand-600',
    'text-emerald-600'
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-100/30 blur-[130px] animate-pulse-soft" />
        <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-pink-50/20 blur-[120px]" />
      </div>

      {/* ── Back to Homepage Link ── */}
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

        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* ── Step 1: Success Loading screen ── */
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center mx-auto text-3xl shadow-sm">
                🎉
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-extrabold text-slate-900">Welcome Aboard!</h2>
                <p className="text-xs sm:text-sm text-slate-500">Account created. Preparing your workspace dashboard...</p>
              </div>
              <div className="flex justify-center pt-2">
                <svg className="h-6 w-6 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </motion.div>
          ) : (
            /* ── Step 0: Register Form ── */
            <motion.div key="form">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-bold text-base shadow-sm mb-4">
                  WB
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create Your Account
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  Free forever. No credit card details required.
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

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email" 
                    required
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4.5 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_15px_rgba(108,63,255,0.08)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-500">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} 
                      required
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
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

                  {/* Password strength Visual progress */}
                  {password.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength]}`} 
                          style={{ width: `${strength * 25}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Security Strength:</span>
                        <span className={`font-bold uppercase tracking-wider ${strengthTextColors[strength]}`}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-500">Confirm Password</label>
                  <input
                    type="password" 
                    required
                    value={confirm} 
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4.5 py-3.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_15px_rgba(108,63,255,0.08)] transition-all"
                  />
                </div>

                <motion.button
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-sm shadow-sm hover:shadow-md transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Creating Account…</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-xs sm:text-sm text-slate-500">
                Already registered?{' '}
                <Link 
                  to="/login" 
                  className="font-bold text-brand-500 hover:text-brand-600 transition-soft"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
