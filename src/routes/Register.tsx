import { useContext } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";

import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'

// import '../default.css';
// import "../lightmode.css";
// import "../styles/LogIn.css"

import { auth } from "../firebase";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup'

export default function Register() {

    const isLight = useContext(LightContext);

    const SignUpSchema = yup.object().shape({
        username: yup.string().min(3, 'El username debe contener al menos 3 caracteres').max(16, 'El username no puede tener más de 16 caracteres.').trim('El username no puede estar vacio').strict().required('El username no puede estar en blanco'),
        email: yup.string().email("El email debe ser un Email válido").required("El correo no puede estar en blanco"),
        password: yup.string()
            .required("La contraseña no puede estar en blanco")
            .min(6, "La contraseña es muy corta, al menos debe tener 6 cm"),
        passwordConfirmation: yup.string()
     .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden').required("La contraseña no puede estar en blanco")
    });

    interface RegisterProps{
        email: string, 
        password: string,
        username: string,
    }

    const handleRegister = ({email, password, username}:RegisterProps) => {

        createUserWithEmailAndPassword(auth, email, password)
            .then(credential => {
                sendEmailVerification(credential.user,).then(function(){
                    updateProfile(credential.user, { displayName: username })
                })
            })
            .catch(e => alert(e))
    }
    const initialValues = { username: "", email: "", password: "", passwordConfirmation:""}

    return <Formik initialValues={initialValues} validationSchema={SignUpSchema} onSubmit={values => handleRegister(values)}>
        {formik => {
            const { errors, touched, isValid, dirty } = formik;
            return <div className="flex flex-col w-full max-h-screen align-middle justify-center">
                <h1 className="text-3xl text-center pt-5">Registrate</h1>
                <Form className="p-5 w-1/2 m-auto mt-3 rounded-md shadow-sm shadow-gray-500">

                <div className="flex flex-col">
                        <label htmlFor="email">Username</label>
                        <Field
                            type="text"
                            name="username"
                            id="username"
                            className={`border-b-4 p-2 rounded-sm py-2 ${errors.username ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-500"}`}
                        />
                        <ErrorMessage name="username" component="span" className="text-red-600" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`border-b-4 p-2 rounded-sm py-2 ${errors.email ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-500"}`}
                        />
                        <ErrorMessage name="email" component="span" className="text-red-600" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <Field
                            type="password"
                            name="password"
                            id="password"
                            className={`border-b-4 p-2 rounded-sm ${errors.password ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-500"}`}
                        />
                        <ErrorMessage
                            name="password"
                            component="span"
                            className="text-red-600"
                        />
                    </div>
                    <div className="flex flex-col mb-5">
                        <label htmlFor="password">password Confirmation</label>
                        <Field
                            type="password"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            className={`border-b-4 p-2 rounded-sm ${errors.passwordConfirmation ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-500"}`}
                        />
                        <ErrorMessage
                            name="passwordConfirmation"
                            component="span"
                            className="text-red-600"
                        />
                    </div>
                    <div className="flex flex-col">
                        <button
                            type="submit"
                            className={`bg-blue-500 rounded-sm h-10 p-2 px-10 text-white font-semibold  ${!(dirty && isValid) ? "bg-gray-400" : "hover:bg-blue-600 hover:cursor-pointer"}`}
                            disabled={!(dirty && isValid)}
                        >
                            Registrarse
                        </button>
                        <span className="m-auto my-4 select-none">O</span>
                        <span><Link to={'/login'} className="underline hover:text-blue-600">Inicia Sesión</Link></span>
                    </div>
                </Form>
                <button className="w-1/3 m-auto flex justify-center p-3 my-5 shadow-md border-2 border-red-600 rounded-md bg-red-600 hover:bg-gray-100" onClick={() => null}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Logo de google" width={20} height={20} />
                </button>
            </div>


        }}
    </Formik>
    // return <div style={{ 
    //         display:"flex",
    //         alignItems:"center",
    //         justifyContent:"center",
    //         flexDirection: "column",
    //         height: "90vh"
    //     }}>
    //         <div className={"formDiv " + isLight + "Dark " + isLight + "shadow" }>
    //             <form onSubmit={e => handleRegister(e)}>

    //                 {/* <label htmlFor="username">Usuario:</label> */}
    //                 <span id="errorMessage" style={{color:"red"}}>Usuario o contraseña incorrectas</span>
    //                 <input type="text" name="username" id="username" placeholder="Usuario"/>
    //                 <input type="email" name="email" id="email" placeholder="Correo Electronico"/>

    //                 {/* <label htmlFor="pass">Contraseña: </label> */}
    //                 <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
    //                 <input type="password" name="pass2" id="pass2" placeholder="Repite la contraseña"/>
    //                 <button className="formSubmit" type="submit" >Regitrar</button>
    //             </form>
    //             <div style={{margin: "auto", textAlign:"center"}}> - o - </div>
    //                 <Link to="/login">Inicia Sesión</Link>
    //         </div>
    //     </div>
}