import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // ADDED THIS LINE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider> {/* ADDED THIS OPENING TAG */}
        <App />
      </ThemeProvider> {/* ADDED THIS CLOSING TAG */}
    </AuthProvider>
  </StrictMode>,
)
