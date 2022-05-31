import { useContext, useState } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";


import { BeatLoader } from "react-spinners";

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth'


import { auth } from "../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup'

export default function LogIn() {
    let [btnText, setBtnText] = useState(<div>Inicia Sesión</div>)
    const isLight = useContext(LightContext);

    const SignInSchema = yup.object().shape({
        email: yup.string().email("El email debe ser un Email válido").required("El correo no puede estar en blanco"),

        password: yup.string()
            .required("La contraseña no puede estar en blanco")
            .min(4, "La contraseña es muy corta, al menos debe tener 4 cm"),
    });

    interface LoginProps {
        email:string,
        password:string,
    }
    const handleLogIn = ({email, password}: LoginProps) => {
        setBtnText( <BeatLoader size={10} color={"#ffffff"}/> )
        setPersistence(auth, browserLocalPersistence ).then(() => {
            signInWithEmailAndPassword(auth, email, password)
        .then(credentials => {
            if(!credentials) return;
            alert('Logged in') 
        })
        .catch(e => {
            setBtnText(<div>Inicia Sesión</div>)
        })
        })
        
    }

    const LogInWithGoogle = () => {
        const Provider = new GoogleAuthProvider
        signInWithPopup(auth, Provider)
            .then(() =>
                console.log("here")
            )
    }

    const initialValues = { email: "", password: "" }

    return <Formik initialValues={initialValues} validationSchema={SignInSchema} onSubmit={values => handleLogIn(values)}>
        {formik => {
            const { errors, touched, isValid, dirty } = formik;
            return <div className="flex flex-col w-full max-h-screen align-middle justify-center">
                <h1 className="text-3xl text-center pt-5">Sign in to continue</h1>
                <Form className="p-5 w-full sm:w-96 m-auto mt-3 rounded-md shadow-xl dark-card-bg">
                    <div className="flex flex-col min-h-[90px]">
                        <label htmlFor="email">Email</label>
                        <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`border-b-2 p-2 rounded-sm py-2 ${errors.email ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-mid"}`}
                        />
                        <ErrorMessage name="email" component="span" className="text-red-600" />
                    </div>

                    <div className="flex flex-col min-h-[90px] mb-5">
                        <label htmlFor="password">Password</label>
                        <Field
                            type="password"
                            name="password"
                            id="password"
                            className={`border-b-2 p-2 rounded-sm ${errors.password ?
                                "border-red-600 text-red-600" : "text-gray-400 border-blue-mid"}`}
                        />
                        <ErrorMessage
                            name="password"
                            component="span"
                            className="text-red-600"
                        />
                    </div>
                    <div className="flex flex-col">
                        <button
                            type="submit"
                            className={`bg-blue-mid rounded-sm h-10 p-2 px-10 text-white font-semibold  ${!(dirty && isValid) ? "bg-gray-400" : "hover:bg-blue-mid hover:cursor-pointer"}`}
                            disabled={!(dirty && isValid)}
                        >
                           {btnText}
                        </button>
                        <span className="m-auto my-4 select-none">O</span>
                        <span><Link to={'/register'} className="underline hover:text-blue-600">Registrate</Link></span>
                    </div>
                </Form>
                <button className="w-1/3 m-auto flex justify-center p-3 my-5 shadow-md border-2 border-red-600 rounded-md bg-red-600 hover:bg-gray-100" onClick={() => LogInWithGoogle()}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Logo de google" width={20} height={20} />
                </button>
            </div>


        }}
    </Formik>
}