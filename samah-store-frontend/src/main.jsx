import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Ensure RTL by default
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

