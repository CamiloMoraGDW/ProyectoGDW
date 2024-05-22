import React from "react";
import Header from "../parts/header";
import logo from "../../recursos/LogoBlancoSinFondo.png";
import heroIcon from "../../recursos/heroIcon.png";
import firebaseApp from "../../../credenciales";
import { getAuth, signOut } from "firebase/auth";
import "./home.css";
const auth = getAuth(firebaseApp);

const Home = () => {
    return (
        <>
            <div className="container">
                <div className="left-side">
                    <div className="content">

                        <h1>¿Que es Catalogo CDE?</h1>
                        <p>Es una solucion web para aquellos comerciales que quieran acceder de manera rapida y organizada a los Casos de Exito de cuealquiera de los clientes de <i>Godoworks. Esta herramienta ayuda a preparar demos y prospectar basado en ventas e implementaciones anteriores de manera que puedan vender de manera mas eficientte. Ademas, la solucion es util para prospectar ya que conocemos a otros clientes del mismo rubro, pais o caracteristicas del futuro cliente.</i></p>
                    </div>
                </div>
                <div className="right-side">
                    <img src={heroIcon} alt="" />
                </div>
            </div>
            <div className="cards-container">
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
            </div>
        </>
    )
}


export default Home;