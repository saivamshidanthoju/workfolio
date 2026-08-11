import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askAI } from '../api/ai'

interface Msg { role: 'user' | 'assistant'; text: string }

export default function AIConsole() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Hi! I\'m your WorkBridge AI assistant. Ask me anything about jobs, assignments, or how to use the platform.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function handleSend() {
    if (!input.trim() || loading) return
    const prompt = input.trim()
    setInput('')
    setMsgs((m) => [...m, { role: 'user', text: prompt }])
    setLoading(true)
    try {
      const res = await askAI(prompt)
      setMsgs((m) => [...m, { role: 'assistant', text: res.answer }])
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Sorry, I couldn\'t reach the AI service right now.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="ai-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(108,63,255,0.2)' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">✦</span>
                <span className="font-display text-sm font-semibold text-white">AI Assistant</span>
              </div>
              <button
                onClick={() => setMsgs([msgs[0]])}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-soft"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'text-slate-300 rounded-tl-sm'
                    }`}
                    style={
                      m.role === 'user'
                        ? { background: 'linear-gradient(135deg, #6c3fff, #38bdf8)' }
                        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-400" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <span className="animate-pulse-soft">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 pt-0">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything…"
                  className="wb-input text-xs py-2.5 flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="wb-btn-primary px-3 py-2.5 text-xs disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="ai-bubble"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="AI Assistant"
      >
        <span className="text-xl">{open ? '✕' : '✦'}</span>
      </motion.button>
    </div>
  )
}
