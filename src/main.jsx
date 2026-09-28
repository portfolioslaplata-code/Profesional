import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/theme.css'
import App from './App.jsx'
import { initAnalytics } from './utils/analytics.js'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (root.querySelector('.portfolio')) hydrateRoot(root, app)
else createRoot(root).render(app)
initAnalytics(import.meta.env)
