import React from 'react'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0)
  const szClass = { sm: 'text-base', md: 'text-2xl', lg: 'text-3xl' }[size]

  return (
    <div className={`flex gap-1 ${szClass}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= (hovered || value)
        return (
          <span
            key={i}
            className={`star select-none ${filled ? 'text-amber-400' : 'text-slate-600'} ${readonly ? 'cursor-default' : ''}`}
            onMouseEnter={() => !readonly && setHovered(i)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(i)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
