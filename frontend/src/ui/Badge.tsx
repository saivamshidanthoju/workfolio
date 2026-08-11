import React from 'react'
import type { ApplicationStatus, AssignmentStatus, WorkStatus, AvailabilityStatus } from '../types'

type Status = ApplicationStatus | AssignmentStatus | WorkStatus | AvailabilityStatus | string

const CONFIG: Record<string, { label: string; classes: string }> = {
  // Application
  PENDING:     { label: 'Pending',     classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  SHORTLISTED: { label: 'Shortlisted', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  ACCEPTED:    { label: 'Accepted',    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  REJECTED:    { label: 'Rejected',    classes: 'bg-red-500/15 text-red-300 border-red-500/30' },
  WITHDRAWN:   { label: 'Withdrawn',   classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  // Assignment
  ACTIVE:      { label: 'Active',      classes: 'bg-brand-500/15 text-brand-300 border-brand-500/30' },
  COMPLETED:   { label: 'Completed',   classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  CANCELLED:   { label: 'Cancelled',   classes: 'bg-red-500/15 text-red-300 border-red-500/30' },
  DISPUTED:    { label: 'Disputed',    classes: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  // Work
  OPEN:        { label: 'Open',        classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  // Availability
  AVAILABLE:   { label: 'Available',   classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  BUSY:        { label: 'Busy',        classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  OFFLINE:     { label: 'Offline',     classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
}

interface BadgeProps {
  status: Status
  className?: string
}

export default function Badge({ status, className = '' }: BadgeProps) {
  const cfg = CONFIG[status] ?? { label: status, classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
  return (
    <span className={`wb-chip border text-xs font-semibold ${cfg.classes} ${className}`}>
      {cfg.label}
    </span>
  )
}
