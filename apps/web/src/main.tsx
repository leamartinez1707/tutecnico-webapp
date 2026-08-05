import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { SnackbarProvider } from 'notistack'
import { UsersProvider } from './context/UsersContext.tsx'
// Solo cargar peso 400 (normal) para reducir bundle inicial
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import AnimatedRoutes from './routes/AnimatedRoutes.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { setupGlobalErrorHandlers } from './utils/globalErrorHandler.ts'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient.ts'
import { initAnalytics } from './utils/analytics.ts'

// Configurar manejadores globales de errores
setupGlobalErrorHandlers()

// Inicializar Google Analytics
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <UsersProvider>
            <SnackbarProvider>
              <AnimatedRoutes />
            </SnackbarProvider>
          </UsersProvider>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
