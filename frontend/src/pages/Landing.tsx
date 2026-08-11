import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

/* ─── Reusable inline auth modal ─── */
function AuthModal({ mode, onClose }: { mode: 'login' | 'register'; onClose: () => void }) {
  const navigate = useNavigate()
  const { login, register, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'login' | 'register'>(mode)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (tab === 'login') {
        await login(email, password)
        onClose()
        navigate('/')
      } else {
        if (password !== confirm) { setError('Passwords do not match.'); return }
        if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
        await register({ email, password })
        await login(email, password)
        onClose()
        navigate('/')
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? (tab === 'login' ? 'Invalid credentials.' : 'Registration failed.'))
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4
  const strengthColors = ['', '#ef4444', '#f59e0b', '#6c3fff', '#10b981']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(8,6,20,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 32px 100px rgba(0,0,0,0.6), 0 0 50px rgba(108,63,255,0.1)',
        }}>
        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['login','register'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError('') }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={tab === t
                ? { background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', color: '#fff' }
                : { color: '#64748b' }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Welcome back 👋' : 'Join WorkBridge 🚀'}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {tab === 'login' ? 'Sign in to your unified workspace.' : 'Free forever. No credit card required.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94a3b8' }}>Email address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className="wb-input" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94a3b8' }}>Password</label>
            <div className="relative">
              <input required type={showPass ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'register' ? 'Min 8 characters' : '••••••••'}
                className="wb-input pr-14" />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-soft"
                style={{ color: '#64748b' }}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {tab === 'register' && password.length > 0 && (
              <div className="mt-2">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${strength * 25}%`, background: strengthColors[strength] }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: strengths[strength] }}>
                  {['','Too short','Almost there','Good','Strong ✓'][strength]}
                </p>
              </div>
            )}
          </div>
          {tab === 'register' && (
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94a3b8' }}>Confirm password</label>
              <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password" className="wb-input" />
            </div>
          )}
          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm mt-2 disabled:opacity-50 transition-soft"
            style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', boxShadow: '0 4px 20px rgba(108,63,255,0.3)' }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : tab === 'login' ? 'Sign in →' : 'Create account →'}
          </motion.button>
        </form>

        <button onClick={onClose}
          className="mt-4 w-full py-2 text-sm transition-soft rounded-xl"
          style={{ color: '#475569' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}>
          ← Back to homepage
        </button>
      </motion.div>
    </div>
  )
}

const strengthColors: Record<number, string> = { 1: '#ef4444', 2: '#f59e0b', 3: '#6c3fff', 4: '#10b981' }
const strengths: Record<number, string> = { 0: '', 1: '#ef4444', 2: '#f59e0b', 3: '#a99bff', 4: '#34d399' }

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }} viewport={{ once: true }}
      whileHover={{ y: -4, borderColor: 'rgba(108,63,255,0.35)' }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1rem',
        padding: '1.5rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
      }}>
      <div className="text-2xl mb-3"
        style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(108,63,255,0.12)', borderRadius: '0.75rem', fontSize: '1.1rem' }}>
        {icon}
      </div>
      <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
    </motion.div>
  )
}

/* ─── Step ─── */
function Step({ n, title, desc, isLast }: { n: number; title: string; desc: string; isLast?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, x: n % 2 === 0 ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: n * 0.15 }}
      viewport={{ once: true }}
      className={`flex items-start gap-6 ${n % 2 === 0 ? 'flex-row-reverse text-right ml-auto' : ''}`}
      style={{ maxWidth: '420px' }}>
      <div className="flex flex-col items-center flex-shrink-0">
        <div style={{
          width: '2.75rem', height: '2.75rem', borderRadius: '50%',
          background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: '700', color: '#fff',
          boxShadow: '0 0 20px rgba(108,63,255,0.4)',
        }}>{n}</div>
        {!isLast && (
          <div style={{ width: '2px', height: '60px', marginTop: '4px', background: 'linear-gradient(180deg,rgba(108,63,255,0.5),transparent)' }} />
        )}
      </div>
      <div className="pb-0">
        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
        <p className="text-sm" style={{ color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
      </div>
    </motion.div>
  )
}

const FEATURES = [
  { icon: '💼', title: 'Post & Find Jobs', desc: 'Employers post jobs, workers apply — all with smart filters and real-time search across every category.' },
  { icon: '💬', title: 'Real-Time Chat', desc: 'WebSocket-powered instant messaging built into every assignment. No third-party apps needed.' },
  { icon: '✅', title: 'Assignment Tracking', desc: 'Monitor every active, completed, and disputed work with live status updates and assignment timelines.' },
  { icon: '⭐', title: 'Reviews & Ratings', desc: 'Build verified reputation with star ratings and detailed feedback after every completed project.' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified instantly on every application update, message, and assignment status change.' },
  { icon: '✦', title: 'AI Assistant', desc: 'Built-in AI that helps with summaries, next steps, proposal writing, and platform guidance.' },
]

const STEPS = [
  { title: 'Create your account', desc: 'One unified account lets you act as both an employer and a worker — no separate profiles needed.' },
  { title: 'Post or browse jobs', desc: 'Post a job in minutes or search thousands of open positions with powerful filters and categories.' },
  { title: 'Connect & collaborate', desc: 'Accept applications, start assignments, and message your team in real-time via built-in chat.' },
  { title: 'Complete & review', desc: 'Mark work as done, receive payment, and leave verified reviews to build your reputation.' },
]

const STATS = [
  { val: '12K+', label: 'Active Users' },
  { val: '30K+', label: 'Jobs Posted' },
  { val: '98%',  label: 'Satisfaction' },
  { val: '$3M+', label: 'Paid Out' },
]

export default function Landing() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const user = useAuth((s) => s.user)
  const navigate = useNavigate()

  // If already logged in, go to dashboard
  useEffect(() => {
    const token = localStorage.getItem('wb_token')
    if (token && user) navigate('/')
  }, [user])

  return (
    <div style={{ minHeight: '100vh', background: '#080612', overflowX: 'hidden' }}>

      {/* ── Ambient blobs ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 15% 40%, rgba(20,90,70,0.35) 0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 85% 55%, rgba(120,60,10,0.3) 0%, transparent 65%),
          radial-gradient(ellipse 40% 35% at 50% 10%, rgba(108,63,255,0.12) 0%, transparent 60%)
        `,
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: '64px',
        background: 'rgba(8,6,18,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
            background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8125rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px',
          }}>WB</div>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            WorkBridge
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setAuthMode('login')}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.875rem',
              fontWeight: '600', color: '#94a3b8', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(108,63,255,0.4)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
            Sign in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(108,63,255,0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAuthMode('register')}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.625rem', fontSize: '0.875rem',
              fontWeight: '700', color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
              boxShadow: '0 4px 16px rgba(108,63,255,0.35)',
            }}>
            Get started →
          </motion.button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', alignItems: 'center',
        padding: '4rem 2.5rem 6rem',
        maxWidth: '1200px', margin: '0 auto',
        gap: '4rem',
      }}>
        {/* Left text */}
        <div style={{ flex: '1', minWidth: '0' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.875rem', borderRadius: '9999px', marginBottom: '1.5rem',
              background: 'rgba(108,63,255,0.12)', border: '1px solid rgba(108,63,255,0.28)',
              fontSize: '0.75rem', fontWeight: '600', color: '#a99bff',
            }}>
              <span style={{ animation: 'pulseSoft 2s ease-in-out infinite' }}>✦</span>
              The unified freelance platform — live now
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '800', lineHeight: '1.05',
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              color: '#ffffff', marginBottom: '1.25rem',
            }}>
              Your Work,<br />
              <span style={{ background: 'linear-gradient(135deg,#8468ff,#38bdf8,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Bridged.
              </span>
            </h1>

            <p style={{ fontSize: '1.0625rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '480px' }}>
              Post jobs, apply to gigs, manage assignments, chat in real-time, and build your reputation — whether you're an employer,
              a freelancer, or both. One account. Infinite possibilities.
            </p>

            {/* Bullet points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2.5rem' }}>
              {['Dual role — employer & worker in one account', 'Real-time WebSocket chat per assignment', 'AI assistant for proposals and summaries'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span style={{ color: '#6c3fff', fontWeight: '700' }}>✓</span> {t}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(108,63,255,0.5)' }} whileTap={{ scale: 0.97 }}
                onClick={() => setAuthMode('register')}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '0.875rem', fontSize: '0.9375rem',
                  fontWeight: '700', color: '#fff', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
                  boxShadow: '0 6px 24px rgba(108,63,255,0.4)',
                }}>
                Start for free →
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setAuthMode('login')}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '0.875rem', fontSize: '0.9375rem',
                  fontWeight: '600', color: '#94a3b8', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                }}>
                Already a member
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right — Dashboard preview card */}
        <motion.div initial={{ opacity: 0, x: 40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: '1', minWidth: '0', maxWidth: '480px' }}>
          <div style={{
            background: 'rgba(12,10,24,0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem',
            overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 50px rgba(108,63,255,0.1)',
          }}>
            {/* Window chrome */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#475569' }}>app.workbridge.io/dashboard</span>
            </div>
            {/* UI preview */}
            <div style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              {[
                { emoji: '💼', label: 'Open Jobs', val: '12', g: 'linear-gradient(135deg,#6c3fff,#38bdf8)' },
                { emoji: '⚡', label: 'Active Works', val: '3', g: 'linear-gradient(135deg,#10b981,#06b6d4)' },
                { emoji: '💰', label: 'Total Earned', val: '$4.3K', g: 'linear-gradient(135deg,#ec4899,#6c3fff)' },
              ].map((s) => (
                <div key={s.label} style={{
                  flex: 1, padding: '0.875rem', borderRadius: '0.875rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.emoji}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* AI bar */}
            <div style={{ margin: '0 1.25rem 1.25rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'rgba(108,63,255,0.08)', border: '1px solid rgba(108,63,255,0.18)' }}>
              <span style={{ color: '#a99bff', fontSize: '0.875rem' }}>✦</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>AI: "You have 2 pending applications. Assignment #4 needs your attention..."</span>
            </div>
            {/* Fake chart bar */}
            <div style={{ margin: '0 1.25rem 1.25rem' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '60px' }}>
                {[30, 55, 40, 70, 50, 85, 60].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, borderRadius: '4px 4px 0 0',
                    background: i === 5 ? 'linear-gradient(180deg,#6c3fff,#38bdf8)' : 'rgba(108,63,255,0.2)',
                    height: `${h}%`,
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {['M','T','W','T','F','S','S'].map((d) => (
                  <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', color: '#475569' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2.5rem', background: 'rgba(108,63,255,0.04)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif", background: 'linear-gradient(135deg,#8468ff,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '6rem 2.5rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6c3fff', marginBottom: '0.75rem' }}>Everything you need</div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '800', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: '1.15' }}>
            One tool. Infinite uses.
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.875rem', maxWidth: '500px', margin: '0.875rem auto 0', lineHeight: '1.6' }}>
            Anywhere modern teams manage freelance work, WorkBridge is the smarter choice.
          </p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.07} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '6rem 2.5rem', background: 'rgba(255,255,255,0.016)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6c3fff', marginBottom: '0.75rem' }}>Quick Start</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '800', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Ready, set,{' '}
              <span style={{ background: 'linear-gradient(135deg,#8468ff,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                WorkBridge!
              </span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'flex-start', paddingLeft: '20%' }}>
            {STEPS.map((s, i) => (
              <Step key={s.title} n={i + 1} title={s.title} desc={s.desc} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '8rem 2.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: '1rem' }}>
            Ready to bridge the gap?
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748b', marginBottom: '2.5rem', maxWidth: '460px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Join thousands of employers and freelancers building great things together.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 10px 40px rgba(108,63,255,0.55)' }} whileTap={{ scale: 0.97 }}
              onClick={() => setAuthMode('register')}
              style={{
                padding: '1rem 2.5rem', borderRadius: '0.875rem', fontSize: '1rem',
                fontWeight: '700', color: '#fff', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#6c3fff,#38bdf8)',
                boxShadow: '0 6px 28px rgba(108,63,255,0.4)',
              }}>
              Create free account →
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setAuthMode('login')}
              style={{
                padding: '1rem 2.5rem', borderRadius: '0.875rem', fontSize: '1rem',
                fontWeight: '600', color: '#94a3b8', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
              }}>
              Sign in
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '2rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#6c3fff,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', color: '#fff' }}>WB</div>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>WorkBridge</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#334155' }}>© 2026 WorkBridge. Built for the modern workforce.</p>
      </footer>

      {/* ── AUTH MODAL ── */}
      <AnimatePresence>
        {authMode && <AuthModal key="modal" mode={authMode} onClose={() => setAuthMode(null)} />}
      </AnimatePresence>
    </div>
  )
}
