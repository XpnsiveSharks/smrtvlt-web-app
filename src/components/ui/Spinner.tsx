interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: { container: 'w-10 h-10', dot: 'w-2 h-2', top: 'top-[14px]' },
  md: { container: 'w-16 h-16', dot: 'w-3 h-3', top: 'top-[26px]' },
  lg: { container: 'w-20 h-20', dot: 'w-3.5 h-3.5', top: 'top-[33px]' },
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const config = sizeConfig[size]

  return (
    <div className={`relative inline-block ${config.container} ${className}`}>
      <div className={`absolute ${config.top} left-2 ${config.dot} rounded-full bg-brand animate-dots1`} />
      <div className={`absolute ${config.top} left-2 ${config.dot} rounded-full bg-brand animate-dots2`} />
      <div className={`absolute ${config.top} left-8 ${config.dot} rounded-full bg-brand animate-dots2`} />
      <div className={`absolute ${config.top} left-14 ${config.dot} rounded-full bg-brand animate-dots3`} />
    </div>
  )
}
