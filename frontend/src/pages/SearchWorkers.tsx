import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getWorks } from '../api/works'
import { getWorkerProfileByUserId } from '../api/workerProfile'
import SearchBar from '../ui/SearchBar'
import Badge from '../ui/Badge'
import StarRating from '../ui/StarRating'
import SkeletonLoader from '../ui/SkeletonLoader'

// This page searches for workers by looking at job posters and worker profiles
// We use the works API and show unique owners as potential employer/workers

export default function SearchWorkers() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState('')

  // Fetch all open works to find active users
  const { data: works = [], isLoading } = useQuery(
    ['search-workers', search, category],
    () => getWorks({ search: search || undefined, category: category || undefined, size: 50 })
  )

  // Deduplicate by owner_id to get "employer profiles"
  const uniqueOwners = Array.from(
    new Map(works.map((w) => [w.owner_id, w])).values()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Find Workers & Employers</h1>
        <p className="text-sm text-slate-400 mt-1">Discover active professionals on WorkBridge.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by skill or job title…" className="flex-1 min-w-48" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="wb-input w-auto min-w-36">
          <option value="">All categories</option>
          {['Design', 'Development', 'Marketing', 'Writing', 'Data', 'Finance'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <SkeletonLoader type="card" rows={6} />
      ) : works.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400">No results found. Try different search terms.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-500 mb-4">{works.length} open jobs • {uniqueOwners.length} active employers</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {works.map((job, i) => (
              <motion.div key={job.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="wb-card flex flex-col gap-4 cursor-default"
              >
                {/* Job info */}
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>
                    {job.category[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-snug truncate">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.category} · {job.work_type}</p>
                  </div>
                  <Badge status={job.status} />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <div>
                    <span className="text-base font-bold text-white">${job.budget}</span>
                    <span className="text-xs text-slate-500 ml-1">/ {job.budget_type.toLowerCase()}</span>
                  </div>
                  {job.location && (
                    <span className="text-xs text-slate-500">📍 {job.location}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link to={`/jobs`}
                    className="wb-btn-primary text-xs flex-1 text-center py-2">
                    View Job
                  </Link>
                  <Link to={`/jobs?search=${encodeURIComponent(job.category)}`}
                    className="wb-btn-ghost text-xs px-3 py-2">
                    Similar
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
