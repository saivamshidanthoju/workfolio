import React from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMyPosts } from '../api/works'
import { deleteWork } from '../api/works'
import { useQueryClient } from 'react-query'
import JobCard from '../ui/JobCard'
import SkeletonLoader from '../ui/SkeletonLoader'

export default function MyPosts() {
  const qc = useQueryClient()
  const { data: posts = [], isLoading } = useQuery('my-posts-page', getMyPosts)

  async function handleDelete(id: string) {
    if (!confirm('Delete this job post?')) return
    await deleteWork(id)
    qc.invalidateQueries('my-posts-page')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Job Posts</h1>
          <p className="text-sm text-slate-400 mt-1">{posts.length} job{posts.length !== 1 ? 's' : ''} posted by you.</p>
        </div>
        <Link to="/jobs?post=1" className="wb-btn-primary text-sm">+ New Post</Link>
      </div>

      {isLoading ? (
        <SkeletonLoader type="card" rows={6} />
      ) : posts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display text-xl font-semibold text-white mb-2">No posts yet</h2>
          <p className="text-slate-400 mb-6">Post your first job and start receiving applications.</p>
          <Link to="/jobs" className="wb-btn-primary text-sm">Post a Job →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <JobCard job={job} isOwner onDelete={handleDelete} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
