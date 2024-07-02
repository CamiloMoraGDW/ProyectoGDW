import React, { useState, useEffect } from 'react';
import { firestore } from '../../../credenciales';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './listadoCDE.css';
import { useAuth } from '../../context/AuthContext';

const ListadoCDE = () => {
    const { usuarioGlobal } = useAuth();
    const [cdes, setCdes] = useState([]);
    const [originalCdes, setOriginalCdes] = useState([]); // Estado para almacenar la lista original de CDEs
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
        tipo: '',
        pdfText: '' // Agrega pdfText a updatedData para edición
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [cdeToDelete, setCdeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCdes(cdeList);
            setOriginalCdes(cdeList); // Guardar la lista original al inicio
        };

        fetchCdes();
    }, []);

    const handleClean = async () => {
        setSearchTerm('');
        setCdes(originalCdes); // Restaurar la lista original al limpiar
    };

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filteredCdes = originalCdes.filter(cde => {
            const lowercasedName = cde.name?.toLowerCase() || '';
            const lowercasedClient = cde.client?.toLowerCase() || '';
            const lowercasedCountry = cde.country?.toLowerCase() || '';
            const lowercasedRef = cde.ref?.toLowerCase() || '';
            const lowercasedVertical = cde.vertical?.toLowerCase() || '';
            const lowercasedSector = cde.sector?.toLowerCase() || '';
            const lowercasedTipo = cde.tipo?.toLowerCase() || '';
            const lowercasedPdfText = cde.pdfText?.toLowerCase() || ''; // Agrega búsqueda por pdfText

            return (
                lowercasedName.includes(lowercasedSearchTerm) ||
                lowercasedClient.includes(lowercasedSearchTerm) ||
                lowercasedCountry.includes(lowercasedSearchTerm) ||
                lowercasedRef.includes(lowercasedSearchTerm) ||
                lowercasedVertical.includes(lowercasedSearchTerm) ||
                lowercasedSector.includes(lowercasedSearchTerm) ||
                lowercasedTipo.includes(lowercasedSearchTerm) ||
                lowercasedPdfText.includes(lowercasedSearchTerm) // Incluye pdfText en la búsqueda
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
            tipo: cde.tipo,
            pdfText: cde.pdfText || '' // Establecer pdfText para la edición
        });
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            // Filtrar campos undefined en updatedData
            const filteredData = {};
            for (let key in updatedData) {
                if (updatedData[key] !== undefined) {
                    filteredData[key] = updatedData[key];
                }
            }
            await updateDoc(doc(firestore, 'cdes', editCde.id), filteredData);
            setCdes(cdes.map(cde => (cde.id === editCde.id ? { ...cde, ...filteredData } : cde)));
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
        setIsDeleting(true);
        try {
            await deleteDoc(doc(firestore, 'cdes', cdeToDelete));
            setCdes(cdes.filter(cde => cde.id !== cdeToDelete));
            setShowConfirmPopup(false);
            setCdeToDelete(null);
        } catch (error) {
            console.error('Error eliminando el CDE:', error);
            alert('Hubo un error eliminando el CDE.');
        }
        setIsDeleting(false);
    };

    const cancelDelete = () => {
        setShowConfirmPopup(false);
        setCdeToDelete(null);
    };

    return (
        <div className="listado-container">
            <h1>Casos de Éxito - Godoworks</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre, cliente, país, etiqueta o texto del PDF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
                <button onClick={handleClean}>Limpiar</button>
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
                                <div className="left-facts">
                                    <h2>{cde.name}</h2>
                                    <p><strong></strong></p>
                                    <p><strong>Cliente:</strong> {cde.client}</p>
                                    <p><strong>País:</strong> {cde.country}</p>
                                    <p><strong>Fecha de creación:</strong> {cde.creationDate}</p>
                                </div>
                                <div className="right-facts">
                                    <p><strong>Referente de Proyecto:</strong> {cde.ref}</p>
                                    <p><strong>Vertical:</strong> {cde.vertical}</p>
                                </div>
                                <a href={cde.pdfURL} target="_blank" rel="noopener noreferrer">Descargar</a><br />
                                {usuarioGlobal?.role === 'admin' && (
                                    <>
                                        <button onClick={() => handleEdit(cde)}>Editar</button>
                                        <button onClick={() => handleDelete(cde.id)}>Eliminar</button>
                                    </>
                                )}
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
                            <p>Cargando...</p>
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
