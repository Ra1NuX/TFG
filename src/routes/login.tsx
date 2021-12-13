import { useContext, useState } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";

import { BeatLoader } from "react-spinners";

import {signInWithEmailAndPassword} from 'firebase/auth'

import '../default.css';
import "../lightmode.css";
import "../styles/LogIn.css"

import {auth} from "../firebase" ; 

export default function LogIn() {
    let [btnText,setBtnText] = useState(<div>Inicia Sesión</div>)
    const isLight = useContext(LightContext);

    const handleLogIn = (e:any) => {
        e.preventDefault()
        const username:any = document.querySelector("#username");
        const pass:any = document.querySelector("#pass");
        const errorMessage:any = document.querySelector("#errorMessage");

        if(!pass.value) {errorMessage.innerHTML = 'El correo no puede estar vacio'; errorMessage.style.visibility = "visible"  ;return};
        if(!username.value) return ;
        
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
            e.code.includes('user') || e.code.includes('password') 
                ? errorMessage.style.visibility = "visible" 
                : console.log(e.code); 
        })
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
                    <input type="text" name="username" id="username" placeholder="Usuario"/>
                    {/* <label htmlFor="pass">Contraseña: </label> */}
                    <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
                    <button id="loginSubmit">{btnText}</button>
                </form>
                    <div style={{margin: "auto", textAlign:"center"}}> - o - </div>
                    <Link to="/register">Registrate</Link>
            </div>
        </div>
    }