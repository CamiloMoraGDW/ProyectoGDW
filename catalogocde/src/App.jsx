import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom"
import Logeo from './components/2 - Logeo/logeo';
import Header from './components/parts/header';
import Home from './components/1 - vistaHome/Home';
import ListaCDEs from './components/3 - ListadoCDE/ListadoCDE';
import NuevoCDE from './components/4 - NuevoCDE/agregarCDE';
import Cuenta from './components/5 - Cuenta/cuenta';
import firebaseApp from '../credenciales';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(firebaseApp);

function App() {
  const [usuarioGlobal, setUsuarioGlobal] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuarioGlobal(usuarioFirebase);
      } else {
        setUsuarioGlobal(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      {usuarioGlobal ? (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lista-cdes" element={<ListaCDEs />} />
            <Route path="/agregar-cde" element={<NuevoCDE />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Logeo />} />
        </Routes>
      )}
    </>
  );
}

export default App;
