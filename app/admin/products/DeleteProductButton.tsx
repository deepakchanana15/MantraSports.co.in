'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={async () => {
            setDeleting(true)
            await deleteProduct(id)
          }}
          disabled={deleting}
          className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? '…' : 'Delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded border border-neutral-200 p-1.5 text-neutral-500 hover:border-red-300 hover:text-red-600"
      title={`Delete ${name}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  )
}
