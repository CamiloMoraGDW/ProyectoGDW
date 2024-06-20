import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseApp from '../../credenciales';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuarioGlobal, setUsuarioGlobal] = useState(null);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
            if (usuarioFirebase) {
                const docRef = doc(firestore, 'users', usuarioFirebase.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUsuarioGlobal({ ...usuarioFirebase, role: docSnap.data().role });
                } else {
                    setUsuarioGlobal(null);
                }
            } else {
                setUsuarioGlobal(null);
            }
        });

        return () => unsubscribe();
    }, [auth, firestore]);

    return (
        <AuthContext.Provider value={{ usuarioGlobal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
