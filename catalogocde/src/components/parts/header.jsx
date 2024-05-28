import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../../../credenciales";
import logo from "../../recursos/LogoBlancoSinFondo.png";
import "./header.css";

const Header = () => {
    const [profilePicURL, setProfilePicURL] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setProfilePicURL(data.profilePicture || '');
                }
            }
        });
        return () => unsubscribe();
    }, []);

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
                    <li>
                        <Link to="/cuenta">
                            {profilePicURL ? (
                                <img src={profilePicURL} alt="Perfil" className="profile-picture" />
                            ) : (
                                'Cuenta'
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
