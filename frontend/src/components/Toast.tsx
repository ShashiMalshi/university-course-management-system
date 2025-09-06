import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Toast = { id: number; type: 'success' | 'error'; message: string }
type ToastCtx = { push: (t: Omit<Toast, 'id'>) => void }

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, ...t }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500)
  }, [])
  const value = useMemo(() => ({ push }), [push])
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={t.type === 'success' ? 'toast-success' : 'toast-error'}>{t.message}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if(!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
