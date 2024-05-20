// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export default firebaseApp;