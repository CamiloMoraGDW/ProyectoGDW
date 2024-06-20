import React, { useState, useRef } from 'react';
import { firestore, storage } from '../../../credenciales';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as pdfjs from 'pdfjs-dist';
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

  const fileInputRef = useRef(null);

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);

    if (file) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const arrayBuffer = fileReader.result;
          try {
            pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.mjs'; // Ruta al worker de pdfjs
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            let extractedText = '';

            for (let i = 1; i <= numPages; i++) {
              const page = await pdf.getPage(i);
              const pageText = await page.getTextContent();
              const pageLines = pageText.items.map((item) => item.str).join('\n');
              extractedText += pageLines + '\n';
            }

            // Actualiza el estado con el texto extraído del PDF
            setPdfText(extractedText.trim());
          } catch (error) {
            console.error('Error al parsear el PDF:', error);
            setError('Error al procesar el PDF.');
          }
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error al cargar el archivo PDF:', error);
        setError('Error al cargar el archivo PDF.');
      }
    }
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
        tipo,
      };
      await addDoc(collection(firestore, 'cdes'), cdeData);
      alert('CDE añadido correctamente');

      // Limpiar campos después de guardar
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

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
              <label htmlFor="sector">Sector</label>
              <input
                type="text"
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
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
                ref={fileInputRef}
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
