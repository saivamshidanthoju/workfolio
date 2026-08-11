import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import { getMyAssignments } from '../api/assignments'
import { getMyApplications } from '../api/applications'
import StatCard from '../ui/StatCard'
import Badge from '../ui/Badge'
import SkeletonLoader from '../ui/SkeletonLoader'
import { ChartSkeleton, StatSkeleton } from '../ui/SkeletonLoader'
import { API_BASE_URL } from '../api/client'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts'

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const NOTIF_ICONS: Record<string, string> = {
  APPLICATION: '📨', ASSIGNMENT: '⚡', MESSAGE: '💬', REVIEW: '⭐', SYSTEM: '🔔',
}

export default function Home() {
  const { data: dash, isLoading: dashLoading } = useQuery('dashboard', getDashboard)
  const { data: assignments = [], isLoading: assLoading } = useQuery('assignments-home', getMyAssignments)
  const { data: myApps = [] } = useQuery('my-apps-home', getMyApplications)

  // ── Real chart data derived from live backend data ──

  // Applications by status (bar chart)
  const appsByStatus = useMemo(() => {
    const counts: Record<string, number> = {}
    myApps.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1
    })
    return Object.entries(counts).map(([status, count]) => ({ status, count }))
  }, [myApps])

  // Assignment timeline grouped by month (area chart)
  const assignmentTimeline = useMemo(() => {
    const monthCounts: Record<string, { month: string; total: number; completed: number }> = {}
    assignments.forEach((a) => {
      const d = new Date(a.created_at)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!monthCounts[key]) monthCounts[key] = { month: key, total: 0, completed: 0 }
      monthCounts[key].total++
      if (a.status === 'COMPLETED') monthCounts[key].completed++
    })
    return Object.values(monthCounts).slice(-6)
  }, [assignments])

  // Status breakdown pie for assignments
  const assignmentPie = useMemo(() => {
    const COLORS: Record<string, string> = {
      ACTIVE: '#6c3fff', COMPLETED: '#10b981',
      CANCELLED: '#ef4444', DISPUTED: '#f59e0b',
    }
    const counts: Record<string, number> = {}
    assignments.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: COLORS[name] ?? '#64748b' }))
  }, [assignments])

  const activeAssignments = assignments.filter((a) => a.status === 'ACTIVE')
  const totalEarnings = assignments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((s, a) => s + a.accepted_budget, 0)

  const profileImage = dash?.profile?.profile_image

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: 'linear-gradient(135deg, rgba(108,63,255,0.22), rgba(56,189,248,0.12))', border: '1px solid rgba(108,63,255,0.25)' }}>
        <div className="blob h-48 w-48" style={{ right: '-40px', top: '-40px', background: 'rgba(108,63,255,0.4)', position: 'absolute' }} />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {profileImage ? (
                <img src={`${API_BASE_URL}/${profileImage}`} className="h-14 w-14 rounded-2xl object-cover border border-white/10" alt="avatar" />
              ) : (
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6c3fff,#ec4899)' }}>
                  {dash?.profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#a99bff' }}>Dashboard</p>
                <h1 className="font-display text-2xl font-bold text-white">
                  Hey, {dash?.profile?.full_name?.split(' ')[0] ?? 'there'} 👋
                </h1>
              </div>
            </div>
            <p className="text-sm max-w-md" style={{ color: '#94a3b8' }}>
              You have{' '}
              <span className="font-semibold text-white">{dash?.stats?.unread_notifications ?? 0} unread notifications</span>
              {' '}and{' '}
              <span className="font-semibold text-white">{activeAssignments.length} active assignments</span>{' '}today.
              {totalEarnings > 0 && (
                <span> Total earned: <span className="font-semibold text-emerald-400">${totalEarnings.toLocaleString()}</span>.</span>
              )}
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/jobs" className="wb-btn-primary text-sm">Browse Jobs</Link>
            <Link to="/jobs" className="wb-btn-ghost text-sm">Post a Job</Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards (live from /dashboard) ── */}
      {dashLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Open Jobs" value={dash?.stats?.open_works ?? 0}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            gradient="linear-gradient(135deg,#6c3fff,#38bdf8)" delay={0.05}
          />
          <StatCard
            label="My Applications" value={dash?.stats?.my_applications ?? 0}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            gradient="linear-gradient(135deg,#ec4899,#6c3fff)" delay={0.1}
          />
          <StatCard
            label="Active Assignments" value={dash?.stats?.active_assignments ?? 0}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            gradient="linear-gradient(135deg,#10b981,#06b6d4)" delay={0.15}
          />
          <StatCard
            label="Unread Alerts" value={dash?.stats?.unread_notifications ?? 0}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" /></svg>}
            gradient="linear-gradient(135deg,#f59e0b,#ef4444)" delay={0.2}
          />
        </div>
      )}

      {/* ── Charts (real data only) ── */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">

        {/* Applications by Status Bar Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="wb-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold text-white">Your Applications</h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Breakdown by current status</p>
            </div>
            <Link to="/applications" className="text-xs hover:underline" style={{ color: '#a99bff' }}>View all →</Link>
          </div>
          {appsByStatus.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm" style={{ color: '#475569' }}>
              No applications yet.{' '}
              <Link to="/jobs" className="ml-1 hover:underline" style={{ color: '#a99bff' }}>Browse jobs →</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={appsByStatus} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6c3fff" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Assignment Status Pie */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="wb-card">
          <h2 className="font-display text-base font-semibold text-white mb-1">Assignments</h2>
          <p className="text-xs mb-5" style={{ color: '#64748b' }}>Status breakdown</p>
          {assignmentPie.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="text-3xl">⚡</div>
              <p className="text-sm text-center" style={{ color: '#475569' }}>No assignments yet.</p>
              <Link to="/jobs" className="wb-btn-primary text-xs px-4 py-2">Find Work →</Link>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={assignmentPie} cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={4} dataKey="value">
                    {assignmentPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {assignmentPie.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span style={{ color: '#94a3b8' }}>{d.name}</span>
                    </div>
                    <span className="font-medium text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Assignment Timeline (area chart, real data) ── */}
      {assignmentTimeline.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="wb-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold text-white">Assignment Timeline</h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Monthly totals vs completed</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={assignmentTimeline}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6c3fff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6c3fff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total"     name="Total"     stroke="#6c3fff" fill="url(#gradTotal)" strokeWidth={2} dot={{ fill: '#6c3fff', r: 4 }} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" fill="url(#gradDone)"  strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── Active Assignments + Notifications ── */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Active Assignments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="wb-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-white">Active Assignments</h2>
            <Link to="/assignments" className="text-xs hover:underline" style={{ color: '#a99bff' }}>View all →</Link>
          </div>
          {assLoading ? (
            <SkeletonLoader type="list" rows={3} />
          ) : activeAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="text-3xl">⚡</div>
              <p className="text-sm" style={{ color: '#475569' }}>No active assignments.</p>
              <Link to="/jobs" className="wb-btn-primary text-xs px-4 py-2">Browse Jobs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAssignments.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div className="text-sm font-medium text-white">#{a.id.slice(0,8)}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>${a.accepted_budget} budget · {timeAgo(a.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={a.status} />
                    <Link to={`/chat/${a.id}`} title="Open chat"
                      className="flex h-8 w-8 items-center justify-center rounded-xl transition-soft hover:opacity-80"
                      style={{ background: 'rgba(108,63,255,0.15)', fontSize: '1rem' }}>
                      💬
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="wb-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-white">Recent Alerts</h2>
            <Link to="/notifications" className="text-xs hover:underline" style={{ color: '#a99bff' }}>View all →</Link>
          </div>
          {dashLoading ? (
            <SkeletonLoader type="list" rows={3} />
          ) : (dash?.recent_notifications ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="text-3xl">🔔</div>
              <p className="text-sm" style={{ color: '#475569' }}>All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(dash?.recent_notifications ?? []).slice(0, 5).map((n) => (
                <div key={n.id}
                  className="flex gap-3 items-start rounded-2xl p-3.5"
                  style={!n.is_read
                    ? { background: 'rgba(108,63,255,0.07)', border: '1px solid rgba(108,63,255,0.18)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-base flex-shrink-0 mt-0.5">{NOTIF_ICONS[n.type] ?? '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{n.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#64748b' }}>{n.message}</p>
                  </div>
                  {!n.is_read && <div className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#6c3fff' }} />}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Worker Profile Quick Card ── */}
      {dash?.worker_profile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="wb-card flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.06))', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>Your Worker Profile</p>
            <h3 className="font-display text-lg font-semibold text-white">{dash.worker_profile.headline ?? 'Set your headline'}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="text-sm" style={{ color: '#94a3b8' }}>⭐ {dash.worker_profile.average_rating.toFixed(1)} rating</span>
              <span className="text-sm" style={{ color: '#94a3b8' }}>✅ {dash.worker_profile.completed_works} completed</span>
              <span className="text-sm" style={{ color: '#94a3b8' }}>💵 ${dash.worker_profile.hourly_rate}/hr</span>
              <Badge status={dash.worker_profile.availability} />
            </div>
          </div>
          <Link to="/worker-profile" className="wb-btn-ghost text-sm flex-shrink-0">Edit Profile →</Link>
        </motion.div>
      )}
    </div>
  )
}
