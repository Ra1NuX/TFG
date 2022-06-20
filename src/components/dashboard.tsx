
import { useEffect, useState, useContext } from "react"

import { auth, db, storage } from "../firebase"
import { updateProfile } from "@firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage"
import DashboardLayout from "../layout/DashboardLayout"
import ProfilePic from "./ProfilePic"
import Input from "./Input"
import { Formik } from "formik"
import Card from "./Card"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ModalGeneral from "./ModalGeneral"

import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { BsFillLockFill } from "react-icons/bs"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import Loader from "./Loader"
import NewEvents from "./NewEvents"
import Clock from "./Clock"


export default function Dashboard({ ...props }) {

    const { data, cts } = props

    const Today = new Date()
    const dbRef = doc(db, "users", auth.currentUser?.uid!)

    const [accessKey, setAccessKey] = useState<string>("")
    const [profile, setProfile] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(true)

    const subscribe = async (AccessKey: string) => {
        await cts(AccessKey)
        
    }



    const getUserData = async () => {
        const docSnap = await getDoc(dbRef)
        if (docSnap.exists()) {
            setProfile(docSnap.data())
            
        }
    }

    useEffect(() => {
        getUserData().then(() => {
            setLoading(false)
        })
    }, [])


    const handleName = (value: string) => {
        updateDoc(dbRef, { name: value })
        //importante para el server
    }
    const handlebirthDate = (value: Date) => {
        updateDoc(dbRef, { birthDate: value.toISOString() })
        //importante para el server
    }
    const handleProvince = (value: string) => {
        updateDoc(dbRef, { province: value })
    }
    const handleCity = (value: string) => {
        updateDoc(dbRef, { city: value })
    }
    const handleAddress = (value: string) => {
        updateDoc(dbRef, { address: value })
    }
    const handlePhone = (value: string) => {
        updateDoc(dbRef, { phone: value })
    }
    const postalCode = (value: string) => {
        updateDoc(dbRef, { postalCode: value })
    }
    // const handleEdit = (key:string, value:string) => {
    //     updateDoc(dbRef, {[key]: value })
    // }

    const dayPercent = ((Today.getHours() - 8) * 100 / 8)
    const weekPercent = ((Today.getDay() - 1) * 100 / 5)

    return loading ? <Loader /> : (

        <DashboardLayout>
            <Card>
                <ProfilePic clickable size={100} />
                <Input.Simple label="Nombre de usuario" placeholder="Nombre de usuario" value={auth.currentUser?.displayName!} />
                <Input.Simple placeholder="Email" label="Correo Electronico" value={auth.currentUser?.email!} />
                <Input.Simple placeholder="Añada el doble factor de verificación en la configuración" label="Teléfono" />
                <Input.Editable onEdit={handleName} placeholder="Nombre completo" label="Nombre completo" value={profile.name} />
                <div className={`${data ? "grid md:grid-cols-2" : ""} gap-2`}>
                    <div>
                        <Input.Editable type="date" dateValue={typeof profile.birthDate == "string" ? new Date(profile.birthDate) : undefined} onEdit={handlebirthDate} placeholder="DD/MM/AAAA (XX)" label="Fecha de nacimiento" />
                    </div>
                    <div>
                        {data && <Input.Simple placeholder="Curso" label="Curso" name="curso" value={data.Name} />}
                    </div>
                </div>
                {data && <Input.Simple placeholder="Instituto" label="Instituto" value={data.CenterName} />}
                <Input.Editable onEdit={handleProvince} placeholder="Provincia" label="Provincia" value={profile.province} />
                <Input.Editable onEdit={handleAddress} placeholder="Dirección" label="Dirección" value={profile.address} />
                <Input.Editable onEdit={handleCity} placeholder="Ciudad" label="Ciudad" value={profile.city} />
                <Input.Editable onEdit={postalCode} placeholder="Código Postal" label="Código Postal" value={profile.postalCode} />


            </Card>

            <div className="flex flex-col relative">
                <Clock />
                <div className="relative"></div>
                {data && console.log(data.message == "User is banned from this room")} 
                {!data || data.message == "User is banned from this room" ? <ModalGeneral title="Ingrese el identificador de su clase: "
                    buttonText={<div className="absolute inset-0 mt-2 h-[80vh] bg-black/95 rounded">

                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                            <BsFillLockFill color="#ffffff" size={"3em"} className="m-auto" />
                            <span className="text-white">Unete a una clase para desbloquear nuevas caracteristicas</span>
                        </div>
                    </div>
                    }>
                    <Input.Simple disabled={false} onChange={e => setAccessKey(e.target.value)} placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX" />
                    <button className={`bg-blue-mid rounded-sm h-10 p-2 px-10 text-white font-semibold hover:bg-blue-mid hover:cursor-pointer`} onClick={() => subscribe(accessKey)}>Ingresar</button>


                </ModalGeneral> : <>

                    <Card className="grid grid-cols-3 gap-4 justify-evenly">
                        <div className="grid grid-cols-1 !mt-0">
                            <CircularProgressbar className="max-h-20 md:h-20 !mt-0 w-fit inline mx-auto" strokeWidth={13} value={Today.getHours() - 8} text={dayPercent > 100 ? 100 + "%" : dayPercent < 0 ? 0 + "%" : dayPercent.toFixed() + "%"} minValue={0} maxValue={7} styles={buildStyles({
                                pathColor: dayPercent < 100 ? '#B0E0E6' : '#3F72AF',
                                textColor: dayPercent < 100 ? '#B0E0E6' : '#3F72AF',
                                trailColor: '#B0E0E614',
                                backgroundColor: '#3e98c7',
                            })} />
                            <span className="text-center">Dia en curso</span>
                        </div>
                        <div className="grid grid-cols-1 !mt-0">
                            <CircularProgressbar className="max-h-20 md:h-20  w-fit inline mx-auto" strokeWidth={13} value={Today.getDay()} minValue={1} maxValue={5} text={(weekPercent > 100 ? 100 : weekPercent < 0 ? 0 : weekPercent.toFixed()) + "%"}
                                styles={buildStyles({
                                    pathColor: (weekPercent < 100 || weekPercent < 0) ? '#B0E0E6' : '#3F72AF',
                                    textColor: (weekPercent < 100 || weekPercent < 0) ? '#B0E0E6' : '#3F72AF',
                                    trailColor: '#B0E0E614',
                                    backgroundColor: '#3e98c7',
                                })
                                } />
                            <span className="text-center">Semana en curso</span>
                        </div>
                        <div className="grid grid-cols-1 !mt-0">
                            <CircularProgressbar className=" max-h-20 md:h-20 !mt-0 w-fit inline mx-auto" strokeWidth={13} value={Today.getMonth() < 8 ? Today.getMonth() + 12 - 8 : Today.getMonth() - 8} minValue={0} maxValue={9} text={(((Today.getMonth() < 8 ? Today.getMonth() + 12 - 8 : Today.getMonth() - 8) * 100 / 9) > 100 ? 100 : ((Today.getMonth() < 8 ? Today.getMonth() + 12 - 8 : Today.getMonth() - 8) * 100 / 9).toFixed()) + "%"}
                                styles={buildStyles({
                                    pathColor: (Today.getMonth() < 8 ? Today.getMonth() + 12 - 8 : Today.getMonth() - 8) <= 8 ? '#B0E0E6' : '#3F72AF',
                                    textColor: (Today.getMonth() < 8 ? Today.getMonth() + 12 - 8 : Today.getMonth() - 8) <= 8 ? '#B0E0E6' : '#3F72AF',
                                    trailColor: '#B0E0E614',
                                    backgroundColor: '#3e98c7',
                                })
                                } />
                            <span className="text-center">Total del curso</span>
                        </div>



                    </Card>
                    <NewEvents data={data} />
                    <div className="borde-b border rounded-full border-gray-200 " />

                </>}
            </div>

        </DashboardLayout>
    )
}
