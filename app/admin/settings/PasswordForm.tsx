'use client'

import { useState, useRef } from 'react'
import { changeAdminPassword } from '@/lib/actions/admin'

export function PasswordForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const fd = new FormData(e.currentTarget)
    const result = await changeAdminPassword(fd)

    if (result?.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage('Password changed successfully.')
      formRef.current?.reset()
    }
  }

  const inputCls =
    'w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="currentPassword">
          Current Password
        </label>
        <input id="currentPassword" name="currentPassword" type="password" required className={inputCls} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="newPassword">
          New Password <span className="text-neutral-400 font-normal">(min. 8 characters)</span>
        </label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} className={inputCls} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className={inputCls} />
      </div>

      {status === 'success' && (
        <p className="rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          ✓ {message}
        </p>
      )}
      {status === 'error' && (
        <p className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Saving…' : 'Change Password'}
      </button>
    </form>
  )
}
