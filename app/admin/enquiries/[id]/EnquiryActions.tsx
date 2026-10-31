'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateEnquiryStatus, deleteEnquiry } from '@/lib/actions/enquiries'
import type { EnquiryStatus } from '@prisma/client'

export function EnquiryActions({ id, currentStatus }: { id: string; currentStatus: EnquiryStatus }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const changeStatus = async (newStatus: EnquiryStatus) => {
    setSaving(true)
    await updateEnquiryStatus(id, newStatus)
    setStatus(newStatus)
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteEnquiry(id)
    router.push('/admin/enquiries')
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => changeStatus(e.target.value as EnquiryStatus)}
        disabled={saving}
        className="rounded border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500 disabled:opacity-50"
      >
        <option value="NEW">New</option>
        <option value="READ">Read</option>
        <option value="REPLIED">Replied</option>
        <option value="CLOSED">Closed</option>
      </select>

      {confirmDelete ? (
        <span className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? '…' : 'Confirm Delete'}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="rounded border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-500 hover:bg-neutral-50"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-500 hover:border-red-300 hover:text-red-600"
        >
          Delete
        </button>
      )}
    </div>
  )
}
