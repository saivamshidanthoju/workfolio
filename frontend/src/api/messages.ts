import client from './client'
import type { Message, MessageCreate, Conversation } from '../types'

export async function getMessages(assignmentId: string): Promise<Message[]> {
  const res = await client.get<Message[]>(`/messages/${assignmentId}`)
  return res.data
}

export async function sendMessage(assignmentId: string, data: MessageCreate): Promise<Message> {
  const res = await client.post<Message>(`/messages/${assignmentId}`, data)
  return res.data
}

export async function deleteMessage(messageId: string): Promise<void> {
  await client.delete(`/messages/${messageId}`)
}

export async function getMyChats(): Promise<Conversation[]> {
  const res = await client.get<Conversation[]>('/chat')
  return res.data
}

export async function getChat(assignmentId: string): Promise<Conversation> {
  const res = await client.get<Conversation>(`/chat/${assignmentId}`)
  return res.data
}
