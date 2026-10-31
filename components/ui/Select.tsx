import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`
    const errorId = error ? `${selectId}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {props.required && (
              <span aria-label="required" className="ml-1 text-brand-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={errorId}
            aria-invalid={!!error}
            className={cn(
              'block w-full appearance-none border bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900',
              'transition-colors duration-150 focus:outline-none focus:border-brand-500',
              'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
              'dark:bg-neutral-900 dark:text-white dark:focus:border-brand-500',
              error
                ? 'border-red-400 dark:border-red-700'
                : 'border-neutral-300 dark:border-neutral-700',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {hint && !error && (
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
