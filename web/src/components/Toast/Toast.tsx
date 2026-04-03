// web/src/components/Toast/Toast.tsx
import { useEffect } from 'react'

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
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[type]

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 border rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-md ${bgColor}`}
    >
      <span className={`text-xl font-bold ${textColor}`}>{icon}</span>
      <p className={`flex-1 ${textColor}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
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
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  )
}
