import React, { useState, useEffect } from 'react';
import { firestore } from '../../../credenciales';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './ListadoCDE.css';
import { ref } from 'firebase/storage';

const ListadoCDE = () => {
    const [cdes, setCdes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editCde, setEditCde] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: '',
        client: '',
        country: '',
        creationDate: '',
        ref: '',
        vertical: '',
        sector: '',
        tipo: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Estado para controlar el popup
    const [cdeToDelete, setCdeToDelete] = useState(null); // Estado para almacenar el CDE a eliminar
    const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar el indicador de carga

    useEffect(() => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCdes(cdeList);
        };

        fetchCdes();
    }, []);

    const handleClean = () => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCdes(cdeList);
        };
        fetchCdes();
    }

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filteredCdes = cdes.filter(cde => {
            const lowercasedName = cde.name.toLowerCase();
            const lowercasedClient = cde.client.toLowerCase();
            const lowercasedCountry = cde.country.toLowerCase();
            const lowercasedTags = cde.tags.map(tag => tag.toLowerCase());
            const lowercasedRef = cde.ref.toLowerCase();
            const lowercasedVertical = cde.vertical.toLowerCase();
            const lowercasedSecor = cde.sector.toLowerCase();
            const lowercasedTipo = cde.tipo.toLowerCase();


            return (
                lowercasedName.includes(lowercasedSearchTerm) ||
                lowercasedClient.includes(lowercasedSearchTerm) ||
                lowercasedCountry.includes(lowercasedSearchTerm) ||
                lowercasedTags.some(tag => tag.includes(lowercasedSearchTerm))
            );
        });

        setCdes(filteredCdes);
    };

    const handleEdit = (cde) => {
        setEditCde(cde);
        setUpdatedData({
            name: cde.name,
            client: cde.client,
            country: cde.country,
            creationDate: cde.creationDate,
            ref: cde.ref,
            vertical: cde.vertical,
            sector: cde.sector,
            tipo: cde.tipo
        });
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            await updateDoc(doc(firestore, 'cdes', editCde.id), updatedData);
            setCdes(cdes.map(cde => (cde.id === editCde.id ? { ...cde, ...updatedData } : cde)));
            setEditCde(null);
            alert('CDE actualizado correctamente');
        } catch (error) {
            console.error('Error actualizando el CDE:', error);
            alert('Hubo un error actualizando el CDE.');
        }
        setIsSaving(false);
    };

    const handleDelete = (id) => {
        setCdeToDelete(id);
        setShowConfirmPopup(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true); // Mostrar el indicador de carga
        try {
            await deleteDoc(doc(firestore, 'cdes', cdeToDelete));
            setCdes(cdes.filter(cde => cde.id !== cdeToDelete));
            setShowConfirmPopup(false);
            setCdeToDelete(null);
        } catch (error) {
            console.error('Error eliminando el CDE:', error);
            alert('Hubo un error eliminando el CDE.');
        }
        setIsDeleting(false); // Ocultar el indicador de carga
    };

    const cancelDelete = () => {
        setShowConfirmPopup(false);
        setCdeToDelete(null);
    };

    return (
        <div className="listado-container">
            <h1>Listado de CDEs</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre, cliente, país o tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
                <button onClick={handleClean}>Limpirar</button>
            </div>
            <div className="cde-list">
                {cdes.map((cde) => (
                    <div key={cde.id} className="cde-item">
                        {editCde && editCde.id === cde.id ? (
                            <div>
                                <p><b>Nombre: </b></p>
                                <input
                                    type="text"
                                    value={updatedData.name}
                                    onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={updatedData.client}
                                    onChange={(e) => setUpdatedData({ ...updatedData, client: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={updatedData.country}
                                    onChange={(e) => setUpdatedData({ ...updatedData, country: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={updatedData.creationDate}
                                    onChange={(e) => setUpdatedData({ ...updatedData, creationDate: e.target.value })}
                                />
                                <button onClick={handleUpdate} disabled={isSaving}>
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button onClick={() => setEditCde(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <h2>{cde.name}</h2>
                                <p><strong>Cliente:</strong> {cde.client}</p>
                                <p><strong>País:</strong> {cde.country}</p>
                                <p><strong>Fecha de creación:</strong> {cde.creationDate}</p>
                                <a href={cde.pdfURL} target="_blank" rel="noopener noreferrer">Descargar</a><br />
                                <button onClick={() => handleEdit(cde)}>Editar</button>
                                <button onClick={() => handleDelete(cde.id)}>Eliminar</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showConfirmPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>¿Está seguro que desea eliminar este CDE?</h3>
                        {isDeleting ? (
                            <p>Cargando...</p> // Mostrar "Cargando..." mientras se elimina
                        ) : (
                            <>
                                <button onClick={confirmDelete}>Sí, eliminar</button>
                                <button onClick={cancelDelete}>Cancelar</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListadoCDE;
