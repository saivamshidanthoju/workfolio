import client from './client'
import type { Profile, ProfileUpdate } from '../types'

export async function getMyProfile(): Promise<Profile> {
  const res = await client.get<Profile>('/profile')
  return res.data
}

export async function updateProfile(data: ProfileUpdate): Promise<Profile> {
  const res = await client.put<Profile>('/profile', data)
  return res.data
}

export async function updateProfileImage(file: File): Promise<Profile> {
  const form = new FormData()
  form.append('file', file)
  const res = await client.put<Profile>('/profile/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function getProfileByUserId(userId: string): Promise<Profile> {
  const res = await client.get<Profile>(`/profile/${userId}`)
  return res.data
}
