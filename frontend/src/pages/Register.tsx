import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

const STEPS = ['Account', 'Done']

export default function Register() {
  const navigate = useNavigate()
  const { register, login, loading } = useAuth()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }

    try {
      await register({ email, password })
      await login(email, password)
      setStep(1)
      setTimeout(() => navigate('/'), 1500)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. This email may already be in use.')
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.18),transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(108,63,255,0.2),transparent 50%), linear-gradient(180deg,#07050f,#0d0b1a)' }}>

      {/* Left panel */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col justify-between w-[45%] p-16"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>WB</div>
          <span className="font-display text-lg font-bold text-white">WorkBridge</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Employer &amp; Worker<br />
            <span className="gradient-brand-text">in one account.</span>
          </h2>
          <p className="mt-6 text-slate-400 leading-relaxed max-w-sm">You don't need two accounts. WorkBridge lets you seamlessly switch roles — post a job in the morning and apply to one in the afternoon.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: '🚀', label: 'Quick setup' },
              { icon: '🔐', label: 'Secure JWT auth' },
              { icon: '🌍', label: 'Any device' },
              { icon: '💬', label: 'Real-time chat' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span>{f.icon}</span><span className="text-xs text-slate-400">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-600">© 2026 WorkBridge</p>
      </motion.div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="font-display text-3xl font-bold text-white">Welcome aboard!</h2>
                <p className="mt-3 text-slate-400">Account created. Redirecting to your dashboard…</p>
                <div className="mt-6 flex justify-center">
                  <svg className="h-6 w-6 animate-spin text-brand-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="mb-8">
                  <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>WB</div>
                    <span className="font-display font-bold text-white">WorkBridge</span>
                  </Link>
                  <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
                  <p className="mt-2 text-sm text-slate-400">Free forever. No credit card required.</p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-2xl px-4 py-3 text-sm text-red-300 flex items-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    ⚠️ {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" className="wb-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters" className="wb-input pr-12" />
                      <button type="button" onClick={() => setShowPass((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-soft text-xs">
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Confirm password</label>
                    <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat password" className="wb-input" />
                  </div>

                  {/* Password strength */}
                  {password.length > 0 && (
                    <div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: password.length < 6 ? '25%' : password.length < 8 ? '50%' : password.length < 12 ? '75%' : '100%' }} />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {password.length < 6 ? 'Too short' : password.length < 8 ? 'Almost' : password.length < 12 ? 'Good' : 'Strong ✓'}
                      </p>
                    </div>
                  )}

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="wb-btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account…
                      </span>
                    ) : 'Create account →'}
                  </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-soft">Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
