import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Logeo from './components/2 - Logeo/logeo';
import Header from './components/parts/header/header';
import Home from './components/1 - vistaHome/Home';
import AgregarCDE from './components/4 - NuevoCDE/AgregarCDE';
import Cuenta from './components/5 - Cuenta/cuenta';
import ListadoCDE from './components/3 - ListadoCDE/listadoCDE';
import PrivateRoute from './components/PrivateRoutes';
import LoadingSpinner from './components/parts/loading-spinner/LoadingSpinner'; // Importa el componente de animación
import firebaseApp from '../credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';



const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [usuarioGlobal, setUsuarioGlobal] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuarioGlobal(usuarioFirebase);
        const docRef = doc(firestore, 'users', usuarioFirebase.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole(null);
        }
      } else {
        setUsuarioGlobal(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Muestra una animación de carga mientras se cargan los datos
  }

  return (
    <>
      {usuarioGlobal ? (
        <>
          <div className="app-container">
            <Header />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lista-cdes" element={<ListadoCDE />} />
                <Route
                  path="/agregar-cde"
                  element={
                    <PrivateRoute usuarioGlobal={{ ...usuarioGlobal, role }} allowedRoles={['admin']}>
                      <AgregarCDE />
                    </PrivateRoute>
                  }
                />
                <Route path="/cuenta" element={<Cuenta />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
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
