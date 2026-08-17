import client from './client'
import type { Dashboard } from '../types'

export interface PublicStats {
  total_talents: number
  total_jobs: number
  total_assignments: number
  total_released: number
}

export async function getDashboard(): Promise<Dashboard> {
  const res = await client.get<Dashboard>('/dashboard')
  return res.data
}

export async function getPublicStats(): Promise<PublicStats> {
  const res = await client.get<PublicStats>('/dashboard/public-stats')
  return res.data
}

