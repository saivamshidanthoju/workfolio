import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  gradient: string
  trend?: string
  trendUp?: boolean
  prefix?: string
  suffix?: string
  delay?: number
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current || target === 0) return
    startedRef.current = true

    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return count
}

export default function StatCard({
  label,
  value,
  icon,
  gradient,
  trend,
  trendUp,
  prefix = '',
  suffix = '',
  delay = 0,
}: StatCardProps) {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
  const displayed = useCountUp(numValue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="wb-card relative overflow-hidden cursor-default"
    >
      {/* Decorative background gradient */}
      <div
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-20"
        style={{ background: gradient }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold text-white tracking-tight">
          {prefix}{typeof value === 'number' ? displayed.toLocaleString() : value}{suffix}
        </div>
        <div className="mt-1.5 text-sm font-medium text-slate-400">{label}</div>
      </div>
    </motion.div>
  )
}
