import { useState } from 'react'
import { AppShell, universeRoutes } from './app/AppShell'
import { usePathname } from './app/router'
import { QuestionsProvider } from './components/LeadershipQuestions'
import { Methodology } from './components/Methodology'
import { legacyRedirect } from './lib/legacyUrls'
import { Home } from './routes/home/Home'
import { NotFound } from './routes/NotFound'
import { UniverseWorkspace } from './routes/universe/UniverseWorkspace'

function Routes() {
  const pathname = usePathname()
  if (universeRoutes.includes(pathname)) return <UniverseWorkspace />
  if (pathname === '/') return <Home />
  if (pathname === '/methodology') return <Methodology />
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
