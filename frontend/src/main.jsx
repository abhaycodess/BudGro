import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import AppWithRouter from './App.jsx'
import './form-global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithRouter />
  </StrictMode>,
)
