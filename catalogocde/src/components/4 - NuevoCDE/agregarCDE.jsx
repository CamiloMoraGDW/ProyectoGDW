import React, { useState } from 'react';
import { firestore, storage } from '../../../credenciales';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './agregarCDE.css';

const AgregarCDE = () => {
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [client, setClient] = useState('');
  const [country, setCountry] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [vertical, setVertical] = useState('');
  const [comercial, setComercial] = useState('');
  const [tipo, setTipo] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!pdfFile) {
      setError('Por favor, sube un archivo PDF.');
      setLoading(false);
      return;
    }

    try {
      const storageReference = storageRef(storage, `pdfs/${pdfFile.name}`);
      await uploadBytes(storageReference, pdfFile);
      const pdfURL = await getDownloadURL(storageReference);

      const cdeData = {
        name,
        sector,
        client,
        country,
        creationDate,
        pdfURL,
        pdfText,
        projectRef,
        vertical,
        tipo
      };
      await addDoc(collection(firestore, 'cdes'), cdeData);
      alert('CDE añadido correctamente');

      setName('');
      setSector('');
      setClient('');
      setCountry('');
      setCreationDate('');
      setPdfFile(null);
      setPdfText('');
      setProjectRef('');
      setVertical('');
      setComercial('');

      setTipo('');
    } catch (error) {
      console.error('Error subiendo el PDF a Firebase Storage:', error);
      setError('Hubo un error subiendo el PDF a Firebase Storage.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="agregar-container">
      {loading && <div className="loading">Guardando datos...</div>}
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
              <label htmlFor="name">Sector</label>
              <input
                type="text"

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
              // required
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