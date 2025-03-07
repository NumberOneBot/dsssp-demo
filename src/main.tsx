import '@fontsource/poppins/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from './App.tsx'
import Demo2 from './pages/Demo2.tsx'
import Demo3 from './pages/Demo3.tsx'
import Demo4 from './pages/Demo4.tsx'
import Demo5 from './pages/Demo5.tsx'

import './main.css'

function fallbackRender({ error }: { error: Error }) {
  return <pre style={{ padding: '8px', color: 'red' }}>{error.message}</pre>
}

export const router = createHashRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/demo2',
    element: <Demo2 />
  },
  {
    path: '/demo3',
    element: <Demo3 />
  },
  {
    path: '/demo4',
    element: <Demo4 />
  },
  {
    path: '/demo5',
    element: <Demo5 />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
)
