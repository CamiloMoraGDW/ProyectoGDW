//Importando React y Estados de React
import React, { useState } from 'react';
//Importando la base de datos de Firebase
import { firestore } from '../../../credenciales';
//Importo las tablas de la base de datos
import { collection, addDoc } from 'firebase/firestore';
//Importo el estilo de este componente.
import './agregarCDE.css';

const AgregarCDE = () => {
    //Creo los estados para cada datos del formulario
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [country, setCountry] = useState('');
    const [creationDate, setCreationDate] = useState('');
    //Este es una Array de tags
    const [tags, setTags] = useState(['']);
    const [link, setLink] = useState('');
    const [ref, setRef] = useState('');
    const [vertical, setVertical] = useState('');
    const [comercial, setComercial] = useState('');
    const [sector, setSector] = useState('');
    const [tipo, setTipo] = useState('');
    //Estado para manejo de errores
    const [error, setError] = useState('');

    //Funcion para agregar un tag
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



    //Funcion para enviar todos los datos del formulario a la base de datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cdeData = {
            name,
            client,
            country,
            creationDate,
            tags: tags.filter(tag => tag.trim() !== ''),
            link,
            ref,
            vertical,
            sector,
            tipo
        };

        try {
            await addDoc(collection(firestore, 'cdes'), cdeData);
            alert('CDE añadido correctamente');
            setName('');
            setClient('');
            setCountry('');
            setCreationDate('');
            setTags(['']);
            setRef(['']);
            setVertical(['']);
            setComercial(['']);
            setSector(['']);
            setTipo(['']);
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
                        <label htmlFor="name">Nombre de CDE</label>
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
                        <label htmlFor="country">Referente de Proyecto</label>
                        <input
                            type="text"
                            id="ref"
                            value={ref}
                            onChange={(e) => setRef(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="vertical">Vertical</label>
                        <input
                            type="text"
                            id="vertical"
                            value={vertical}
                            onChange={(e) => setRef(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="comercial">Comercial</label>
                        <input
                            type="text"
                            id="comercial"
                            value={comercial}
                            onChange={(e) => setRef(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="tipo">Tipo de Proyecto</label>
                        <input
                            type="text"
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setRef(e.target.value)}
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