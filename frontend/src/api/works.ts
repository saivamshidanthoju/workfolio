import client from './client'
import type { Work, WorkCreate, WorkFilter } from '../types'

export async function getWorks(filters: WorkFilter = {}): Promise<Work[]> {
  const res = await client.get<Work[]>('/works', { params: filters })
  return res.data
}

export async function getWork(id: string): Promise<Work> {
  const res = await client.get<Work>(`/works/${id}`)
  return res.data
}

export async function getMyPosts(): Promise<Work[]> {
  const res = await client.get<Work[]>('/works/my-posts')
  return res.data
}

export async function createWork(data: WorkCreate): Promise<Work> {
  const res = await client.post<Work>('/works', data)
  return res.data
}

export async function updateWork(id: string, data: Partial<WorkCreate>): Promise<Work> {
  const res = await client.put<Work>(`/works/${id}`, data)
  return res.data
}

export async function deleteWork(id: string): Promise<void> {
  await client.delete(`/works/${id}`)
}
