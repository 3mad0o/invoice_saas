import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/app/App'
import { initializeSampleData } from '@/lib/sampleData'

// Initialize sample data if none exists
initializeSampleData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)