import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './global-bg-fix.css';
import AppWithBackground from './AppWithBackground';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithBackground />
  </React.StrictMode>
);

reportWebVitals();
