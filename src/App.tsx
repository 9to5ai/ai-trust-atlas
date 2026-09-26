import { lazy, Suspense, useState } from 'react'
import { AppShell, isPracticeRoute, universeRoutes } from './app/AppShell'
import { usePathname } from './app/router'
import { QuestionsProvider } from './components/LeadershipQuestions'
import { legacyRedirect } from './lib/legacyUrls'
import { NotFound } from './routes/NotFound'
import { TermsPage } from './routes/TermsPage'
import { UniverseWorkspace } from './routes/universe/UniverseWorkspace'

/* AI Trust Practice loads separately, and its content only ever arrives from the gated API. */
const PracticeApp = lazy(() => import('./practice/PracticeApp'))

function Routes() {
  const pathname = usePathname()
  if (universeRoutes.includes(pathname)) return <UniverseWorkspace />
  if (isPracticeRoute(pathname)) return <Suspense fallback={null}><PracticeApp /></Suspense>
  if (pathname === '/terms') return <TermsPage />
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
