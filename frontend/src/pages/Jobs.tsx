import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { getWorks, createWork, deleteWork } from '../api/works'
import { applyToWork } from '../api/applications'
import { useAuth } from '../stores/useAuth'
import JobCard from '../ui/JobCard'
import Modal from '../ui/Modal'
import SearchBar from '../ui/SearchBar'
import SkeletonLoader from '../ui/SkeletonLoader'
import type { Work, WorkCreate } from '../types'

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Writing', 'Data', 'Finance', 'Other']
const WORK_TYPES = ['REMOTE', 'ONSITE', 'HYBRID'] as const
const BUDGET_TYPES = ['FIXED', 'HOURLY'] as const

export default function Jobs() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [workType, setWorkType] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [postOpen, setPostOpen] = useState(false)
  const [applyOpen, setApplyOpen] = useState<Work | null>(null)
  const [applyProposal, setApplyProposal] = useState('')
  const [applyBudget, setApplyBudget] = useState('')
  const [posting, setPosting] = useState(false)
  const [applying, setApplying] = useState(false)
  const [postError, setPostError] = useState('')
  const [applyError, setApplyError] = useState('')
  const [viewMyPosts, setViewMyPosts] = useState(false)

  // Post form state
  const [form, setForm] = useState<WorkCreate>({
    title: '', description: '', category: 'Development',
    work_type: 'REMOTE', budget: 100, budget_type: 'FIXED',
    location: '', deadline: '',
  })

  const queryKey = ['works', search, category, workType, budgetMin, budgetMax, viewMyPosts]
  const { data: works = [], isLoading } = useQuery(queryKey, () =>
    getWorks({ search: search || undefined, category: category || undefined, budget_min: budgetMin ? +budgetMin : undefined, budget_max: budgetMax ? +budgetMax : undefined })
  )

  const myPosts = works.filter((w) => w.owner_id === user?.id)
  const displayedWorks = viewMyPosts ? myPosts : works

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    setPostError('')
    setPosting(true)
    try {
      await createWork({ ...form, budget: Number(form.budget) })
      qc.invalidateQueries('works')
      setPostOpen(false)
      setForm({ title: '', description: '', category: 'Development', work_type: 'REMOTE', budget: 100, budget_type: 'FIXED', location: '', deadline: '' })
    } catch (e: any) {
      setPostError(e?.response?.data?.detail || 'Failed to post job.')
    } finally {
      setPosting(false)
    }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!applyOpen) return
    setApplyError('')
    setApplying(true)
    try {
      await applyToWork({ work_id: applyOpen.id, proposal: applyProposal, expected_budget: Number(applyBudget) })
      setApplyOpen(null)
      setApplyProposal('')
      setApplyBudget('')
    } catch (e: any) {
      setApplyError(e?.response?.data?.detail || 'Application failed.')
    } finally {
      setApplying(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this job post?')) return
    await deleteWork(id)
    qc.invalidateQueries('works')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Jobs Board</h1>
          <p className="text-sm text-slate-400 mt-1">{displayedWorks.length} job{displayedWorks.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMyPosts((v) => !v)}
            className={`wb-btn-ghost text-sm py-2 ${viewMyPosts ? 'border-brand-500/40 text-brand-300' : ''}`}>
            {viewMyPosts ? 'All Jobs' : 'My Posts'}
          </button>
          <button onClick={() => setPostOpen(true)} className="wb-btn-primary text-sm">
            + Post a Job
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search jobs…" className="flex-1 min-w-48" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="wb-input w-auto min-w-36">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={workType} onChange={(e) => setWorkType(e.target.value)}
          className="wb-input w-auto min-w-32">
          <option value="">All types</option>
          {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)}
          placeholder="Min $" type="number" className="wb-input w-24" />
        <input value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}
          placeholder="Max $" type="number" className="wb-input w-24" />
        {(search || category || workType || budgetMin || budgetMax) && (
          <button onClick={() => { setSearch(''); setCategory(''); setWorkType(''); setBudgetMin(''); setBudgetMax('') }}
            className="wb-btn-ghost text-sm py-2 px-4">Clear</button>
        )}
      </div>

      {/* Job Grid */}
      {isLoading ? (
        <SkeletonLoader type="card" rows={6} />
      ) : displayedWorks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400">No jobs found. Try adjusting filters.</p>
          <button onClick={() => setPostOpen(true)} className="mt-4 wb-btn-primary text-sm">Post the first job →</button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayedWorks.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <JobCard
                job={job}
                isOwner={job.owner_id === user?.id}
                onApply={setApplyOpen}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Post Job Modal */}
      <Modal open={postOpen} onClose={() => setPostOpen(false)} title="Post a New Job" size="lg">
        <form onSubmit={handlePost} className="space-y-4">
          {postError && <div className="rounded-2xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{postError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Job Title *</label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. React Developer for SaaS App" className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Category *</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="wb-input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Work Type</label>
              <select value={form.work_type} onChange={(e) => setForm((f) => ({ ...f, work_type: e.target.value as any }))} className="wb-input">
                {WORK_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Budget ($) *</label>
              <input type="number" required min="1" value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: +e.target.value }))} className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Budget Type</label>
              <select value={form.budget_type} onChange={(e) => setForm((f) => ({ ...f, budget_type: e.target.value as any }))} className="wb-input">
                {BUDGET_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Location</label>
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Remote, Mumbai" className="wb-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="wb-input" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Description * (min 20 chars)</label>
              <textarea required rows={4} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the job requirements, deliverables, and expectations…"
                className="wb-input resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setPostOpen(false)} className="wb-btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={posting} className="wb-btn-primary flex-1 disabled:opacity-60">
              {posting ? 'Posting…' : 'Post Job'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Apply Modal */}
      <Modal open={!!applyOpen} onClose={() => setApplyOpen(null)} title={`Apply: ${applyOpen?.title ?? ''}`} size="md">
        <form onSubmit={handleApply} className="space-y-4">
          {applyError && <div className="rounded-2xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{applyError}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Your Proposal * (min 20 chars)</label>
            <textarea required rows={5} value={applyProposal} onChange={(e) => setApplyProposal(e.target.value)}
              placeholder="Describe your experience, approach, and why you're the best fit…"
              className="wb-input resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Expected Budget ($) *</label>
            <input type="number" required min="1" value={applyBudget} onChange={(e) => setApplyBudget(e.target.value)}
              placeholder={`Job budget: $${applyOpen?.budget}`} className="wb-input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setApplyOpen(null)} className="wb-btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={applying} className="wb-btn-primary flex-1 disabled:opacity-60">
              {applying ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
