//Importando React.
import React from "react";
//Importando el componente header.
import Header from "../parts/header";
//Importando logo de GDW.
import logo from "../../recursos/LogoBlancoSinFondo.png";
//Importando el icono grafico.
import heroIcon from "../../recursos/heroIcon.png";
//Importando dependencias de Autenticacion 
import { getAuth} from "firebase/auth";
//Importando el estilo del componente home
import "./home.css";
//Importando dependencias de Firebase
import firebaseApp from "../../../credenciales";

const auth = getAuth(firebaseApp);

const Home = () => {
    return (
        <>
            <div className="container">
                <div className="left-side">
                    <div className="content">
                        <h1>Catálogo CDE</h1>
                        <p>Es una solución web para aquellos comerciales que quieran acceder de manera rápida y organizada a los Casos de Éxito de cualquiera de los clientes de Godoworks. Esta herramienta ayuda a preparar demos y prospectar basado en ventas e implementaciones anteriores de manera que puedan vender de manera más eficiente. Además, la solución es útil para prospectar ya que conocemos a otros clientes del mismo rubro, país o características del futuro cliente.</p>
                    </div>
                </div>
                <div className="right-side">
                    <img src={heroIcon} alt="Hero Icon" />
                </div>
            </div>
        </>
    )
}

export default Home;
