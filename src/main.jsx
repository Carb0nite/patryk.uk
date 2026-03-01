import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SankeyApp from './components/SankeyApp.jsx'

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/fire' ? <SankeyApp /> : <App />}
  </StrictMode>,
)
