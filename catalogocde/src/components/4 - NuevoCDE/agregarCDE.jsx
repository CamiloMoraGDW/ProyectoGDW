import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../../../credenciales';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './agregarCDE.css';
import pdfToText from 'react-pdftotext';

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
  const [pdfText, setPdfText] = useState(''); // Estado para almacenar el texto del PDF
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      case 'sector':
        setSector(value);
        break;
      case 'client':
        setClient(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'projectRef':
        setProjectRef(value);
        break;
      case 'vertical':
        setVertical(value);
        break;
      case 'comercial':
        setComercial(value);
        break;
      case 'tipo':
        setTipo(value);
        break;
      case 'creationDate':
        setCreationDate(value);
        break;
      default:
        break;
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);

    pdfToText(file)
      .then(text => {
        console.log('Texto extraído del PDF:', text);
        setPdfText(text); // Guardar el texto del PDF en el estado
      })
      .catch(error => {
        console.log('Error al extraer el texto del pdf:', error);
        setError('Error al extraer el texto del PDF');
      });
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

    if (!user) {
      setError('Debes iniciar sesión para subir un archivo.');
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
        pdfText, // Incluir el texto extraído del PDF
        projectRef,
        vertical,
        tipo
      };

      // Guardar datos en Firestore
      const docRef = await addDoc(collection(firestore, 'cdes'), cdeData);
      alert('CDE añadido correctamente');

      // Limpiar formulario después de éxito
      setName('');
      setSector('');
      setClient('');
      setCountry('');
      setCreationDate('');
      setPdfFile(null);
      setProjectRef('');
      setVertical('');
      setComercial('');
      setTipo('');

      console.log('Documento CDE añadido con ID:', docRef.id);
    } catch (error) {
      console.error('Error subiendo el PDF a Firebase Storage o extrayendo texto:', error);
      setError('Hubo un error subiendo el PDF a Firebase Storage o extrayendo texto.');
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
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="sector">Sector</label>
              <input
                type="text"
                id="sector"
                value={sector}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="client">Cliente</label>
              <input
                type="text"
                id="client"
                value={client}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="country">País</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="projectRef">Referente de Proyecto</label>
              <input
                type="text"
                id="projectRef"
                value={projectRef}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="vertical">Vertical</label>
              <input
                type="text"
                id="vertical"
                value={vertical}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="tipo">Tipo de Proyecto</label>
              <input
                type="text"
                id="tipo"
                value={tipo}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit">Agregar CDE</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AgregarCDE;
