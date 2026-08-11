import client from './client'
import type { UploadResponse } from '../types'

export async function uploadProfileImage(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<UploadResponse>('/upload/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function uploadWorkFile(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<UploadResponse>('/upload/work', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function uploadChatFile(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post<UploadResponse>('/upload/chat', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
