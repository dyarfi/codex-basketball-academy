import React, { createContext, useContext, useCallback, useState } from 'react'

import { Toast, ToastContainer, ToastType } from '../components/Toast/Toast'

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => string
  removeToast: (id: string) => void
  success: (message: string) => string
  error: (message: string) => string
  info: (message: string) => string
  warning: (message: string) => string
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')
  const info = (message: string) => addToast(message, 'info')
  const warning = (message: string) => addToast(message, 'warning')

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info, warning }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useGlobalToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useGlobalToast must be used within a ToastProvider')
  }
  return context
}
