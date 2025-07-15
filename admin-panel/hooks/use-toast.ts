import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString()
    const newToast: Toast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    return {
      id,
      dismiss: () => setToasts(prev => prev.filter(t => t.id !== id)),
      update: (updates: Partial<Omit<Toast, 'id'>>) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
      }
    }
  }, [])

  return {
    toast,
    toasts,
    dismiss: (id: string) => setToasts(prev => prev.filter(t => t.id !== id))
  }
}