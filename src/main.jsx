import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { startSmooth } from './lib/smooth.js'
import App from './App.jsx'
import './styles/base.css'
import './styles/chrome.css'
import './styles/home.css'
import './styles/project.css'

startSmooth()
if (import.meta.env.DEV) import('gsap').then(m => (window.gsap = m.gsap))

// GitHub Pages serves 404.html for deep links; it is a copy of index.html,
// so the router picks the path straight up from the address bar.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
