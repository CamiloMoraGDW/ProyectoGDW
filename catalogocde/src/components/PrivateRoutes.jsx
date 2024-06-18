import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, usuarioGlobal, allowedRoles }) => {
    const location = useLocation();

    if (!usuarioGlobal) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (!allowedRoles.includes(usuarioGlobal.role)) {
        alert("No tienes acceso a este módulo. Contacta a los administradores de la aplicación.");
        return <Navigate to="/" state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;
