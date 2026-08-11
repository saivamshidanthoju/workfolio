import client from './client'
import type { AIResponse } from '../types'

export async function askAI(prompt: string): Promise<AIResponse> {
  const res = await client.post<AIResponse>('/ai/ask', { prompt })
  return res.data
}
