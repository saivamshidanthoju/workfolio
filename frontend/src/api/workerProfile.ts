import client from './client'
import type { WorkerProfile, WorkerProfileUpdate } from '../types'

export async function getMyWorkerProfile(): Promise<WorkerProfile> {
  const res = await client.get<WorkerProfile>('/worker-profile')
  return res.data
}

export async function updateWorkerProfile(data: WorkerProfileUpdate): Promise<WorkerProfile> {
  const res = await client.put<WorkerProfile>('/worker-profile', data)
  return res.data
}

export async function getWorkerProfileByUserId(userId: string): Promise<WorkerProfile> {
  const res = await client.get<WorkerProfile>(`/worker-profile/${userId}`)
  return res.data
}
