import { X } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { AskPanel } from './AskPanel'
import styles from './Ask.module.css'

export function AskDrawer({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close() }, [])
  return (
    <dialog ref={ref} className={styles.drawer} aria-label="Ask the Atlas" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <header className={styles.drawerHead}>
        <strong>Ask the Atlas</strong>
        <span>Grounded in Atlas records</span>
        <button type="button" onClick={onClose} aria-label="Close Ask the Atlas"><X size={18} /></button>
      </header>
      <AskPanel variant="drawer" onNavigate={onClose} />
    </dialog>
  )
}
