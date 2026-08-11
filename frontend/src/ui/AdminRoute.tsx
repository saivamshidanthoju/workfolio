import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

interface Props { children: React.ReactNode }

export default function AdminRoute({ children }: Props) {
  const user = useAuth((s) => s.user)
  if (!user?.is_admin) return <Navigate to="/" replace />
  return <>{children}</>
}
