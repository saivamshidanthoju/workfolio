import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { getMessages } from '../api/messages'
import { getMyAssignments } from '../api/assignments'
import { useAuth } from '../stores/useAuth'
import type { Message } from '../types'

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function Chat() {
  const { assignmentId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: myAssignments = [] } = useQuery('assignments-chat', getMyAssignments)
  const currentAssignment = myAssignments.find((a) => a.id === assignmentId)

  // Load message history
  const { data: history = [] } = useQuery(
    ['messages', assignmentId],
    () => getMessages(assignmentId!),
    { enabled: !!assignmentId, onSuccess: (d) => setMessages(d) }
  )

  // WebSocket connection
  useEffect(() => {
    if (!assignmentId) return
    let ws: WebSocket
    let reconnect = 0
    let unmounted = false

    function connect() {
      const token = localStorage.getItem('wb_token')
      ws = new WebSocket(`ws://127.0.0.1:8000/ws/${assignmentId}?token=${token}`)
      wsRef.current = ws
      ws.onopen = () => { if (!unmounted) { setConnected(true); reconnect = 0 } }
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data) as Message
          if (!unmounted) setMessages((m) => [...m, msg])
        } catch {}
      }
      ws.onclose = () => {
        if (!unmounted) {
          setConnected(false)
          reconnect++
          setTimeout(connect, Math.min(30000, 1000 * 2 ** reconnect))
        }
      }
      ws.onerror = () => ws.close()
    }

    connect()
    return () => { unmounted = true; ws?.close() }
  }, [assignmentId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ message: text.trim() }))
    setText('')
    inputRef.current?.focus()
  }

  const otherChats = myAssignments.filter((a) => a.id !== assignmentId && a.status === 'ACTIVE')

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-5">
      {/* Sidebar: other chats */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
        <div className="wb-card flex-1 flex flex-col overflow-hidden">
          <h2 className="font-display text-sm font-semibold text-white mb-4">Active Chats</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {myAssignments.filter((a) => a.status === 'ACTIVE').map((a) => (
              <Link key={a.id} to={`/chat/${a.id}`}
                className={`flex items-center gap-3 rounded-2xl p-3 transition-soft ${a.id === assignmentId ? 'bg-brand-500/15 border border-brand-500/25' : 'hover:bg-white/[0.04]'}`}
                style={a.id !== assignmentId ? { border: '1px solid rgba(255,255,255,0.05)' } : {}}>
                <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6c3fff,#38bdf8)' }}>
                  {a.id.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">#{a.id.slice(0, 8)}</p>
                  <p className="text-[10px] text-slate-500">${a.accepted_budget}</p>
                </div>
              </Link>
            ))}
            {myAssignments.filter((a) => a.status === 'ACTIVE').length === 0 && (
              <p className="text-xs text-slate-600 text-center py-4">No active assignments</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat */}
      {!assignmentId ? (
        <div className="flex-1 wb-card flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl">💬</div>
          <h2 className="font-display text-lg font-semibold text-white">Select a conversation</h2>
          <p className="text-sm text-slate-400">Choose an assignment chat from the sidebar.</p>
          <Link to="/assignments" className="wb-btn-primary text-sm">Go to Assignments →</Link>
        </div>
      ) : (
        <div className="flex-1 wb-card flex flex-col overflow-hidden p-0">
          {/* Chat header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                Assignment #{assignmentId.slice(0, 8)}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-xs text-slate-500">{connected ? 'Connected' : 'Reconnecting…'}</span>
              </div>
            </div>
            {currentAssignment && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-slate-500">Budget: ${currentAssignment.accepted_budget}</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isMe = m.sender_id === user?.id
                return (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] flex flex-col gap-1">
                      <div className={isMe ? 'chat-bubble-out' : 'chat-bubble-in'}>
                        {m.message}
                      </div>
                      <span className={`text-[10px] text-slate-600 ${isMe ? 'text-right' : 'text-left'}`}>
                        {formatTime(m.created_at)}
                        {isMe && m.is_read && <span className="ml-1 text-brand-400">✓✓</span>}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {messages.length === 0 && (
              <div className="text-center text-slate-600 text-sm py-10">No messages yet. Say hello! 👋</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={connected ? 'Type a message…' : 'Connecting…'}
                disabled={!connected}
                className="wb-input flex-1 disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={!connected || !text.trim()}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="wb-btn-primary px-5 disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
