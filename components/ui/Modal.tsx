'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
  className?: string
}

const sizeClasses = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Open/close the native dialog element
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      dialog.showModal()
    } else {
      dialog.close()
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Close on Escape key (native dialog handles this, but we need to sync state)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={handleBackdropClick}
      className={cn(
        'w-full rounded-none border border-neutral-200 bg-white p-0 shadow-2xl',
        'dark:border-neutral-800 dark:bg-neutral-900',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        'open:animate-scale-in',
        sizeClasses[size],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div>
          <h2
            id="modal-title"
            className="font-display text-lg font-bold uppercase tracking-tight text-neutral-900 dark:text-white"
          >
            {title}
          </h2>
          {description && (
            <p id="modal-description" className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="ml-4 rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </dialog>
  )
}
