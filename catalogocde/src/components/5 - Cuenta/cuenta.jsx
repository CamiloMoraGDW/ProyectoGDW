import React from 'react';
import firebaseApp from "../../../credenciales";
import { getAuth, signOut } from "firebase/auth";

const Cuenta = () => {
    return (
        <div>
            <h1>Cuenta</h1>
            <button onClick={() => signOut(auth)}>Cerrar Sesion</button>
        </div>
    );
};

export default Cuenta;
