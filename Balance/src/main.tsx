import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LayoutGroup, MotionConfig } from 'framer-motion'
import { RouterProvider } from 'react-router'
import { router } from './router'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="arq-motion-system">
          <RouterProvider router={router} />
        </LayoutGroup>
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
)
