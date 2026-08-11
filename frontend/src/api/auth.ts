import client from './client'
import type { Token, User } from '../types'

export async function loginApi(email: string, password: string): Promise<Token> {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await client.post<Token>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

export async function registerApi(payload: { email: string; password: string }): Promise<User> {
  const res = await client.post<User>('/auth/register', payload)
  return res.data
}

export async function meApi(): Promise<User> {
  const res = await client.get<User>('/auth/me')
  return res.data
}
