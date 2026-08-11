import React, { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }: SearchBarProps) {
  const [internal, setInternal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setInternal(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(v), 400)
  }

  // sync external reset
  useEffect(() => { setInternal(value) }, [value])

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        className="wb-input pl-11 pr-4"
      />
    </div>
  )
}
