// Must be first: declares the cascade layer order before any component stylesheet.
import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/legacy/styles.css'
import './styles/legacy/universe-polish.css'
import './styles/legacy/arctic.css'
import './styles/legacy/outline.css'
import './styles/legacy/news.css'
import './styles/legacy/questions.css'
import './styles/legacy/theme.css'
import './styles/legacy/methodology.css'
import './styles/legacy/usability.css'
import './styles/legacy/questions-workspace.css'
import './styles/legacy/incidents.css'
import './styles/legacy/use-cases.css'
import './styles/bridge.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
