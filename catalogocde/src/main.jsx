// Importa React
import React from 'react'; 
// Importa ReactDOM para renderizar en el cliente
import ReactDOM from 'react-dom/client';
// Importa el componente principal de la aplicación
import App from './App'; 
// Importa BrowserRouter para habilitar el enrutamiento de la aplicación
import { BrowserRouter } from 'react-router-dom';

// Utiliza ReactDOM.createRoot para renderizar la aplicación en el elemento con id "root" del DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  // Renderiza la aplicación dentro de un componente <React.StrictMode>, que activa algunas verificaciones adicionales de React en modo de desarrollo
  <React.StrictMode>
    {/* Utiliza <BrowserRouter> para envolver la aplicación, permitiendo que los componentes de la aplicación accedan a las funcionalidades de enrutamiento */}
    <BrowserRouter>
      {/* Renderiza el componente principal de la aplicación */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
