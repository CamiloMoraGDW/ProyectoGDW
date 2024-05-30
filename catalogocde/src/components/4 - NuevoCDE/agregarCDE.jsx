import React, { useState } from 'react';
import { firestore } from '../../../credenciales';
import { collection, addDoc } from 'firebase/firestore';
import './agregarCDE.css';

const AgregarCDE = () => {
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [country, setCountry] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [tags, setTags] = useState(['']);
    const [link, setLink] = useState(''); 
    const [error, setError] = useState('');

    const handleAddTag = () => {
        if (tags.length < 15) {
            setTags([...tags, '']);
        } else {
            setError('Se puede agregar un máximo de 15 tags.');
        }
    };

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cdeData = {
            name,
            client,
            country,
            creationDate,
            tags: tags.filter(tag => tag.trim() !== ''),
            link
        };

        try {
            await addDoc(collection(firestore, 'cdes'), cdeData);
            alert('CDE añadido correctamente');
            setName('');
            setClient('');
            setCountry('');
            setCreationDate('');
            setTags(['']);
        } catch (error) {
            console.error('Error añadiendo CDE: ', error);
            setError('Hubo un error añadiendo el CDE.');
        }
    };

    return (
        <div className="agregar-container">
            <div className="agregar-cde">
                <h1>Agregar CDE</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="client">Cliente</label>
                        <input
                            type="text"
                            id="client"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="country">País</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="link">Enlace del PDF</label>
                        <input
                            type="text"
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="creationDate">Fecha de creación</label>
                        <input
                            type="date"
                            id="creationDate"
                            value={creationDate}
                            onChange={(e) => setCreationDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Tags</label>
                        {tags.map((tag, index) => (
                            <div key={index} className="tag-group">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                />
                                <button type="button" className="remove-tag" onClick={() => handleRemoveTag(index)}>Eliminar</button>
                            </div>
                        ))}
                        {tags.length < 15 && (
                            <button type="button" className="add-tag" onClick={handleAddTag}>Agregar Tag</button>
                        )}
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="buttons">
                        <button type="submit">Guardar CDE</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarCDE;
