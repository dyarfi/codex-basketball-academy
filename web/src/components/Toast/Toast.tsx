// web/src/components/Toast/Toast.tsx
import { useEffect, useCallback, useMemo } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 4000,
  onClose,
}) => {
  const handleClose = useCallback(() => {
    onClose(id)
  }, [id, onClose])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => handleClose(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const bgColor = useMemo(
    () =>
      ({
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200',
      })[type],
    [type]
  )

  const textColor = useMemo(
    () =>
      ({
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
        warning: 'text-yellow-800',
      })[type],
    [type]
  )

  const icon = useMemo(
    () =>
      ({
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
      })[type],
    [type]
  )

  return (
    <div
      className={`z- flex max-w-md items-center gap-3 rounded-lg border p-4 shadow-lg ${bgColor}`}
    >
      <span className={`text-xl font-bold ${textColor}`} aria-hidden="true">
        {icon}
      </span>
      <p className={`flex-1 ${textColor}`}>{message}</p>
      <button
        onClick={handleClose}
        aria-label="Close"
        className={`text-lg font-bold hover:opacity-70 ${textColor}`}
      >
        ×
      </button>
    </div>
  )
}

// Export Toast container for app-level usage
export const ToastContainer: React.FC<{
  toasts: Toast[]
  onRemove: (id: string) => void
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  )
}
