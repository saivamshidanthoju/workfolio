import React from 'react'

interface SkeletonProps {
  className?: string
  rows?: number
  type?: 'card' | 'list' | 'stat' | 'chart'
}

function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function StatSkeleton() {
  return (
    <div className="wb-card flex flex-col gap-4">
      <SkeletonBox className="h-3 w-24" />
      <SkeletonBox className="h-9 w-20" />
      <SkeletonBox className="h-3 w-32" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="wb-card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-2/3" />
      <div className="flex gap-3 pt-2">
        <SkeletonBox className="h-6 w-20 rounded-full" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="wb-card flex items-center gap-4">
          <SkeletonBox className="h-11 w-11 rounded-2xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-3 w-1/2" />
          </div>
          <SkeletonBox className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="wb-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonBox className="h-48 w-full rounded-2xl" />
    </div>
  )
}

export default function SkeletonLoader({ type = 'card', rows = 3 }: SkeletonProps) {
  if (type === 'stat') return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
    </div>
  )
  if (type === 'list') return <ListSkeleton rows={rows} />
  if (type === 'chart') return <ChartSkeleton />
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}
