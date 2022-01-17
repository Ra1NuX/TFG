import { auth } from "../firebase"
import { signOut } from "@firebase/auth"

import lightContext from "../lightContext"

import "../styles/sidebar.css"
import "../lightmode.css"
import { useContext } from "react"
import { Link } from "react-router-dom"

export default function Sidebar({...props}){
    const {size} = props
    const isLight = useContext(lightContext);

    console.log(isLight)

    return <div className={isLight + "Dark"} style={{position: "absolute", top:0 , left: 0, height: "100vh", width: size}}>
        <div style={{position: "absolute", top: 34, fontFamily: "Poppins", width: "100%"}}>
            <img src={auth.currentUser?.photoURL + ""} alt="" height={90} style={{ width: "auto", height: 90, borderRadius: 150} }/>
            <div>{auth.currentUser?.displayName}</div>
            <ul className="sidebarList">
                <li><Link to="/dashboard">Profile</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/calendar">Calendario</Link></li>
                <li><Link to="/drive">Cajón</Link></li>
            </ul>
        
        </div>
        
        
        <div style={{position: "absolute", bottom: 0, fontFamily: "Poppins"}}>
            <button className={isLight+ " sidebar"} onClick={() => console.log("Configuracion")} style={{width: size}}>Configuración</button>
            <button className={isLight + " sidebar"} onClick={() => {signOut(auth); location.href = "./"}} style={{width: size}}>Sign Out</button>
        </div>
    </div>
}
