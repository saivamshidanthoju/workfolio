import { create } from 'zustand'
import { loginApi, meApi, registerApi } from '../api/auth'
import type { User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (payload: { email: string; password: string }) => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const data = await loginApi(email, password)
      localStorage.setItem('wb_token', data.access_token)
      const me = await meApi()
      set({ user: me, loading: false })
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },

  logout: () => {
    localStorage.removeItem('wb_token')
    set({ user: null })
  },

  register: async (payload) => {
    set({ loading: true })
    try {
      await registerApi(payload)
      set({ loading: false })
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('wb_token')
    if (!token) return
    try {
      const me = await meApi()
      set({ user: me })
    } catch {
      set({ user: null })
    }
  },
}))
