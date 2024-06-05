// Importa React y sus hooks useState y useEffect
import React, { useState, useEffect } from 'react';
// Importa componentes y hooks necesarios de react-router-dom
import { Routes, Route, Navigate } from "react-router-dom";
// Importa el componente Logeo
import Logeo from './components/2 - Logeo/logeo';
// Importa el componente Header
import Header from './components/parts/header';
// Importa el componente Home
import Home from './components/1 - vistaHome/Home'; 
// Importa el componente ListaCDEs
import ListaCDEs from './components/3 - ListadoCDE/ListadoCDE'; 
// Importa el componente NuevoCDE
import NuevoCDE from './components/4 - NuevoCDE/agregarCDE'; 
// Importa el componente Cuenta
import Cuenta from './components/5 - Cuenta/cuenta'; 
// Importa la instancia de firebase
import firebaseApp from '../credenciales'; 
// Importa métodos de autenticación de firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Obtiene la instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

function App() {
  // Define un estado para almacenar el usuario global
  const [usuarioGlobal, setUsuarioGlobal] = useState(null);

  useEffect(() => {
    // Define un efecto que se ejecuta después de que el componente es montado
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      // Utiliza el método onAuthStateChanged para escuchar los cambios en la autenticación
      if (usuarioFirebase) {
        // Si hay un usuario autenticado, actualiza el estado con el usuario
        setUsuarioGlobal(usuarioFirebase);
      } else {
        // Si no hay un usuario autenticado, actualiza el estado a null
        setUsuarioGlobal(null);
      }
    });

    // Limpia la suscripción al efecto cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // El efecto se ejecuta solo una vez después del montaje del componente

  return (
    <>
      {/* Renderiza condicionalmente según si hay un usuario autenticado */}
      {usuarioGlobal ? (
        <>
          {/* Si hay un usuario autenticado, renderiza el Header y las rutas protegidas */}
          <Header />
          <Routes>
            <Route path="/" element={<Home />} /> {/* Ruta principal */}
            <Route path="/lista-cdes" element={<ListaCDEs />} /> {/* Ruta para listar CDEs */}
            <Route path="/agregar-cde" element={<NuevoCDE />} /> {/* Ruta para agregar un nuevo CDE */}
            <Route path="/cuenta" element={<Cuenta />} /> {/* Ruta para la cuenta del usuario */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Ruta por defecto, redirige a la página principal */}
          </Routes>
        </>
      ) : (
        <>
          {/* Si no hay un usuario autenticado, renderiza el componente de inicio de sesión */}
          <Routes>
            <Route path="*" element={<Logeo />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App; // Exporta el componente App
