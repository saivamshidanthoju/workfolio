import client from './client'
import type { Notification } from '../types'

export async function getNotifications(): Promise<Notification[]> {
  const res = await client.get<Notification[]>('/notifications')
  return res.data
}

export async function markAsRead(id: string): Promise<Notification> {
  const res = await client.put<Notification>(`/notifications/${id}/read`)
  return res.data
}

export async function markAllAsRead(): Promise<void> {
  await client.put('/notifications/read-all')
}

export async function deleteNotification(id: string): Promise<void> {
  await client.delete(`/notifications/${id}`)
}
