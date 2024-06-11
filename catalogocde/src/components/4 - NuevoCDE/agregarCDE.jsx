import React, { useState } from 'react';
import { firestore, storage } from '../../../credenciales'; // Importar Firebase Firestore
import { collection, addDoc } from 'firebase/firestore'; // Importar Firestore
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import PDFToText from 'react-pdftotext';
import './agregarCDE.css';

const AgregarCDE = () => {
    // Creo los estados para cada dato del formulario
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [country, setCountry] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [projectRef, setProjectRef] = useState('');
    const [vertical, setVertical] = useState('');
    const [comercial, setComercial] = useState('');
    const [sector, setSector] = useState('');
    const [tipo, setTipo] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfText, setPdfText] = useState('');
    const [error, setError] = useState('');

    // Función para manejar el cambio de archivo PDF
    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        setPdfFile(file);

        // Extraer texto del PDF utilizando PDFToText (react-pdftotext)
        PDFToText(file, async (err, text) => {
            if (err) {
                console.error('Error extrayendo texto del PDF:', err);
                setError('Hubo un error extrayendo texto del PDF.');
                return;
            }
            setPdfText(text);
        });

    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!pdfFile) {
            setError('Por favor, sube un archivo PDF.');
            return;
        }

        try {
            // Subir el PDF a Firebase Storage
            const storageReference = storageRef(storage, `pdfs/${pdfFile.name}`);
            await uploadBytes(storageReference, pdfFile);
            alert('PDF subido correctamente');
            setPdfFile(null);

            // Agregar los datos del CDE a Firestore
            const cdeData = {
                name,
                client,
                country,
                creationDate,
                pdfURL: storageReference.fullPath,
                pdfText,
                projectRef,
                vertical,
                sector,
                tipo
            };
            const docRef = await addDoc(collection(firestore, 'cdes'), cdeData);
            alert('CDE añadido correctamente');

            // Limpiar estados después de enviar el formulario
            setName('');
            setClient('');
            setCountry('');
            setCreationDate('');
            setPdfFile(null);
            setPdfText('');
            setProjectRef('');
            setVertical('');
            setComercial('');
            setSector('');
            setTipo('');
        } catch (error) {
            console.error('Error subiendo el PDF a Firebase Storage:', error);
            setError('Hubo un error subiendo el PDF a Firebase Storage.');
        }
    };

    return (
        <div className="agregar-container">
            <div className="agregar-cde">
                <h1>Agregar CDE</h1>
                <form onSubmit={handleSubmit}>
                    <div>
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
                            <label htmlFor="projectRef">Referente de Proyecto</label>
                            <input
                                type="text"
                                id="projectRef"
                                value={projectRef}
                                onChange={(e) => setProjectRef(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="vertical">Vertical</label>
                            <input
                                type="text"
                                id="vertical"
                                value={vertical}
                                onChange={(e) => setVertical(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="input-group">
                            <label htmlFor="comercial">Comercial</label>
                            <input
                                type="text"
                                id="comercial"
                                value={comercial}
                                onChange={(e) => setComercial(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="tipo">Tipo de Proyecto</label>
                            <input
                                type="text"
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="pdf">Subir PDF</label>
                            <input
                                type="file"
                                id="pdf"
                                accept="application/pdf"
                                onChange={handlePdfChange}
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
