import { useState } from 'react'
import { AppShell, universeRoutes } from './app/AppShell'
import { usePathname } from './app/router'
import { QuestionsProvider } from './components/LeadershipQuestions'
import { legacyRedirect } from './lib/legacyUrls'
import { NotFound } from './routes/NotFound'
import { UniverseWorkspace } from './routes/universe/UniverseWorkspace'
import { LibraryPage } from './routes/library/LibraryPage'
import { SourcePage } from './routes/library/SourcePage'
import { ComparePage } from './routes/library/ComparePage'
import { AskPage } from './ask/AskPage'

function Routes() {
  const pathname = usePathname()
  if (universeRoutes.includes(pathname)) return <UniverseWorkspace />
  if (pathname === '/library') return <LibraryPage />
  if (pathname === '/library/compare') return <ComparePage />
  if (pathname.startsWith('/library/')) return <SourcePage key={pathname} id={decodeURIComponent(pathname.slice('/library/'.length))} />
  if (pathname === '/ask') return <AskPage />
  return <NotFound />
}

export default function App() {
  // Rewrite pre-2026.10 shared links (site root + query/hash) before the first route is read.
  useState(() => {
    const target = legacyRedirect(new URL(window.location.href))
    if (target) window.history.replaceState(null, '', target)
    return target
  })
  return (
    <QuestionsProvider>
      <AppShell>
        <Routes />
      </AppShell>
    </QuestionsProvider>
  )
}
