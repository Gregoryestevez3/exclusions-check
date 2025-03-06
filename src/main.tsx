import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeTheme } from './utils/theme';

// Initialize theme before rendering
initializeTheme();

// Add polyfills for older browsers
if (!window.crypto?.randomUUID) {
  // Simple UUID v4 polyfill
  window.crypto = window.crypto || {};
  window.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Add intersection observer polyfill for lazy loading
if (!('IntersectionObserver' in window)) {
  // This would be where you'd load a polyfill
  console.warn('IntersectionObserver is not supported in this browser. Lazy loading will be disabled.');
}

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
