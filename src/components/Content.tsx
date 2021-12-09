import { Routes, Route, Navigate } from "react-router"
import Dashboard from "./dashboard"
import Chat from "./Chat"

export default function Content({...props}) {
    const {size} = props 
    return <div style={{marginLeft: size+10}}>
            <Routes>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="*" element={<div>Esto es un error</div>} />
            </Routes>
    </div>

}