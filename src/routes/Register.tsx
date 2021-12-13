import { useContext } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";

import {createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from 'firebase/auth'

import '../default.css';
import "../lightmode.css";
import "../styles/LogIn.css"

import {auth} from "../firebase" ; 

export default function Register() {

    const isLight = useContext(LightContext);

    const handleRegister = (e:any) => {

        e.preventDefault();
        
        const username:any = document.querySelector("#username");
        const email:any = document.querySelector("#email");
        const pass:any = document.querySelector("#pass");
        const pass2:any = document.querySelector("#pass2");
        const errorMessage:any = document.querySelector("#errorMessage");

        if(!username.value || !email.value) return ;
        if(!pass.value || !pass2.value || pass.value != pass2.value) return ;

        createUserWithEmailAndPassword(auth, email.value, pass.value)
        .then(credential => {
            sendEmailVerification(credential.user,).then(e => {
            updateProfile(credential.user, {displayName: username.value})
            })
        })

        // signInWithEmailAndPassword(auth, username.value, pass.value)
        // .then(credentials => {
        //       if(credentials){
        //           console.log("Sing In");
        //       }

        // })
        // .catch(e => {
        //     console.log(e.code.includes('email'))
        //     e.code.includes('email') || e.code.includes('password') 
        //         ? errorMessage.display = "block" 
        //         : console.log(e.code); 
        // })
    }

    return <div style={{ 
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexDirection: "column",
            height: "90vh"
        }}>
            <div className={"formDiv " + isLight + "Dark " + isLight + "shadow" }>
                <form onSubmit={e => handleRegister(e)}>
                    
                    {/* <label htmlFor="username">Usuario:</label> */}
                    <span id="errorMessage" style={{color:"red"}}>Usuario o contraseña incorrectas</span>
                    <input type="text" name="username" id="username" placeholder="Usuario"/>
                    <input type="email" name="email" id="email" placeholder="Correo Electronico"/>

                    {/* <label htmlFor="pass">Contraseña: </label> */}
                    <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
                    <input type="password" name="pass2" id="pass2" placeholder="Repite la contraseña"/>
                    <button className="formSubmit" type="submit" >Regitrar</button>
                </form>
            </div>
        </div>
    }