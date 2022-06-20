import { useContext, useState } from "react";
import { Link } from "react-router-dom"


import { BeatLoader } from "react-spinners";

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, GithubAuthProvider } from 'firebase/auth'


import { auth } from "../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup'
import Input from "../components/Input";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";

export default function LogIn() {
    let [btnText, setBtnText] = useState(<div>Inicia Sesión</div>)

    const SignInSchema = yup.object().shape({
        email: yup.string().email("El email debe ser un Email válido").required("El correo no puede estar en blanco"),
        password: yup.string()
            .required("La contraseña no puede estar en blanco")
            .min(4, "La contraseña al menos debe contener 4 caracteres."),
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
        })
        .catch(e => {
            setBtnText(<div>Inicia Sesión</div>)
        })
        })
        
    }

    const LogInWithGoogle = () => {
        const Provider = new GoogleAuthProvider
        signInWithPopup(auth, Provider)
    }

    const LogInWithGithub = () => {
        const Provider = new GithubAuthProvider
        signInWithPopup(auth, Provider)
    }

    const initialValues = { email: "", password: "" }

    return <Formik initialValues={initialValues} validationSchema={SignInSchema} onSubmit={values => handleLogIn(values)}>
        {formik => {
            const { errors, touched, isValid, dirty } = formik;
            return <div className="flex flex-col h-full bg-blue-mid justify-center items-center">
                <h1 className="font-bold text-white text-4xl border-b-2 rounded-sm px-2">Inicia sesión</h1>
                <Form className="p-7 h-fit m-4 w-[90%] md:w-[420px] rounded bg-[#fafafa] shadow-md">
                    <div className="flex flex-col">
                        <Input name="email" label="email" type={"text"} autoComplete="off" required/>
                    </div>
                    <div className="flex flex-col">
                        <Input name="password" label="password" type={"password"} autoComplete="off" required/>
                    </div>

                    <div className="flex flex-col">
                        <button
                            type="submit"
                            className={`bg-blue-mid rounded-sm h-10 p-2 px-10 text-white font-semibold  ${!(dirty && isValid) ? "bg-gray-400" : "hover:bg-blue-mid hover:cursor-pointer"}`}
                            disabled={!(dirty && isValid)}
                        >
                           {btnText}
                        </button>
                        <div className="m-auto h-px w-full bg-slate-300 mt-5"/>
                        <div className="flex gap-2">
                            <button type="button" className="bg-white w-1/2 m-auto flex justify-center p-3 my-5 hover:shadow-md border-[1px] hover:border-[#db4a39] hover:scale-105 rounded ease-in-out duration-200" onClick={() => LogInWithGoogle()}>
                                <BsGoogle size={20} color="#db4a39" />
                            </button>
                            <button type="button" className="bg-white w-1/2 m-auto flex justify-center p-3 my-5 hover:shadow-md border-[1px] hover:border-[#000000] hover:scale-105 rounded ease-in-out duration-200" onClick={() => LogInWithGithub()}>
                                <BsGithub size={20} color="#000000"/> 
                            </button>
                        </div>
                        <span><Link to={'/register'} className="underline hover:text-blue-600">Registrate</Link></span>
                    </div>
                </Form>
            </div>


        }}
    </Formik>
}