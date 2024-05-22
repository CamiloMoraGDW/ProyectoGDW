import React from "react";
import { Link } from "react-router-dom";
import logo from "../../recursos/LogoBlancoSinFondo.png"
import "./header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/lista-cdes">Lista de CDE's</Link></li>
                    <li><Link to="/agregar-cde">Agregar CDE</Link></li>
                    <li><Link to="/cuenta">Cuenta</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
