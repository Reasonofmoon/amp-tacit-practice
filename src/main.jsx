import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    const retryKey = 'vite-preload-retried';
    const lastRetryAt = Number(window.sessionStorage.getItem(retryKey) || '0');
    const retryCooldownMs = 10000;

    if (Date.now() - lastRetryAt > retryCooldownMs) {
      event.preventDefault();
      window.sessionStorage.setItem(retryKey, String(Date.now()));
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
