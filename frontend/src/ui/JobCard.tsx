import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import type { Work } from '../types'
import Badge from './Badge'

interface JobCardProps {
  job: Work
  onApply?: (job: Work) => void
  isOwner?: boolean
  onDelete?: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  'Design':      'bg-pink-500/15 text-pink-300',
  'Development': 'bg-brand-500/15 text-brand-300',
  'Marketing':   'bg-amber-500/15 text-amber-300',
  'Writing':     'bg-emerald-500/15 text-emerald-300',
  'Data':        'bg-cyan-500/15 text-cyan-300',
  'Finance':     'bg-violet-500/15 text-violet-300',
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function JobCard({ job, onApply, isOwner, onDelete }: JobCardProps) {
  const navigate = useNavigate()
  const catColor = CATEGORY_COLORS[job.category] ?? 'bg-slate-500/15 text-slate-300'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="wb-card flex flex-col gap-4 cursor-default"
    >
      {/* Header */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-white leading-snug truncate">{job.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{timeAgo(job.created_at)}</p>
        </div>
        <Badge status={job.status} />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className={`wb-chip ${catColor}`}>{job.category}</span>
        <span className="wb-chip bg-slate-800 text-slate-300">{job.work_type}</span>
        {job.location && (
          <span className="wb-chip bg-slate-800 text-slate-300">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            {job.location}
          </span>
        )}
      </div>

      {/* Budget & Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
        <div>
          <span className="text-lg font-bold text-white">
            ${job.budget.toLocaleString()}
          </span>
          <span className="ml-1 text-xs text-slate-500">/ {job.budget_type.toLowerCase()}</span>
        </div>
        <div className="flex gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => onDelete?.(job.id)}
                className="wb-btn-danger text-xs px-3 py-1.5"
              >
                Delete
              </button>
            </>
          ) : (
            job.status === 'OPEN' && onApply && (
              <button
                onClick={() => onApply(job)}
                className="wb-btn-primary text-xs px-4 py-2"
              >
                Apply Now
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}
