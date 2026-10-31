'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored) as T)
      }
    } catch {
      // Ignore parse errors or unavailable localStorage
    }
  }, [key])

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(value)
        : newValue
      setValue(resolved)
      if (mounted) {
        localStorage.setItem(key, JSON.stringify(resolved))
      }
    } catch {
      // Ignore
    }
  }

  return [value, setStoredValue, mounted] as const
}
