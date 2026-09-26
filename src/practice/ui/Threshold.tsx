import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AtlasMark } from '../../components/AtlasMark'
import { Link } from '../../app/router'
import { login } from '../api'
import styles from './Threshold.module.css'

/* The password screen: a quiet, full-screen entry to AI Trust Practice. */
export function Threshold({ onEnter, unavailable }: { onEnter?: () => void; unavailable?: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { input.current?.focus() }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError(undefined)
    const result = await login(password)
    setBusy(false)
    if (result.ok) onEnter?.()
    else { setError(result.error); setPassword(''); input.current?.focus() }
  }

  return (
    <main id="main-content" className={styles.threshold} aria-labelledby="threshold-title">
      <div className={styles.panel}>
        <span className={styles.mark} aria-hidden="true"><AtlasMark size={40} /></span>
        <h1 id="threshold-title" className={styles.title}>AI Trust Practice</h1>
        <p className={styles.lede}>Practices, assessment and evidence for people running AI trust work in their organisations. Access is shared personally.</p>
        {unavailable ? <p className={styles.notice} role="status">{unavailable}</p> : (
          <form className={styles.form} onSubmit={submit}>
            <label htmlFor="practice-password" className={styles.label}>Password</label>
            <div className={styles.row}>
              <input ref={input} id="practice-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={!!error} aria-describedby={error ? 'practice-password-error' : undefined} className={styles.input} />
              <button type="submit" className={styles.enter} disabled={!password || busy}>{busy ? 'Checking…' : 'Enter'}</button>
            </div>
            {error && <p id="practice-password-error" className={styles.error} role="alert">{error}</p>}
          </form>
        )}
        <p className={styles.fine}>Nothing about you or your organisation is stored on this site. Your work stays in this browser until you export it.</p>
        <Link to="/universe" className={styles.back}>Return to the Atlas</Link>
      </div>
    </main>
  )
}
