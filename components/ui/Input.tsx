import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {props.required && (
              <span aria-label="required" className="ml-1 text-brand-500">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="pointer-events-none absolute left-0 flex h-full items-center pl-3 text-neutral-400">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            className={cn(
              'block w-full border bg-white text-sm text-neutral-900 placeholder-neutral-400',
              'transition-colors duration-150',
              'focus:outline-none focus:border-brand-500',
              'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
              'dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-600',
              'dark:focus:border-brand-500',
              error
                ? 'border-red-400 dark:border-red-700'
                : 'border-neutral-300 dark:border-neutral-700',
              leftAddon ? 'pl-10' : 'px-4',
              rightAddon ? 'pr-10' : 'pr-4',
              'py-2.5',
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-0 flex h-full items-center pr-3 text-neutral-400">
              {rightAddon}
            </div>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {hint}
          </p>
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

Input.displayName = 'Input'
