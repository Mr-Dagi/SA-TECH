import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import emailjs from 'emailjs-com';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
