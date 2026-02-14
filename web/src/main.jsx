import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.jsx';

registerSW({
  immediate: true,
  onRegisterError(error) {
    // eslint-disable-next-line no-console
    console.error('Error al registrar service worker', error);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
