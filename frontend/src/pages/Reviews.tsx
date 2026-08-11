import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { getReviews, createReview } from '../api/reviews'
import { getMyAssignments } from '../api/assignments'
import { useAuth } from '../stores/useAuth'
import StarRating from '../ui/StarRating'
import Modal from '../ui/Modal'
import type { ReviewCreate } from '../types'

export default function Reviews() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ReviewCreate>({ assignment_id: '', reviewee_id: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { data: myAssignments = [] } = useQuery('assignments-reviews', getMyAssignments)
  const completedAssignments = myAssignments.filter((a) => a.status === 'COMPLETED')
  const { data: reviews = [], isLoading } = useQuery(
    ['reviews', user?.id], () => getReviews(user!.id), { enabled: !!user }
  )

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      await createReview(form)
      qc.invalidateQueries(['reviews', user?.id])
      setOpen(false)
      setForm({ assignment_id: '', reviewee_id: '', rating: 5, comment: '' })
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit review.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Reviews</h1>
          <p className="text-sm text-slate-400 mt-1">Your reputation on WorkBridge.</p>
        </div>
        {completedAssignments.length > 0 && (
          <button onClick={() => setOpen(true)} className="wb-btn-primary text-sm">
            + Write Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="wb-card flex items-center gap-8"
          style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.04))', borderColor: 'rgba(245,158,11,0.2)' }}>
          <div className="text-center">
            <div className="font-display text-5xl font-extrabold text-white">{avgRating.toFixed(1)}</div>
            <StarRating value={Math.round(avgRating)} readonly size="md" />
            <p className="text-xs text-slate-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4">{star}★</span>
                  <div className="progress-bar flex-1"><div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} /></div>
                  <span className="text-xs text-slate-600 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="wb-card space-y-3">
              <div className="flex gap-3"><div className="skeleton h-10 w-10 rounded-xl" /><div className="skeleton h-5 w-32" /></div>
              <div className="skeleton h-3 w-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⭐</div>
          <p className="text-slate-400">No reviews yet. Complete an assignment to receive your first review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="wb-card">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6c3fff,#ec4899)' }}>
                  {r.reviewer_id.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-semibold text-white">Reviewer #{r.reviewer_id.slice(0, 8)}</span>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{r.comment}</p>
                  <p className="text-[10px] text-slate-600 mt-2">Assignment #{r.assignment_id.slice(0, 8)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Write a Review" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-2xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Assignment</label>
            <select required value={form.assignment_id} onChange={(e) => {
              const a = completedAssignments.find((x) => x.id === e.target.value)
              setForm((f) => ({ ...f, assignment_id: e.target.value, reviewee_id: a ? (a.worker_id === user?.id ? a.client_id : a.worker_id) : '' }))
            }} className="wb-input">
              <option value="">— Select completed assignment —</option>
              {completedAssignments.map((a) => (
                <option key={a.id} value={a.id}>#{a.id.slice(0, 8)} · ${a.accepted_budget}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Rating</label>
            <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size="lg" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Review Comment</label>
            <textarea required rows={4} value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience working on this assignment…" className="wb-input resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="wb-btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={submitting || !form.assignment_id} className="wb-btn-primary flex-1 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
