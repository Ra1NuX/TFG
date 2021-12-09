import { useContext } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";

import {signInWithEmailAndPassword} from 'firebase/auth'

import '../default.css';
import "../lightmode.css";
import "../styles/LogIn.css"

import {auth} from "../firebase" ; 

export default function LogIn() {

    const isLight = useContext(LightContext);

    const handleLogIn = (e:any) => {
        e.preventDefault()
        const username:any = document.querySelector("#username");
        const pass:any = document.querySelector("#pass");
        const errorMessage:any = document.querySelector("#errorMessage");

        if(!pass.value) return;
        if(!username.value) return ;

        signInWithEmailAndPassword(auth, username.value, pass.value)
        .then(credentials => {
              if(credentials){
                  console.log("Sing In");
              }

        })
        .catch(e => {
            console.log(e.code.includes('email'))
            e.code.includes('email') || e.code.includes('password') 
                ? errorMessage.style.display = "block" 
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
                    <span id="errorMessage" style={{color:"red"}}>Usuario o contraseña incorrectas</span>
                    <input type="text" name="username" id="username" placeholder="Usuario"/>
                    {/* <label htmlFor="pass">Contraseña: </label> */}
                    <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
                    <input type="submit" value="Iniciar Sesión" />
                </form>
                    <div style={{margin: "auto", textAlign:"center"}}> - o - </div>
                    <Link to="/register">Registrate</Link>
            </div>
        </div>
    }