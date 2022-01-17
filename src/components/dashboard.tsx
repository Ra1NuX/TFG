
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

        cts("_ma2l4seqi"); // connect to server

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
        return <><input type="text" disabled value={data.roomName}/>
        <h4>Tutor: </h4>
        <input type="text" disabled value={"Jhon Doe Doe"} />
        </>
    }


    const { size } = props
    return <div>
        <div className="NameAndFoto">
            <input type="file" onChange={(e) => handleChangeFoto(e)} accept={".jpeg, .png, .jpg, .bmp, "} id="openProfilePicEditor" style={{ display: "none" }} />
            <label htmlFor="openProfilePicEditor" ><img src={`${imgURL}`} alt={`Foto de Perfil de ${auth.currentUser?.displayName}`} /></label>
            <h1>Bienvenido {auth.currentUser?.displayName}</h1>
        </div>
        <h3 className="Group-Title">Información del Curso</h3>
        <h4>Denominación: </h4>

        {data == null
            ? "Actualmente no esta cursando ningun curso"
            :  dataCoruses()
        }

        
        <h3 className="Group-Title">Información Personal</h3>
        <h4>Nombre Completo: </h4>
        <input type="text" disabled value={"Jhon Doe Doe"} />
        <h4>Edad: </h4>
        <input type="number" disabled value={18} />
        <h4>Correo Electronico: </h4>
        {<input type="email" disabled value={auth.currentUser?.email + ""} />}
    </div>
}
