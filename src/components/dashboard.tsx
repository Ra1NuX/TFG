
import { useEffect, useState } from "react"

import { auth, storage } from "../firebase"
import { updateProfile } from "@firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage"
import "../styles/dashboard.css"



export default function Dashboard({...props}){

   
    const [imgURL, setImageURL ] = useState("")

    useEffect(() => {
        console.log(auth.currentUser?.photoURL)
        auth.currentUser?.photoURL == null || auth.currentUser?.photoURL == undefined 
        ? setImageURL("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png") 
        : setImageURL(auth.currentUser.photoURL) ; 
    },[])

    const handleChangeFoto = async(e:any) => {
        if(e.target.files.length == 0) return;
        const profilePicsRef = ref(storage, `profilePics/${auth.currentUser?.displayName}-profile-pic.jpg`)
        await uploadBytes(profilePicsRef, e.target.files[0]); 
        const photoURL = await getDownloadURL(profilePicsRef)
        await updateProfile(auth.currentUser!, {photoURL})
        setImageURL(auth.currentUser!.photoURL!)
    }


    const {size} = props
    return <div>
    <div className="NameAndFoto">
        <input type="file" onChange={(e) => handleChangeFoto(e)} accept={".jpeg, .png, .jpg, .bmp, "} id="openProfilePicEditor" style={{display:"none"}} />
        <label htmlFor="openProfilePicEditor" ><img src={`${imgURL}`} alt={`Foto de Perfil de ${auth.currentUser?.displayName}`} /></label>
        <h1>Bienvenido {auth.currentUser?.displayName}</h1>
    </div>
    <h3>Cursos:</h3> Actualmente no esta insctito en ningun curso. <button>Inscribirse</button>
    <h3>Correo Electronico: </h3> {auth.currentUser?.email} <button>Editar </button>
    </div>
}
