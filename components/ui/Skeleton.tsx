import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  rounded?: boolean
  circle?: boolean
}

export function Skeleton({ className, rounded, circle }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton',
        rounded && 'rounded',
        circle && 'rounded-full',
        className
      )}
    />
  )
}

// ─── Pre-composed skeletons ───────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div aria-label="Loading product" className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr aria-label="Loading row">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
