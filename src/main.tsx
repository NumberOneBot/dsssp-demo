import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

import { ErrorBoundary } from 'react-error-boundary'

function fallbackRender({ error }: { error: Error }) {
  return <pre style={{ padding: '10px', color: 'red' }}>{error.message}</pre>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
