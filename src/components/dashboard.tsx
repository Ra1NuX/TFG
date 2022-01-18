
import { useEffect, useState, useContext } from "react"

import { auth, storage } from "../firebase"
import { updateProfile } from "@firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage"
import "../styles/dashboard.css"


export default function Dashboard({ ...props }) {

    const { data, cts } = props


    const [imgURL, setImageURL] = useState("")


    useEffect(() => {

        auth.currentUser?.photoURL == null || auth.currentUser?.photoURL == undefined
            ? setImageURL("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
            : setImageURL(auth.currentUser.photoURL);

        cts("_p6dqd7wdb"); // connect to server

    }, [])

    const handleChangeFoto = async (e: any) => {

        if (e.target.files.length == 0) return;
        const profilePicsRef = ref(storage, `profilePics/${auth.currentUser?.displayName}-profile-pic.jpg`)

        await uploadBytes(profilePicsRef, e.target.files[0]);
        const photoURL = await getDownloadURL(profilePicsRef);

        await updateProfile(auth.currentUser!, { photoURL });
        setImageURL(auth.currentUser!.photoURL!);

    }

    function dataCoruses() {
        return <>
            <div className="row">
                <div className="group-data">
                    <label>Denominación: </label>
                    <input type="text" disabled value={data.roomName} />
                </div>
            </div>
            <div className="row">
                <div className="group-data">
                    <label>Tutor: </label>
                    <input type="text" disabled value={"Jhon Doe Doe"} />
                </div>
            </div>
        </>
    }


    const { size } = props
    return <div className="dashboard-main">
        <div className="NameAndFoto">
            <input type="file" onChange={(e) => handleChangeFoto(e)} accept={".jpeg, .png, .jpg, .bmp, "} id="openProfilePicEditor" style={{ display: "none" }} />
            <label htmlFor="openProfilePicEditor" ><img src={`${imgURL}`} alt={`Foto de Perfil de ${auth.currentUser?.displayName}`} /></label>
            <h1>Bienvenido {auth.currentUser?.displayName}</h1>
        </div>
        <h3 className="Group-Title">Información del Curso</h3>

        {data == null
            ? "Actualmente no esta cursando ningun curso"
            : dataCoruses()
        }


        <h3 className="Group-Title">Información Personal</h3>
        <div className="row">
            <div className="group-data">
                <label>Nombre Completo: </label>
                <input type="text" id="name" disabled value={auth.currentUser?.displayName + ""} />
            </div>
            <div className="group-data">
                <label>Edad: </label>
                <input type="number" disabled value={18} />
            </div>
        </div>
        <div className="row">
            <div className="group-data">
                <label>Correo Electronico: </label>
                {<input type="email" disabled value={auth.currentUser?.email + ""} />}
            </div>
        </div>
    </div>
}
