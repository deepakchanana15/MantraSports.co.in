import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  brand:    'bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400',
  success:  'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  warning:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  danger:   'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  info:     'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  outline:  'border border-current bg-transparent text-neutral-600 dark:text-neutral-400',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-display font-semibold uppercase tracking-wider',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// ─── Stock Status Badge ────────────────────────────────────────────────────────

import type { StockStatus } from '@/types'

const stockVariants: Record<StockStatus, BadgeVariant> = {
  IN_STOCK: 'success',
  OUT_OF_STOCK: 'danger',
  ON_REQUEST: 'warning',
}

const stockLabels: Record<StockStatus, string> = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  ON_REQUEST: 'On Request',
}

export function StockBadge({ status }: { status: StockStatus }) {
  return (
    <Badge variant={stockVariants[status]}>
      {stockLabels[status]}
    </Badge>
  )
}
