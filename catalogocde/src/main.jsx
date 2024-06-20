import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Ajusta la ruta de importación según tu estructura de carpetas

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
