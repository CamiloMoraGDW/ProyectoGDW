import React from "react";
import Header from "../parts/header";
import firebaseApp from "../../../credenciales";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);

const Home = () => {
    return(
        <>
        <Header/>
        <h1>Bienvenido, iniciaste sesion</h1>
        <button onClick={() => signOut(auth)}>Cerrar Sesion</button>
        </>
    )
}


export default Home;