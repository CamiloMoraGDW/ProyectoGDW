import React, { useState, useEffect } from 'react';
import firebaseApp from '../../../credenciales';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, auth, storage } from '../../../credenciales';
import './Cuenta.css';
import '../parts/header.css'

const Cuenta = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [description, setDescription] = useState('');
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profilePicURL, setProfilePicURL] = useState('');

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
            setDescription(data.description || '');
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
            description,
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
                <h1>Cuenta</h1>
                <div className="input-group">
                    <label htmlFor="name">Nombre</label>
                    <p>{name}</p>
                </div>
                <div className="input-group">
                    <label htmlFor="profilePicture">Foto de Perfil</label>
                    <img src={profilePicURL} alt="Perfil" className="profile-picture" />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Descripción</label>
                    <p>{description}</p>
                </div>
                {editing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Nuevo nombre</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="profilePicture">Nueva foto de perfil</label>
                            <input type="file" id="profilePicture" onChange={handleFileChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">Nueva descripción</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={uploading}>
                            {uploading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </form>
                ) : (
                    <button onClick={() => setEditing(true)}>Editar perfil</button>
                )}
                <button className='signOut' onClick={() => signOut(auth)}>Cerrar Sesion</button>
            </div>
        </div>
    );
};

export default Cuenta;


