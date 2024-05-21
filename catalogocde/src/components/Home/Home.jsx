import React from "react";
import firebaseApp from "../../../credenciales";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);

const Home = () => {
    return(
        <>
        <h1>Bienvenido, iniciaste sesion</h1>
        <button onClick={() => signOut(auth)}>Cerrar Sesion</button>
        </>
    )
}


export default Home;