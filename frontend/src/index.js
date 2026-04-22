import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind styles will be here (we'll generate this later if needed)
import App from './App';

// Application entry point
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
