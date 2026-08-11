import client from './client'
import type { Application, ApplicationCreate, Assignment } from '../types'

export async function applyToWork(data: ApplicationCreate): Promise<Application> {
  const res = await client.post<Application>('/applications', data)
  return res.data
}

export async function getMyApplications(): Promise<Application[]> {
  const res = await client.get<Application[]>('/applications/my')
  return res.data
}

export async function getWorkApplications(workId: string): Promise<Application[]> {
  const res = await client.get<Application[]>(`/applications/work/${workId}`)
  return res.data
}

export async function acceptApplication(applicationId: string): Promise<Assignment> {
  const res = await client.put<Assignment>(`/applications/${applicationId}/accept`)
  return res.data
}

export async function rejectApplication(applicationId: string): Promise<void> {
  await client.put(`/applications/${applicationId}/reject`)
}

export async function withdrawApplication(applicationId: string): Promise<void> {
  await client.put(`/applications/${applicationId}/withdraw`)
}
