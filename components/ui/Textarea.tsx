import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
    const inputId = id ?? `textarea-${Math.random().toString(36).slice(2)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {label}
              {props.required && (
                <span aria-label="required" className="ml-1 text-brand-500">*</span>
              )}
            </label>
            {showCount && maxLength && (
              <span
                aria-live="polite"
                className={cn(
                  'text-xs',
                  charCount > maxLength * 0.9
                    ? 'text-red-500'
                    : 'text-neutral-400'
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={cn(
            'block w-full resize-y border bg-white px-4 py-2.5 text-sm text-neutral-900',
            'placeholder-neutral-400 transition-colors duration-150',
            'focus:outline-none focus:border-brand-500',
            'disabled:cursor-not-allowed disabled:bg-neutral-50',
            'dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-600',
            'dark:focus:border-brand-500',
            error
              ? 'border-red-400 dark:border-red-700'
              : 'border-neutral-300 dark:border-neutral-700',
            className
          )}
          rows={props.rows ?? 4}
          {...props}
        />

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

Textarea.displayName = 'Textarea'
