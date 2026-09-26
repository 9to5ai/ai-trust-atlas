import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from '../app/router'
import { NotFound } from '../routes/NotFound'
import { getSession, loadCorpus } from './api'
import type { Corpus } from './core/schema'
import { Home } from './ui/Home'
import { PracticePage } from './ui/PracticePage'
import { Threshold } from './ui/Threshold'
import styles from './ui/Practice.module.css'

/*
 * AI Trust Practice. Checks the session, shows the threshold (password screen) if needed,
 * then loads the corpus from the gated API and routes within /practice.
 */
type State = { status: 'checking' } | { status: 'locked' } | { status: 'unconfigured' } | { status: 'error'; message: string } | { status: 'open'; corpus: Corpus }

const CorpusContext = createContext<Corpus | undefined>(undefined)
export function useCorpus() {
  const corpus = useContext(CorpusContext)
  if (!corpus) throw new Error('useCorpus must be used inside PracticeApp')
  return corpus
}

export default function PracticeApp() {
  const pathname = usePathname()
  const [state, setState] = useState<State>({ status: 'checking' })

  const open = useCallback(async () => {
    try {
      const session = await getSession()
      if (!session.configured) return setState({ status: 'unconfigured' })
      if (!session.authenticated) return setState({ status: 'locked' })
      setState({ status: 'open', corpus: await loadCorpus() })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setState(message === 'locked' ? { status: 'locked' } : { status: 'error', message })
    }
  }, [])
  useEffect(() => { void open() }, [open])

  if (state.status === 'checking') return <div className={styles.loading} role="status" aria-live="polite">Checking access…</div>
  if (state.status === 'locked') return <Threshold onEnter={open} />
  if (state.status === 'unconfigured') return <Threshold unavailable="AI Trust Practice is not open on this deployment yet." />
  if (state.status === 'error') return <Threshold unavailable={`${state.message}. Please reload the page.`} />

  const practiceMatch = /^\/practice\/p\/([A-Z]{2,3}-\d{2})$/.exec(pathname)
  const practice = practiceMatch && state.corpus.practices.find((item) => item.id === practiceMatch[1])
  return (
    <CorpusContext.Provider value={state.corpus}>
      {pathname === '/practice' ? <Home /> : practice ? <PracticePage key={practice.id} practice={practice} /> : <NotFound />}
    </CorpusContext.Provider>
  )
}
