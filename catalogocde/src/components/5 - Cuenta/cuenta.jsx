import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, auth, storage } from '../../../credenciales';
import './Cuenta.css';
import '../parts/header/header.css';

const Cuenta = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profilePicURL, setProfilePicURL] = useState('');
    const [role, setRole] = useState('');
    const [cargo, setCargo] = useState('');
    const [cargoOptions] = useState(['Admin', 'Comercial', 'Partner']); // Opciones disponibles para cargo

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await loadUserData(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const loadUserData = async (uid) => {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || '');
            setRole(data.role || '');
            setCargo(data.cargo || ''); // Cargar el campo de cargo si existe
            if (data.profilePicture) {
                setProfilePicURL(data.profilePicture);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setUploading(true);

        const userData = {
            name,
            role,
            cargo, // Guardar el cargo seleccionado
        };

        if (profilePicture) {
            const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(profilePicRef, profilePicture);
            const newProfilePicURL = await getDownloadURL(profilePicRef);
            userData.profilePicture = newProfilePicURL;
            setProfilePicURL(newProfilePicURL);
        }

        await setDoc(doc(firestore, 'users', user.uid), userData, { merge: true });

        setUploading(false);
        setEditing(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    return (
        <div className="cuenta-container">
            <div className="cuenta">
                <h2 style={{ textAlign: 'center' }}>Cuenta</h2>
                <div className="input-group">
                    <label htmlFor="name">Nombre</label>
                    <p>{name}</p>
                </div>
                <div className="input-group">
                    <label htmlFor="profilePicture">Foto de Perfil</label>
                    <img src={profilePicURL} alt="Perfil" className="profile-picture" />
                </div>
                <div className="input-group">
                    <label htmlFor="cargo">Cargo</label>
                    <p>{cargo}</p>
                </div>
                <div className="input-group">
                    <label htmlFor="rol">Rol</label>
                    <p>{role}</p>
                </div>
                {editing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="profilePicture">Foto de perfil</label>
                            <input type="file" id="profilePicture" onChange={handleFileChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="cargo">Cargo</label>
                            <select
                                id="cargo"
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}
                            >
                                {cargoOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="buttons">
                            <button type="submit" disabled={uploading}>
                                {uploading ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className='cancel' onClick={() => setEditing(false)}>Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <div className="buttons">
                        <button onClick={() => setEditing(true)}>Editar perfil</button>
                        <button className='signOut' onClick={() => signOut(auth)}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cuenta;
