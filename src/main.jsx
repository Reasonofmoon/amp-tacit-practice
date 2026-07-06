import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

let lastPreloadRetryAt = 0;

function getLastPreloadRetry(storageKey) {
  try {
    return Number(window.sessionStorage.getItem(storageKey) || lastPreloadRetryAt);
  } catch {
    return lastPreloadRetryAt;
  }
}

function setLastPreloadRetry(storageKey, value) {
  lastPreloadRetryAt = value;

  try {
    window.sessionStorage.setItem(storageKey, String(value));
  } catch {
    // The in-memory timestamp still avoids a tight reload loop.
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    const retryKey = 'vite-preload-retried';
    const lastRetryAt = getLastPreloadRetry(retryKey);
    const retryCooldownMs = 10000;

    if (Date.now() - lastRetryAt > retryCooldownMs) {
      event.preventDefault();
      setLastPreloadRetry(retryKey, Date.now());
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
