import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Make sure this path is correct

// REMOVE these imports from main.jsx, as AuthProvider and ThemeProvider
// are already correctly nested within <Router> inside App.jsx
// import { AuthProvider } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* ONLY the App component should be rendered here */}
  </StrictMode>,
);