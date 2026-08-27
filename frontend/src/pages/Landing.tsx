import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'
import { getPublicStats, type PublicStats } from '../api/dashboard'
import { getWorks } from '../api/works'
import { getAssignmentsPreview, type AssignmentPreview } from '../api/assignments'
import type { Work } from '../types'

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

  // Dynamic live states
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [assignments, setAssignments] = useState<AssignmentPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem('wb_token')
    if (token && user) {
      navigate('/')
    }
  }, [user, navigate])

  // Fetch dynamic landing page stats & data
  useEffect(() => {
    async function fetchLandingData() {
      try {
        const [statsData, worksData, assignmentsData] = await Promise.all([
          getPublicStats(),
          getWorks({ size: 3 }),
          getAssignmentsPreview(),
        ])
        setStats(statsData)
        setWorks(worksData)
        setAssignments(assignmentsData)
      } catch (error) {
        console.error("Failed to load landing stats & preview data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLandingData()
  }, [])


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

  // Interactive Hero Carousel Slides
  const heroSlides = [
    {
      bg: '/assets/landing-bg.png',
      titleLine1: 'Optimize Every',
      titleHighlight: 'Digital Touchpoint',
      desc: 'From on-demand tasks to full-scale operations, maximize delivery speed to increase completions, empower workers, and accelerate growth.'
    },
    {
      bg: '/assets/landing-bg-2.png',
      titleLine1: 'Social Security &',
      titleHighlight: 'Workforce Coverage',
      desc: 'Empower delivery partners, couriers, and skilled freelancers with transparent milestones, automated escrows, and verified career identities.'
    }
  ]
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto-switch slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

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
    <div className="min-h-screen bg-[#faf8f5] text-slate-700 font-sans selection:bg-brand-500 selection:text-white overflow-hidden relative">
      
      {/* ── STICKY NAVBAR (#cccecf swatch) ── */}
      <header 
        className="sticky top-0 z-50 w-full border-b border-[#b8babb] shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300"
        style={{ backgroundColor: '#cccecf' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5722] via-[#ff7043] to-amber-400 flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19c4-6 12-6 16 0" />
                <circle cx="12" cy="7" r="3" />
                <path d="M7 14l5-3 5 3" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-slate-900 text-lg tracking-tight">
              WorkBridge
            </span>
          </motion.div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#features" className="hover:text-slate-950 transition-colors">Home</a>
            <a href="#workforce" className="hover:text-slate-950 transition-colors">Workforce</a>
            <a href="#demo" className="hover:text-slate-950 transition-colors">What We Offer</a>
            <a href="#timeline" className="hover:text-slate-950 transition-colors">Why Us</a>
            <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-800 hover:text-slate-950 px-4 py-2 rounded-xl transition-colors border border-slate-400/40 hover:bg-white/70 bg-white/50 shadow-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-bold bg-gradient-to-r from-[#ff5722] to-[#ff3d00] hover:from-[#f4511e] hover:to-[#dd2c00] text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      {/* ── HERO BANNER WITH SLIDE CAROUSEL (FITS SCREEN EXACTLY, ULTRA HD & CRISP) ── */}
      <div className="relative h-[calc(100vh-4rem)] flex flex-col justify-between text-white overflow-hidden bg-slate-950">
        
        {/* Full-bleed Ultra HD Image Layer */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={heroSlides[activeSlide].bg}
            src={heroSlides[activeSlide].bg}
            alt="WorkBridge Hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center md:object-right select-none pointer-events-none"
            style={{ 
              imageRendering: '-webkit-optimize-contrast'
            }}
          />
        </AnimatePresence>

        {/* Crisp Clean Gradient on left for text readability, keeping artwork 100% sharp and visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* ── HERO CONTENT OVERLAY ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full my-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl text-left"
            >
              {/* Big Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.06] tracking-tight mb-5">
                {heroSlides[activeSlide].titleLine1}<br />
                <span className="text-[#ff6d00]">{heroSlides[activeSlide].titleHighlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed max-w-xl mb-7 font-normal">
                {heroSlides[activeSlide].desc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff5722] to-[#ff3d00] hover:from-[#f4511e] hover:to-[#dd2c00] text-white font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Get Started</span>
                  <span className="text-lg">→</span>
                </Link>
                <a 
                  href="#demo" 
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-7 py-3 rounded-xl border border-white/20 backdrop-blur-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore Services
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── BOTTOM CONTROLS & PAGINATION BAR ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-8 w-full flex items-center justify-between text-xs text-slate-300">
          
          {/* Pagination Indicators */}
          <div className="flex items-center gap-3 font-semibold">
            <button 
              type="button" 
              onClick={() => setActiveSlide(0)}
              className={`transition-colors cursor-pointer ${activeSlide === 0 ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              01
            </button>
            <div 
              onClick={() => setActiveSlide(0)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === 0 ? 'w-10 bg-[#ff5722]' : 'w-6 bg-white/30 hover:bg-white/50'}`} 
            />
            <div 
              onClick={() => setActiveSlide(1)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === 1 ? 'w-10 bg-[#ff5722]' : 'w-6 bg-white/30 hover:bg-white/50'}`} 
            />
            <button 
              type="button" 
              onClick={() => setActiveSlide(1)}
              className={`transition-colors cursor-pointer ${activeSlide === 1 ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              02
            </button>

            <div className="hidden sm:flex items-center gap-6 ml-6 pl-6 border-l border-white/20 text-xs">
              <div>
                <span className="font-bold text-white text-sm">{stats ? stats.total_talents : '1,240+'}</span>
                <span className="text-slate-400 ml-1.5">Talents</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm">{stats ? stats.total_jobs : '4,850+'}</span>
                <span className="text-slate-400 ml-1.5">Gigs</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm">{stats ? `$${stats.total_released.toLocaleString()}` : '$1.2M+'}</span>
                <span className="text-slate-400 ml-1.5">Released</span>
              </div>
            </div>
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center font-bold text-base shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button 
              type="button"
              onClick={() => setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center font-bold text-base shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Slide"
            >
              ›
            </button>
          </div>

        </div>

      </div>

      {/* ── SIDE-BY-SIDE GIG & PLATFORM WORKERS SPOTLIGHT ── */}
      <section id="workforce" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-[#e9e4d9]/60">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Gig Image Side Display */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 flex items-center justify-center">
            <img 
              src="/assets/landing-bg-2.png" 
              alt="Gig and Platform Workers Platform" 
              className="w-full h-auto object-cover max-h-[380px] hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right Column: Platform Coverage Details */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-5">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Social Security & Milestone Protection for the New-Age Workforce
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              WorkBridge is designed specifically for on-demand couriers, delivery partners, and independent professionals. Built-in escrow deposits safeguard every payout before tasks begin.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 w-full pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="font-bold text-slate-900 text-sm">🔒 100% Escrow Security</div>
                <div className="text-xs text-slate-500 mt-1">Funds locked before gig dispatch</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="font-bold text-slate-900 text-sm">⚡ Instant Milestone Release</div>
                <div className="text-xs text-slate-500 mt-1">Automatic verification & payouts</div>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <span>Join As A Partner</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#e9e4d9]/60">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="rounded-2xl p-6 bg-[#f5f2eb] border border-[#e9e4d9]/80 hover:border-brand-300 transition-all shadow-sm hover:shadow-md cursor-default"
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
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#e9e4d9]/60 bg-[#f5f2eb]/40">
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
          <div className="bg-[#e9e4d9]/60 p-1.5 rounded-2xl border border-[#e9e4d9]/60 flex gap-1">
            <button
              onClick={() => setActiveRole('employer')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeRole === 'employer'
                  ? 'bg-[#faf8f5] text-slate-900 shadow-sm border border-[#e9e4d9]/50'
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
                  ? 'bg-[#faf8f5] text-slate-900 shadow-sm border border-[#e9e4d9]/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icons.Star />
              Freelancer Dashboard
            </button>
          </div>
        </div>

        {/* Dynamic Interface Workspace Demo Panel */}
        <div className="max-w-4xl mx-auto bg-[#f5f2eb] border border-[#e9e4d9]/80 rounded-3xl overflow-hidden shadow-lg">
          <div className="bg-[#faf8f5]/80 px-6 py-4 border-b border-[#e9e4d9]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <span className="text-xs font-semibold text-slate-800 tracking-wide">
                WorkBridge Adaptive Workspace
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3 py-1 bg-[#e9e4d9]/60 rounded-lg">
              {activeRole === 'employer' ? 'Recruiter Mode' : 'Freelancer Mode'}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeRole === 'employer' ? (
                <motion.div
                  key="employer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-slate-900 font-display font-semibold text-lg">Active Job Posts</h4>
                      <p className="text-xs text-slate-500 mt-1">Review active gig postings and applications.</p>
                    </div>
                    <Link
                      to="/register"
                      className="text-xs bg-slate-850 hover:bg-slate-800 text-white font-semibold px-4.5 py-2.5 rounded-xl transition-soft self-stretch md:self-auto text-center shadow-sm"
                    >
                      Post New Request
                    </Link>
                  </div>

                  {/* Dynamic Database Jobs list */}
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="p-6 text-center text-xs text-slate-400">Loading live jobs...</div>
                    ) : works.length === 0 ? (
                      <div className="p-8 text-center bg-[#faf8f5] border border-[#e9e4d9]/50 rounded-2xl">
                        <p className="text-xs text-slate-500 font-medium">No live jobs posted yet.</p>
                        <Link to="/register" className="text-xs text-brand-600 font-semibold hover:underline mt-2 inline-block">Be the first to post a gig!</Link>
                      </div>
                    ) : (
                      works.map((job, idx) => (
                        <motion.div 
                          key={job.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#faf8f5] hover:bg-[#e9e4d9]/30 border border-[#e9e4d9]/60 rounded-2xl gap-3 transition-soft"
                        >
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold text-slate-800">{job.title}</div>
                            <div className="flex gap-4 text-xs text-slate-500">
                              <span>Budget: <span className="text-slate-700">${job.budget.toLocaleString()}</span> ({job.budget_type})</span>
                              <span>•</span>
                              <span>Category: <span className="text-slate-700">{job.category}</span></span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            job.status === 'IN_PROGRESS' ? 'bg-brand-50 text-brand-800 border-brand-200' :
                            'bg-slate-100 text-slate-600 border-[#e9e4d9]'
                          }`}>
                            {job.status === 'OPEN' ? 'Active Hiring' : job.status}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="worker"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-slate-900 font-display font-semibold text-lg">Active Gigs Board</h4>
                      <p className="text-xs text-slate-500 mt-1">Manage active proposals and complete task assignments.</p>
                    </div>
                    <Link
                      to="/register"
                      className="text-xs bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold px-4.5 py-2.5 rounded-xl shadow-sm transition-soft self-stretch md:self-auto text-center hover:opacity-90"
                    >
                      Find More Gigs
                    </Link>
                  </div>

                  {/* Dynamic Database Worker Assignments list */}
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="p-6 text-center text-xs text-slate-400">Loading live assignments...</div>
                    ) : assignments.length === 0 ? (
                      <div className="p-8 text-center bg-[#faf8f5] border border-[#e9e4d9]/50 rounded-2xl">
                        <p className="text-xs text-slate-500 font-medium">No live freelancer contracts are currently in review.</p>
                        <Link to="/register" className="text-xs text-brand-600 font-semibold hover:underline mt-2 inline-block">Create an account to hire freelancers!</Link>
                      </div>
                    ) : (
                      assignments.map((assignment, idx) => (
                        <motion.div 
                          key={assignment.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#faf8f5] hover:bg-[#e9e4d9]/30 border border-[#e9e4d9]/60 rounded-2xl gap-3 transition-soft"
                        >
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold text-slate-800">{assignment.task}</div>
                            <div className="flex gap-4 text-xs text-slate-500">
                              <span>Client: <span className="text-slate-700">{assignment.client}</span></span>
                              <span>•</span>
                              <span>Payout: <span className="text-slate-700">${assignment.pay.toLocaleString()}</span></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">{assignment.milestone}</span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${jobColor(assignment.state)}`}>
                              {assignment.state}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW TIMELINE ── */}
      <section id="timeline" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#e9e4d9]/60">
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

          {/* Timeline steps with scroll animations */}
          {[
            { n: 1, title: 'Create Single Account', desc: 'Register with email. Instantly act as both employer and contractor — no duplicate profiles required.', alignment: 'md:flex-row-reverse md:text-right' },
            { n: 2, title: 'Post Gig or Search Posts', desc: 'Create custom requirement specifications or apply to open assignments with dynamic pricing proposals.', alignment: 'md:flex-row' },
            { n: 3, title: 'Collaborate & Chat Live', desc: 'Communicate updates using integrated real-time WebSocket chat. Track assignment milestones on active dashboards.', alignment: 'md:flex-row-reverse md:text-right' },
            { n: 4, title: 'Complete Gigs & Build Trust', desc: 'Deliver projects, release funds, and build a verified career identity with double-sided reviews.', alignment: 'md:flex-row' }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ 
                opacity: 0, 
                x: i % 2 === 0 ? 120 : -120, 
                rotate: i % 2 === 0 ? 6 : -6 
              }}
              whileInView={{ 
                opacity: 1, 
                x: 0, 
                rotate: 0 
              }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ 
                type: "spring", 
                stiffness: 60, 
                damping: 12, 
                delay: i * 0.1 
              }}
              className={`flex items-start gap-8 mb-12 relative ${step.alignment}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#faf8f5] border-2 border-brand-500 flex items-center justify-center text-slate-900 font-extrabold text-sm relative z-10 shadow-sm flex-shrink-0">
                {step.n}
              </div>
              <div className="md:w-1/2 bg-[#f5f2eb] border border-[#e9e4d9]/80 rounded-2xl p-5 hover:border-brand-200 transition-soft shadow-sm">
                <h4 className="font-display font-bold text-slate-900 text-base mb-2">{step.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE FAQ SECTION ── */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-[#e9e4d9]/60">
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
                className="bg-[#f5f2eb] border border-[#e9e4d9]/80 rounded-2xl overflow-hidden hover:border-[#e9e4d9] transition-all duration-300 shadow-sm"
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
                      <div className="px-6 pb-6 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-[#e9e4d9]/60 pt-4">
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
        <div className="relative rounded-3xl overflow-hidden bg-[#f5f2eb] border border-[#e9e4d9]/80 p-10 md:p-16 text-center shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(108,63,255,0.04),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Ready to work like a pro?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Create an account now and get instant access to the unified freelance platform. Transition fluidly between jobs and contracts, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="flex">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-sm transition-all text-center w-full"
                >
                  Sign Up Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="flex">
                <Link 
                  to="/login" 
                  className="border border-[#e9e4d9] bg-[#faf8f5] hover:bg-[#e9e4d9]/40 text-slate-800 font-semibold px-8 py-4 rounded-xl shadow-sm transition-all text-center w-full"
                >
                  Access Account
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-[#e9e4d9]/60 bg-[#f5f2eb] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19c4-6 12-6 16 0" />
                <circle cx="12" cy="7" r="3" />
                <path d="M7 14l5-3 5 3" />
              </svg>
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
    case 'Draft Proposal': return 'bg-slate-100 text-slate-600 border-[#e9e4d9]'
    default: return 'bg-brand-100 text-brand-800 border-brand-200'
  }
}
