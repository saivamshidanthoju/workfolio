import client from './client'
import type { Assignment } from '../types'

export interface AssignmentPreview {
  id: string
  client: string
  task: string
  pay: number
  milestone: string
  state: string
}

export async function getMyAssignments(): Promise<Assignment[]> {
  const res = await client.get<Assignment[]>('/assignments/my')
  return res.data
}

export async function getAssignmentsPreview(): Promise<AssignmentPreview[]> {
  const res = await client.get<AssignmentPreview[]>('/assignments/preview')
  return res.data
}


export async function getAssignment(id: string): Promise<Assignment> {
  const res = await client.get<Assignment>(`/assignments/${id}`)
  return res.data
}

export async function completeAssignment(id: string): Promise<Assignment> {
  const res = await client.put<Assignment>(`/assignments/${id}/complete`)
  return res.data
}

export async function cancelAssignment(id: string): Promise<Assignment> {
  const res = await client.put<Assignment>(`/assignments/${id}/cancel`)
  return res.data
}
