import React, { useState, useEffect } from 'react';
import { firestore } from '../../../credenciales';
import { collection, getDocs } from 'firebase/firestore';
import "./listadoCDE.css";

const ListadoCDE = () => {
    const [cdes, setCdes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        client: '',
        country: '',
        creationDate: '',
    });

    useEffect(() => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => doc.data());
            setCdes(cdeList);
        };

        fetchCdes();
    }, []);

    const filteredCdes = cdes.filter(cde => {
        return (
            (!filters.name || cde.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (!filters.client || cde.client.toLowerCase().includes(filters.client.toLowerCase())) &&
            (!filters.country || cde.country.toLowerCase().includes(filters.country.toLowerCase())) &&
            (!filters.creationDate || cde.creationDate === filters.creationDate) &&
            (searchTerm === '' || 
                cde.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cde.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    return (
        <div className="listado-container">
            <div className="listado-cde">
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
                <div className="filters">
                    <div className="input-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="client">Cliente</label>
                        <input
                            type="text"
                            id="client"
                            name="client"
                            value={filters.client}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="country">País</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={filters.country}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="creationDate">Fecha de creación</label>
                        <input
                            type="date"
                            id="creationDate"
                            name="creationDate"
                            value={filters.creationDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="cde-list">
                    {filteredCdes.map((cde, index) => (
                        <div key={index} className="cde-item">
                            <h2>{cde.name}</h2>
                            <p><strong>Cliente:</strong> {cde.client}</p>
                            <p><strong>País:</strong> {cde.country}</p>
                            <p><strong>Fecha de creación:</strong> {cde.creationDate}</p>
                            <p><strong>Tags:</strong> {cde.tags.join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListadoCDE;
