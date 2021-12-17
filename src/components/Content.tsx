import { Routes, Route, Navigate } from "react-router"
import { useEffect, useState } from "react"
import Dashboard from "./dashboard"
import Chat from "./Chat"
import Calendar from "./Calendar"

export default function Content({...props}) {
    const {size} = props 

    let [Oclass, setClass] = useState()


    const handleDataChange = (data:any) => {
        setClass(data) ;
    }

    return <div style={{marginLeft: size+10}}>
            <Routes>
                <Route path="/chat" element={<Chat courses={Oclass}/>}/>
                <Route path="/dashboard" element={<Dashboard onDataChange={handleDataChange}/>} />
                <Route path="/calendar" element={<Calendar courses={Oclass}/>}/>
                <Route path="/drive" element={<Calendar />}/>
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="*" element={<div>Esto es un error</div>} />
            </Routes>
    </div>

}