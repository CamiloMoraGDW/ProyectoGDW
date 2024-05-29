import React, { useState, useEffect } from 'react';
import { firestore } from '../../../credenciales';
import { collection, getDocs } from 'firebase/firestore';
import './ListadoCDE.css';

const ListadoCDE = () => {
    const [cdes, setCdes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        client: '',
        country: '',
        creationDate: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchCdes = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'cdes'));
            const cdeList = querySnapshot.docs.map(doc => doc.data());
            setCdes(cdeList);
        };

        fetchCdes();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = () => {
        const filteredCdes = cdes.filter(cde => {
            return (
                (!filters.name || cde.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                (!filters.client || cde.client.toLowerCase().includes(filters.client.toLowerCase())) &&
                (!filters.country || cde.country.toLowerCase().includes(filters.country.toLowerCase())) &&
                (!filters.creationDate || cde.creationDate === filters.creationDate)
            );
        });

        setSearchResults(filteredCdes);
        setNoResults(filteredCdes.length === 0);
    };

    return (
        <div className="listado-container">
            <h1>Listado de CDEs</h1>
            <div className="filters">
                <div className="input-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="input-group">
                    <label>Cliente:</label>
                    <input
                        type="text"
                        name="client"
                        value={filters.client}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="input-group">
                    <label>País:</label>
                    <input
                        type="text"
                        name="country"
                        value={filters.country}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="input-group">
                    <label>Fecha de creación:</label>
                    <input
                        type="date"
                        name="creationDate"
                        value={filters.creationDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Buscar</button>
                </div>
            </div>
            {noResults && <p>No se encontraron resultados.</p>}
            <div className="cde-list">
                {searchResults.map((cde, index) => (
                    <div key={index} className="cde-item">
                        <h2>{cde.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListadoCDE;
