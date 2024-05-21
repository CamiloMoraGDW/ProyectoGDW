import React, { useState } from "react";
import logo from "../recursos/LogoBlancoSinFondo.png";
import "./logeo.css";
import firebaseApp from "../../../credenciales";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect,
    GoogleAuthProvider
} from "firebase/auth";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Logeo = () => {
    const [estaRegistrandose, setEstaRegistrandose] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    async function submitHandler(e) {
        e.preventDefault();
        setError(""); // Resetea el mensaje de error al intentar de nuevo

        try {
            if (estaRegistrandose) {
                const usuario = await createUserWithEmailAndPassword(auth, email, password);
                console.log(usuario);
            } else {
                const usuario = await signInWithEmailAndPassword(auth, email, password);
                console.log(usuario);
            }
        } catch (error) {
            // Manejo de errores y mostrar mensajes de alerta
            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("El correo electrónico ya está en uso.");
                    break;
                case "auth/invalid-email":
                    setError("El correo electrónico no es válido.");
                    break;
                case "auth/weak-password":
                    setError("La contraseña es demasiado débil.");
                    break;
                case "auth/user-not-found":
                    setError("No se encontró ninguna cuenta con este correo electrónico.");
                    break;
                case "auth/wrong-password":
                    setError("La contraseña es incorrecta.");
                    break;
                default:
                    setError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
                    break;
            }
        }
    }

    return (
        <>
            <div className="container">
                <div className="left-side">
                    <div className="content">
                        <div className="logoGDW">
                            <img src={logo} alt="" />
                        </div>
                        <div className="texto">
                            <p>Bienvenido/a al catálogo de Casos de Éxito Godoworks! Este sitio tiene como objetivo asistir a los comerciales a buscar y explorar los Casos de Éxito elaborados por la empresa. Esta solución ayuda a los comerciales a mejorar sus demos y prospección. Por favor {estaRegistrandose ? "crea una cuenta" : "ingresa tu cuenta"} y disfruta del catálogo CDE.</p>
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    <div className="form-box">
                        <form onSubmit={submitHandler}>
                            <h1>{estaRegistrandose ? "Registrate" : "Iniciar Sesion"}</h1>
                            <div className="input-box">
                                <input type="email" placeholder="Correo electronico" id="email" name="email" value={email} onChange={handleChange} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="input-box">
                                <input type="password" placeholder="Contraseña" id="password" name="password" value={password} onChange={handleChange} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                </svg>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="register-button">
                                <button type="submit">{estaRegistrandose ? "Registrarme" : "Iniciar Sesion"}</button>
                            </div>
                        </form>
                            <button onClick={() => setEstaRegistrandose(!estaRegistrandose)} className="switch-form">{estaRegistrandose ? "Ya tengo una cuenta" : "No tengo una cuenta, registrarme."}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Logeo;
