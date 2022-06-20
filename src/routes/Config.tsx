import Card from "../components/Card";
import Input from "../components/Input";
import { auth, db } from "../firebase";
import { getAuth, updateEmail, updateProfile, updatePassword, signOut, deleteUser } from "firebase/auth";
import React, { useState } from "react";
import LightSwitch from "../components/LightSwitch";
import ConfirmModal from "../components/ConfirmModal";
import { doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Config({ data }: { data: any }) {

    const refs: { [key: string]: HTMLInputElement | null } = {}

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)

    const changeInDb = async (FirebaseRef: string, changes: any) => {
        const response = await fetch(`http://localhost:4400/u/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                FirebaseRef,
                changes
            })
        })
        const data = await response.json()
        return data
    }

    const handleUserNameChange = async () => {
        const value = refs['username']!.value.trim()
        if (value == "" || value.length <= 4 || value == auth.currentUser?.displayName) return;
        await updateProfile(auth.currentUser!, { displayName: value })
        await changeInDb(auth.currentUser?.uid!, { Username: value })
    }

    const handleUpdateEmail = async () => {
        const value = refs['email']!.value.trim()
        if (value == "" || value == auth.currentUser?.email) return;
        try {
            await updateEmail(auth.currentUser!, value)
            await changeInDb(auth.currentUser?.uid!, { Email: value })
        } catch (e) {
            console.log(e)
        }

    }

    const handleChangePassword = async () => {
        const value = refs['password']!.value.trim()
        if (value == "") return;
        await updatePassword(auth.currentUser!, value);
        signOut(auth)
    }

    const handleDisconect = async () => {
        try {
            const docRef = doc(db, "users", auth.currentUser?.uid!);
            const res = await fetch("http://localhost:4400/r/unsubscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    roomId: data!._id,
                    userId: auth.currentUser?.uid!
                })
            })
            const data_ = await res.json()

            await updateDoc(docRef, {
                AccessKey: ""
            })
            
        location.reload()

        }
        catch (e) {
            console.log(e)
        }
    }

    const handleDeleteAccount = async () => {
        await fetch("http://localhost:4400/u/delete-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                userId: auth.currentUser?.uid!
            })
        })
        console.log('deleted')
        await deleteUser(auth.currentUser!)
        location.reload()
    }





    return <Card className="relative h-[88vh]">
        <h1>Configuración</h1>
        <h2 className="text-xl">USUARIO</h2>
        <Input.Simple ref={(ref: any) => refs['username'] = ref} disabled={false} label="Nombre de ususario" placeholder={auth.currentUser?.displayName!} />
        <a onClick={() => handleUserNameChange()} className="text-blue-mid cursor-pointer">Cambiar</a>
        <Input.Simple ref={(ref: any) => refs['email'] = ref} disabled={false} label="Email" placeholder={auth.currentUser?.email!} />
        <a onClick={() => handleUpdateEmail()} className="text-blue-mid cursor-pointer">Cambiar</a>
        <span className="text-sm text-gray-300 italic">Podría necesario volver a iniciar sesión si ha pasado mucho tiempo.</span>
        <Input.Simple disabled={false} label="Número de Teléfono" value={auth.currentUser?.phoneNumber!} />
        <a className="text-blue-mid cursor-pointer">Cambiar</a>
        <Input.Simple ref={(ref: any) => refs['password'] = ref} disabled={false} label="Contraseña" value={"*******"} />
        <a onClick={() => handleChangePassword()} className="text-blue-mid cursor-pointer">Cambiar</a>

        <h2 className="text-xl">Otras configuraciones</h2>
        <div>
            <span>Modo Oscuro</span> <LightSwitch />
        </div>

        <ConfirmModal onAccept={handleDisconect} buttonText="Si, Salir" title="¿Estás seguro que quieres salir de la clase?" description={"Para volver a entrar deberás pedir el código de nuevo"} isOpen={modalOpen} setIsOpen={setModalOpen} />
        {data && <div>
            <span onClick={() => setModalOpen(true)} className="hover:text-red-500 cursor-pointer "> Salir de la clase actual </span>
        </div>}

        <ConfirmModal onAccept={handleDeleteAccount} buttonText="Si, Salir" title="¿Estás seguro que quieres eliminar tu cuenta?" description={"Esta acción es irreversible"} isOpen={modalOpen2} setIsOpen={setModalOpen2} />
        <div className="absolute bottom-5 right-3">
            <span className="p-2 bg-red-500 rounded text-white hover:bg-transparent hover:border border-red-500 hover:text-red-500 hover:shadow-md cursor-pointer" onClick={() => setModalOpen2(true)}>Eliminar tu cuenta</span>
        </div>
        <div className="absolute bottom-2 left-4 flex gap-5">
            <div className="hover:text-blue-mid">
                <Link to={'/policy'}>Politica de Privacidad</Link>
            </div>
            <div className="hover:text-blue-mid">
                <Link to={'/Cookies'}>Cookies</Link>
            </div>
        </div>


    </Card>
}