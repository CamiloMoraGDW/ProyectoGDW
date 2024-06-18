import React from "react";
import './PopUp.css';

const PopUpRestringido = ({ message, onclose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Acceso Denegado</h2>
                <p>{message}</p>
                <button onClick={onclose}>Cerrar</button>
            </div>
        </div>
    );
};

export default PopUpRestringido;