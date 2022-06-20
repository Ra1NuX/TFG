import { Link } from "react-router-dom"
import Input from "../components/Input";

import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

// import '../default.css';
// import "../lightmode.css";
// import "../styles/LogIn.css"

import { auth } from "../firebase";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup'
import { BsGithub, BsGoogle } from "react-icons/bs";

import {db} from "../firebase";
import {doc, setDoc} from 'firebase/firestore'

export default function Register() {


    const SignUpSchema = yup.object().shape({
        username: yup.string().min(3, 'El username debe contener al menos 3 caracteres').max(16, 'El username no puede tener más de 16 caracteres.').trim('El username no puede estar vacio').strict().required('El username no puede estar en blanco'),
        email: yup.string().email("El email debe ser un Email válido").required("El correo no puede estar en blanco"),
        password: yup.string()
            .required("La contraseña no puede estar en blanco")
            .min(4, "La contraseña es muy debil, al menos debe tener 4 caracteres."),
        passwordConfirmation: yup.string()
            .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden').required("La contraseña no puede estar en blanco")
    });

    interface RegisterProps {
        email: string,
        password: string,
        username: string,
    }
    const LogInWithGoogle = () => {
        const Provider = new GoogleAuthProvider
        signInWithPopup(auth, Provider)
    }

    const LogInWithGithub = () => {
        const Provider = new GithubAuthProvider
        signInWithPopup(auth, Provider)
    }
    const handleRegister = ({ email, password, username }: RegisterProps) => {

        createUserWithEmailAndPassword(auth, email, password)
            .then(credential => {
                sendEmailVerification(credential.user,).then(async () => {
                    const refDbUser = doc(db, 'users', credential.user.uid)
                    await setDoc(refDbUser, {})
                    updateProfile(credential.user, { displayName: username })
                })
            })
            .catch(e => alert(e))
    }
    const initialValues = { username: "", email: "", password: "", passwordConfirmation: "" }

    return <Formik initialValues={initialValues} validationSchema={SignUpSchema} onSubmit={values => handleRegister(values)}>
        {formik => {
            const { errors, touched, isValid, dirty } = formik;
            return <div className="flex flex-col h-full bg-blue-mid justify-center items-center">
                <h1 className="font-bold text-white text-4xl border-b-2 rounded-sm px-2">REGISTRATE</h1>
                <Form className="p-7 h-fit m-4 w-[90%] md:w-[420px] rounded bg-[#fafafa] shadow-md">

                    <div className="flex flex-col">
                        <Input name="username" label="Username" type={"text"} autoComplete="off" required />
                    </div>

                    <div className="flex flex-col">
                        <Input name="email" label="Email" type={"email"} autoComplete="off" required />
                    </div>

                    <div className="flex flex-col">
                        <Input name="password" label="Password" type={"password"} autoComplete="off" required />
                    </div>
                    <div className="flex flex-col">
                        <Input name="passwordConfirmation" label="Password Confirmation" type={"password"} autoComplete="off" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <button
                            type="submit"
                            className={`bg-blue-mid rounded h-10 px-10 text-white font-semibold  ${!(dirty && isValid) ? "bg-gray-400" : "hover:bg-blue-mid hover:cursor-pointer"}`}
                            disabled={!(dirty && isValid)}
                        >
                            Registrarse
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
                        <span><Link to={'/login'} className="underline hover:text-blue-600 text-sm">Inicia Sesión</Link></span>
                    </div>
                </Form>
            </div>


        }}
    </Formik>
}