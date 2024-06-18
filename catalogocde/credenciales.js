
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDtk5LORgkeVruccoCjQ2uZCdi1XZZtFug",
    authDomain: "proyectocde-eb644.firebaseapp.com",
    databaseURL: "https://proyectocde-eb644-default-rtdb.firebaseio.com",
    projectId: "proyectocde-eb644",
    storageBucket: "proyectocde-eb644.appspot.com",
    messagingSenderId: "562788871760",
    appId: "1:562788871760:web:72ba4a6b970a4c8007eb55",
    measurementId: "G-ETPG95VNB1"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export default firebaseApp;
export { db, storage, firestore, auth };

