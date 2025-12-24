import React from 'react'

interface ProgressProps {
  value: number // 0-100 arası
  color?: string // Tailwind class (örn: bg-green-500)
  className?: string
  height?: string
}

const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'bg-blue-600',
  className = '',
  height = 'h-2',
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${height} ${className}`}>
      <div
        className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  )
}

export default Progress
