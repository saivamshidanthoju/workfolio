import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

// Reusable SVG Icon Components for professional, sharp assets (no AI indicators)
const Icons = {
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
}

export default function Landing() {
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)

  // Interactive dashboard states
  const [activeRole, setActiveRole] = useState<'employer' | 'worker'>('employer')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem('wb_token')
    if (token && user) {
      navigate('/')
    }
  }, [user, navigate])

  const features = [
    {
      icon: <Icons.Briefcase />,
      title: 'Post & Discover Gigs',
      desc: 'Seamlessly post job requests or apply to gigs. Power search through skills, categories, and client ratings.',
    },
    {
      icon: <Icons.Chat />,
      title: 'Real-time Unified Chat',
      desc: 'Instantly connect with clients or freelancers inside the assignment board, powered by WebSockets.',
    },
    {
      icon: <Icons.Calendar />,
      title: 'Smart Milestone Tracking',
      desc: 'Assign contracts, mark milestones, log progress, and track state changes with transparent timelines.',
    },
    {
      icon: <Icons.Star />,
      title: 'Verified Reviews & Trust',
      desc: 'Build a rock-solid work reputation. Honest reviews and transparent ratings keep our network reliable.',
    },
    {
      icon: <Icons.Bell />,
      title: 'Instant Smart Alerts',
      desc: 'Never miss an update. Receive instant feedback alerts on job postings, chats, milestones, and status shifts.',
    },
    {
      icon: <Icons.ShieldCheck />,
      title: 'Escrow Milestone Payments',
      desc: 'Funds are held securely and released only when milestones are completed and approved by both parties.',
    }
  ]

  const faqs = [
    {
      q: 'Do I need separate accounts to hire freelancers and to work on gigs?',
      a: 'Absolutely not. WorkBridge gives you a single unified profile. Switch seamlessly from Posting jobs (Employer Mode) to Applying for roles (Worker Mode) with a single click inside your dashboard.'
    },
    {
      q: 'How does real-time chat work on assignments?',
      a: 'Once an application is approved and an assignment starts, an encrypted workspace channel is created. You get typing indicators, real-time message updates, and notification badges using standard WebSockets.'
    },
    {
      q: 'Is there a contract manager tool built into the platform?',
      a: 'Yes. Every project has a dedicated state machine that moves from pending approval to active, verification, and completed. Users can log milestones, request modifications, and release payments safely.'
    },
    {
      q: 'How are payments protected on the platform?',
      a: 'Payments are linked to specific project milestones. When a milestone is logged, funds are locked in escrow and only released once the employer approves the work, minimizing dispute risks.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-brand-500 selection:text-white overflow-hidden relative">
      
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-200/40 blur-[120px] animate-pulse-soft" />
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-100/40 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-pink-100/30 blur-[120px] animate-pulse-soft" />
      </div>

      {/* ── STICKY GLASS NAVBAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md text-sm tracking-tight">
              WB
            </div>
            <span className="font-display font-extrabold text-slate-900 text-lg tracking-tight">
              WorkBridge
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-soft">Features</a>
            <a href="#demo" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-soft">Interactive Demo</a>
            <a href="#timeline" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-soft">Workflow</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-soft">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl transition-soft border border-slate-200/50 hover:bg-slate-100 bg-white shadow-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-semibold bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Headlines */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            The Unified Freelance & Contract Engine
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
          >
            Your Work.<br />
            Your Terms.<br />
            <span className="gradient-brand-text">Bridged.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mb-8"
          >
            Post requirements, search active assignments, chat in real-time, and build a verified career identity. Act as an employer, freelancer, or switch fluidly. One platform, total control.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto animate-fade-up"
          >
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-base px-8 py-4 rounded-2xl text-center shadow-md hover:-translate-y-1 active:translate-y-0 transition-all"
            >
              Start For Free
            </Link>
            <a 
              href="#demo" 
              className="px-8 py-4 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base rounded-2xl text-center transition-all shadow-sm hover:-translate-y-1 active:translate-y-0"
            >
              Interactive Demo
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex items-center gap-8 border-t border-slate-200/60 pt-8 w-full"
          >
            {[
              { val: '12K+', label: 'Verified Talents' },
              { val: '32K+', label: 'Jobs Processed' },
              { val: '$4M+', label: 'Safely Released' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-display font-extrabold text-slate-900 text-2xl tracking-tight">{stat.val}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Visual Dashboard mockup */}
        <div className="lg:col-span-6 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_24px_50px_rgba(0,0,0,0.06),0_0_40px_rgba(108,63,255,0.03)] overflow-hidden"
          >
            {/* Window Chrome Header */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 tracking-wider">app.workbridge.io/dashboard</span>
              <div className="w-6" /> {/* Balance spacer */}
            </div>

            {/* UI Preview Area */}
            <div className="p-6 space-y-6">
              {/* Header inside mock UI */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-slate-900 font-display font-bold text-sm">Welcome Back, Alex</h4>
                  <p className="text-[11px] text-slate-400">Platform status: Active Mode</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-[10px] text-brand-700 font-bold tracking-wider uppercase">
                  Pro Account
                </span>
              </div>

              {/* Grid of Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-200 transition-soft">
                  <span className="text-[11px] text-slate-500 block">Earnings</span>
                  <div className="font-display font-extrabold text-slate-900 text-base mt-1">$4,850</div>
                  <span className="text-[9px] text-emerald-600 font-semibold">+12.5%</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-200 transition-soft">
                  <span className="text-[11px] text-slate-500 block">Active Gigs</span>
                  <div className="font-display font-extrabold text-slate-900 text-base mt-1">4</div>
                  <span className="text-[9px] text-brand-600 font-semibold">1 in review</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-200 transition-soft">
                  <span className="text-[11px] text-slate-500 block">Task Score</span>
                  <div className="font-display font-extrabold text-slate-900 text-base mt-1">98%</div>
                  <span className="text-[9px] text-cyan-600 font-semibold">Top Rated</span>
                </div>
              </div>

              {/* Chat Message Snippet (WebSocket simulated) */}
              <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                    Live Connection Message
                  </span>
                  <span className="text-[9px] text-slate-400">Just now</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">J</div>
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-900 font-bold">Julia Myers (Client)</div>
                    <div className="text-[11px] text-slate-600">"Hey! The latest milestone looks perfect. Go ahead and log it, and I will approve the payout tonight."</div>
                  </div>
                </div>
              </div>

              {/* Custom charts block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Weekly Progress</span>
                  <span className="text-brand-600 font-bold">82% Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subtle Neon Orbs */}
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-cyan-200/30 blur-xl animate-float pointer-events-none" />
          <div className="absolute bottom-[-30px] left-[-10px] w-28 h-28 rounded-full bg-brand-200/30 blur-xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-bold mb-3 block">High-Fidelity Platform</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything you need. Done like a pro.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Forget slow, bloated tools. WorkBridge is engineered with real-time architectures, clean workspace layouts, and secure milestone payment flows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-brand-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600 mb-4 border border-brand-100">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ROLE SWITCHER ── */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 bg-white/40">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-cyan-600 font-bold mb-3 block">Real-time Architecture</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            One account. Two powerful modes.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Toggle below to preview how the dashboard interfaces update instantly when switching between hiring and applying.
          </p>
        </div>

        {/* Switch Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/60 flex gap-1">
            <button
              onClick={() => setActiveRole('employer')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeRole === 'employer'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icons.Briefcase />
              Employer Dashboard
            </button>
            <button
              onClick={() => setActiveRole('worker')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeRole === 'worker'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icons.Star />
              Freelancer Dashboard
            </button>
          </div>
        </div>

        {/* Mock Interface Workspace Demo Panel */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-lg">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <span className="text-xs font-semibold text-slate-800 tracking-wide">
                WorkBridge Adaptive Workspace
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3 py-1 bg-slate-200 rounded-lg">
              {activeRole === 'employer' ? 'Recruiter Mode' : 'Freelancer Mode'}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeRole === 'employer' ? (
                <motion.div
                  key="employer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-slate-900 font-display font-bold text-lg">Active Job Posts</h4>
                      <p className="text-xs text-slate-500 mt-1">Review active gig postings and applications.</p>
                    </div>
                    <button className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4.5 py-2.5 rounded-xl transition-soft self-stretch md:self-auto text-center shadow-sm">
                      Post New Request
                    </button>
                  </div>

                  {/* Mock Jobs list */}
                  <div className="space-y-3">
                    {[
                      { title: 'React Native Expert Required', budget: '$2,400', apps: '5 Proposals', status: 'Active Hiring', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                      { title: 'Senior FastAPI backend setup', budget: '$950', apps: '2 Proposals', status: 'Hired & Assigned', color: 'bg-brand-50 text-brand-800 border-brand-200' },
                      { title: 'Landing page visual rewrite', budget: '$450', apps: '0 Proposals', status: 'Drafting', color: 'bg-slate-100 text-slate-600 border-slate-200' }
                    ].map((job, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl gap-3 transition-soft">
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-slate-850">{job.title}</div>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span>Budget: <strong className="text-slate-700">{job.budget}</strong></span>
                            <span>•</span>
                            <span>{job.apps}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${job.color}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="worker"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-slate-900 font-display font-bold text-lg">Active Gigs Board</h4>
                      <p className="text-xs text-slate-500 mt-1">Manage active proposals and complete task assignments.</p>
                    </div>
                    <button className="text-xs bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-bold px-4.5 py-2.5 rounded-xl shadow-sm transition-soft self-stretch md:self-auto text-center hover:opacity-90">
                      Find More Gigs
                    </button>
                  </div>

                  {/* Mock Worker Assignments list */}
                  <div className="space-y-3">
                    {[
                      { client: 'Acme Digital Inc', task: 'Design Visual Mockups', pay: '$1,200', milestone: 'Milestone 2/3', state: 'Awaiting Review' },
                      { client: 'Apex Group', task: 'Uvicorn Backend Optimization', pay: '$800', milestone: 'Completed', state: 'Payout Released' },
                      { client: 'Nexa Corp', task: 'Redux State Migration', pay: '$1,500', milestone: 'Setup', state: 'Draft Proposal' }
                    ].map((assignment, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl gap-3 transition-soft">
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-slate-850">{assignment.task}</div>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span>Client: <strong className="text-slate-700">{assignment.client}</strong></span>
                            <span>•</span>
                            <span>Payout: <strong className="text-slate-700">{assignment.pay}</strong></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-medium">{assignment.milestone}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${jobColor(assignment.state)}`}>
                            {assignment.state}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW TIMELINE ── */}
      <section id="timeline" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-pink-600 font-bold mb-3 block">Simple Operations</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            How WorkBridge Works
          </h2>
          <p className="text-slate-500 text-sm">
            Everything you need to setup your contract, from creation to feedback, is handled securely on one dashboard.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connection line */}
          <div className="absolute left-[18px] md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-300/40 via-cyan-300/40 to-pink-300/20" />

          {/* Timeline steps */}
          {[
            { n: 1, title: 'Create Single Account', desc: 'Register with email. Instantly act as both employer and contractor — no duplicate profiles required.', alignment: 'md:flex-row-reverse md:text-right' },
            { n: 2, title: 'Post Gig or Search Posts', desc: 'Create custom requirement specifications or apply to open assignments with dynamic pricing proposals.', alignment: 'md:flex-row' },
            { n: 3, title: 'Collaborate & Chat Live', desc: 'Communicate updates using integrated real-time WebSocket chat. Track assignment milestones on active dashboards.', alignment: 'md:flex-row-reverse md:text-right' },
            { n: 4, title: 'Complete Gigs & Build Trust', desc: 'Deliver projects, release funds, and build a verified career identity with double-sided reviews.', alignment: 'md:flex-row' }
          ].map((step, i) => (
            <div key={i} className={`flex items-start gap-8 mb-12 relative ${step.alignment}`}>
              <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center text-slate-900 font-extrabold text-sm relative z-10 shadow-sm flex-shrink-0">
                {step.n}
              </div>
              <div className="md:w-1/2 bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-350 transition-soft shadow-sm">
                <h4 className="font-display font-bold text-slate-900 text-base mb-2">{step.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE FAQ SECTION ── */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-slate-200/60">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-bold mb-3 block">Got Questions?</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-slate-800 font-semibold text-sm sm:text-base hover:text-brand-600 transition-soft"
                >
                  <span>{faq.q}</span>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 p-10 md:p-16 text-center shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(108,63,255,0.04),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Ready to work like a pro?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Create an account now and get instant access to the unified freelance platform. Transition fluidly between jobs and contracts, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/login" 
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Access Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              WB
            </div>
            <span className="font-display font-extrabold text-slate-900 text-base tracking-tight">
              WorkBridge
            </span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 WorkBridge. Designed with premium visual craftsmanship. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

// Helper styling state mapping for the interactive mockup (light mode compatible)
function jobColor(state: string): string {
  switch(state) {
    case 'Awaiting Review': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Payout Released': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'Draft Proposal': return 'bg-slate-100 text-slate-600 border-slate-200'
    default: return 'bg-brand-100 text-brand-800 border-brand-200'
  }
}
