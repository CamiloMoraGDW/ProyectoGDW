// src/components/PrivateRoutes.js
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, usuarioGlobal, allowedRoles }) => {
    const [alertShown, setAlertShown] = useState(false);
    const location = useLocation();

    if (!usuarioGlobal) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (!allowedRoles.includes(usuarioGlobal.role)) {
        if (!alertShown) {
            alert("No tienes acceso a este módulo. Contacta a los administradores de la aplicación.");
            setAlertShown(true);
        }
        return <Navigate to="/" state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;
