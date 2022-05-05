import { useContext } from "react";
import { Link } from "react-router-dom"
import LightContext from "../lightContext";
import Input from "../components/Input";

import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'

// import '../default.css';
// import "../lightmode.css";
// import "../styles/LogIn.css"

import { auth } from "../firebase";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup'
import { BsFacebook, BsGoogle } from "react-icons/bs";
import LightSwitch from "../components/LightSwitch";

export default function Register() {


    const SignUpSchema = yup.object().shape({
        username: yup.string().min(3, 'El username debe contener al menos 3 caracteres').max(16, 'El username no puede tener más de 16 caracteres.').trim('El username no puede estar vacio').strict().required('El username no puede estar en blanco'),
        email: yup.string().email("El email debe ser un Email válido").required("El correo no puede estar en blanco"),
        password: yup.string()
            .required("La contraseña no puede estar en blanco")
            .min(6, "La contraseña es muy corta, al menos debe tener 6 cm"),
        passwordConfirmation: yup.string()
            .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden').required("La contraseña no puede estar en blanco")
    });

    interface RegisterProps {
        email: string,
        password: string,
        username: string,
    }

    const handleRegister = ({ email, password, username }: RegisterProps) => {

        createUserWithEmailAndPassword(auth, email, password)
            .then(credential => {
                sendEmailVerification(credential.user,).then(function () {
                    updateProfile(credential.user, { displayName: username })
                })
            })
            .catch(e => alert(e))
    }
    const initialValues = { username: "", email: "", password: "", passwordConfirmation: "" }

    return <Formik initialValues={initialValues} validationSchema={SignUpSchema} onSubmit={values => handleRegister(values)}>
        {formik => {
            const { errors, touched, isValid, dirty } = formik;
            return <div className="flex flex-col h-full bg-blue-500 justify-center items-center">
                <LightSwitch />
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
                    <div className="m-auto h-px w-full bg-slate-300 mt-1 mb-3"/>
                    <div className="flex flex-col">
                        <button
                            type="submit"
                            className={`bg-blue-500 rounded h-10 px-10 text-white font-semibold  ${!(dirty && isValid) ? "bg-gray-400" : "hover:bg-blue-500 hover:cursor-pointer"}`}
                            disabled={!(dirty && isValid)}
                        >
                            Registrarse
                        </button>

                        <div className="flex gap-2">
                            <button className="bg-white w-1/2 m-auto flex justify-center p-3 my-5 hover:shadow-md border-[1px] hover:border-[#db4a39] hover:scale-105 rounded ease-in-out duration-200" onClick={() => null}>
                                <BsGoogle size={20} color="#db4a39" />
                            </button>
                            <button className="bg-white w-1/2 m-auto flex justify-center p-3 my-5 hover:shadow-md border-[1px] hover:border-[#4267B2] hover:scale-105 rounded ease-in-out duration-200" onClick={() => null}>
                                <BsFacebook size={20} color="#4267B2"/> 
                            </button>
                        </div>
                        <span><Link to={'/login'} className="underline hover:text-blue-600 text-sm">Inicia Sesión</Link></span>
                    </div>
                </Form>
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