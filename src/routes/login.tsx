import { useContext, useState } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";

import { BeatLoader } from "react-spinners";

import {signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

import '../default.css';
import "../styles/LogIn.css"
import "../lightmode.css";

import {auth} from "../firebase" ; 

export default function LogIn() {
    let [btnText,setBtnText] = useState(<div>Inicia Sesión</div>)
    const isLight = useContext(LightContext);

    console.log(isLight)

    const handleLogIn = (e:any) => {
        e.preventDefault()
        const username:any = document.querySelector("#username");
        const pass:any = document.querySelector("#pass");
        const errorMessage:any = document.querySelector("#errorMessage");
        
        if(!username.value){errorMessage.innerHTML = 'El correo no puede estar vacio'; errorMessage.style.visibility = "visible"  ;return};
        if(!pass.value) {errorMessage.innerHTML = 'La contraseña no puede estar vacia'; errorMessage.style.visibility = "visible"  ;return};
        
        
        errorMessage.style.visibility = "hidden" ;
        setBtnText( <BeatLoader size={10} color={"#ffffff"}/> ) 

        signInWithEmailAndPassword(auth, username.value, pass.value)
        .then(credentials => {
              if(credentials){
                  console.log("Sing In");
              }
        })
        .catch(e => {
            console.log(e.code.includes('email'))
            errorMessage.innerHTML = e.code
            errorMessage.style.visibility = "visible" 
            setBtnText(<div>Inicia Sesión</div>)
        })
    }

    const LogInWithGoogle = () => {
        const Provider = new GoogleAuthProvider
        signInWithPopup(auth, Provider)
        .then(() =>
            console.log("here")
        )
    }

    return <div style={{ 
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexDirection: "column",
            height: "90vh"
        }}>
            <div className={"formDiv " + isLight + "Dark " + isLight + "shadow" }>
                <form onSubmit={e => handleLogIn(e)}>
                    {/* <label htmlFor="username">Usuario:</label> */}
                    <span id="errorMessage">Usuario o contraseña incorrectas</span>
                    <input type="email" name="username" id="username" placeholder="example@example.com"/>
                    {/* <label htmlFor="pass">Contraseña: </label> */}
                    <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
                    <button id="loginSubmit">{btnText}</button>
                </form>
                    <div style={{margin: "auto", textAlign:"center"}}> - o - </div>
                    <Link className={isLight} to="/register">Registrate</Link>
                    <button className={"gSubmit " + isLight} onClick={() => LogInWithGoogle()}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Logo de google" width={20} height={20} />
                    </button>
                    
            </div>
        </div>
    }