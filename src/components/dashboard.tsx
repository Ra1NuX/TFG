
import { useEffect, useState, useContext } from "react"

import { auth, storage } from "../firebase"
import { updateProfile } from "@firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage"
import DashboardLayout from "../layout/DashboardLayout"
import ProfilePic from "./ProfilePic"
import Input from "./Input"
import { Formik } from "formik"
import Card from "./Card"


export default function Dashboard({ ...props }) {

    const { data, cts } = props


    


    useEffect(() => {

        cts("_p6dqd7wdb"); // connect to server

    }, [])

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

    return <DashboardLayout>
        <Card>
            <ProfilePic clickable size={100} className="my-3"/>
            <Input.Editable placeholder="Nombre completo" label="Nombre completo"/>
            <div className="flex gap-2">
                <div className="w-1/2">
            <Input.Editable placeholder="DD/MM/AAAA (XX)" label="Fecha de nacimiento"/>
            </div>
            <div className="w-1/2">
            <Input.Editable placeholder="Curso" label="Curso"/>
            </div>
            </div>
            <Input.Editable placeholder="Provincia" label="Provincia"/>
            <Input.Editable placeholder="Instituto" label="Instituto"/>
            <Input.Editable placeholder="Email" label="Correo Electronico"/>
            <Input.Editable placeholder="Teléfono" label="Teléfono"/>

        </Card>

        <div className="flex flex-col">
        <Card/>
        <div className="">
        <Card className="w-4/5"/>
        <Card/>
        </div>
        
        <Card/>
        <Card/> 
            
        </div>
        
    </DashboardLayout>
    // <div className="dashboard-main">

    //     <h3 className="Group-Title">Información del Curso</h3>

    //     {data == null
    //         ? "Actualmente no esta cursando ningun curso"
    //         : dataCoruses()
    //     }


    //     <h3 className="Group-Title">Información Personal</h3>
    //     <div className="row">
    //         <div className="group-data">
    //             <label>Nombre Completo: </label>
    //             <input type="text" id="name" disabled value={auth.currentUser?.displayName + ""} />
    //         </div>
    //         <div className="group-data">
    //             <label>Edad: </label>
    //             <input type="number" disabled value={18} />
    //         </div>
    //     </div>
    //     <div className="row">
    //         <div className="group-data">
    //             <label>Correo Electronico: </label>
    //             {<input type="email" disabled value={auth.currentUser?.email + ""} />}
    //         </div>
    //     </div>
    // </div>
}
