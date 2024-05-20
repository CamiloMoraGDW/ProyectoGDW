import React, { useState } from 'react'
import Logeo from './components/logeo'
import Home from './components/Home'
import firebaseApp from '../credenciales';
import {getAuth, onAuthStateChanged} from "firebase/auth"
const auth = getAuth(firebaseApp);


function App() {
  const [usuarioGlobal, setUsuarioGlobal] = React.useState(null);

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if(usuarioFirebase){
      //Codigo en caso de que ya este iniciada la secion:
      setUsuarioGlobal(usuarioFirebase);

    }else{
      //Codigo en caso de que no haya sesion iniciada.
      setUsuarioGlobal(null);
    }
  })
  return (
    <>
    {usuarioGlobal ? <Home/> : <Logeo/>}
    </>
  )
}

export default App;
