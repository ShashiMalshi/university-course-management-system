import { PropsWithChildren } from 'react'

export default function Modal({ open, title, onClose, children }: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  if (!open) return null
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
