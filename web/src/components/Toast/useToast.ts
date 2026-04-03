// web/src/components/Toast/useToast.ts
import { useState, useCallback } from 'react'
import type { Toast, ToastType } from './Toast'

interface UseToastReturn {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => string
  removeToast: (id: string) => void
  success: (message: string) => string
  error: (message: string) => string
  info: (message: string) => string
  warning: (message: string) => string
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(7)
      setToasts((prev) => [...prev, { id, type, message, duration }])
      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast])
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast])
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast])
  const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
