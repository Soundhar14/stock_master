import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position={'top-right'}
          autoClose={1500}
          theme="light"
          pauseOnHover={true}
          closeButton={false}
          draggable
          limit={3}
          className="z-[9999999999]"
        />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
