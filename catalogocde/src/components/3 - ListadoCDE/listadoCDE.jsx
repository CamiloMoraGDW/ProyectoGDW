import React, { useState, useEffect } from 'react';
import { firestore } from '../../../credenciales';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './ListadoCDE.css';

const ListadoCDE = () => {
    const [cdes, setCdes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editCde, setEditCde] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: '',
        client: '',
        country: '',
        creationDate: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCdes(cdeList);
        };

        fetchCdes();
    }, []);

    const handleSearch = () => {
        if (!searchTerm) return;

        const filteredCdes = cdes.filter(cde => {
            return (
                cde.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'cdes', id));
            setCdes(cdes.filter(cde => cde.id !== id));
            alert('CDE eliminado correctamente');
        } catch (error) {
            console.error('Error eliminando el CDE:', error);
            alert('Hubo un error eliminando el CDE.');
        }
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
            </div>
            <div className="cde-list">
                {cdes.map((cde) => (
                    <div key={cde.id} className="cde-item">
                        {editCde && editCde.id === cde.id ? (
                            <div>
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
                                <button onClick={() => handleEdit(cde)}>Editar</button>
                                <button onClick={() => handleDelete(cde.id)}>Eliminar</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListadoCDE;
