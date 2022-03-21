import { auth } from "../firebase"
import { signOut } from "@firebase/auth"

import { FaAddressCard, FaCalendarAlt, FaCog, FaComment, FaSignOutAlt } from 'react-icons/fa'


// import "../styles/sidebar.css"
// import "../lightmode.css"
let FullScreen: boolean = true;
if (typeof window.handler != "undefined") {
    FullScreen = window.handler.isFullScreen();
}

interface SideBarProps {
    onCourse: boolean,
}

import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarFooter, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";




export default function Sidebar({ onCourse }: SideBarProps) {

    const [close, setClose] = useState(false)

    const handleLogOut = () => {
        if (!confirm('¿Estas seguro que quieres cerrar sesión?')) return;
        signOut(auth);
        location.href = "./"

    }

    return <ProSidebar className="" width={200} collapsedWidth={80} collapsed={close}>
        <SidebarHeader>
            <button className="absolute right-0" onClick={() => setClose(!close)}>{close ? <BsArrowRightShort size={"2em"} style={{ marginRight: "-5px", marginTop: "-5px", }} /> : <BsArrowLeftShort size={"2em"} />}</button>
            <div className="flex">
                <img src={auth.currentUser?.photoURL + ""} alt="" className="w-10 h-10 rounded-full mx-5 my-2" />
                <div className="font-semibold text-sm text-center self-center text-ellipsis overflow-hidden mr-1">{auth.currentUser?.displayName}</div>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <Menu iconShape="round">
                <MenuItem icon={<FaAddressCard />}><Link to="/dashboard">Perfil</Link></MenuItem>
                {onCourse ? () => {
                    return <>
                    <MenuItem icon={<FaComment />} ><Link to="/chat">Chat</Link></MenuItem>
                    <MenuItem icon={<FaCalendarAlt />} ><Link to="/Calendar">Eventos</Link></MenuItem>
                    </>
                } : null}
            </Menu>
        </SidebarContent>
        <SidebarFooter>
            <div className="hover:bg-gray-800 hover:cursor-pointer p-2 text-center" onClick={() => console.log("Configuracion")} >
                <FaCog className="inline mb-1" /> {!close ? "Configuración" : ""}
            </div>
            <div className="hover:bg-red-800 hover:cursor-pointer p-2 text-red-600 hover:text-white text-center" onClick={() => handleLogOut()}>
                <FaSignOutAlt className="inline mb-1" /> {!close ? "Sign Out" : ""}
            </div>
        </SidebarFooter>
    </ProSidebar>


    // return <div className="absolute top-0 left-0 h-screen shadow-md bg-gray-900 overflow-hidden" style={{ width: size }}>

    //     <div className={`flex flex-col ${!FullScreen ? "mt-9" : ""}`}>
    //         <button onClick={() => onClose()}>x</button>
    //         {!close ? () => {
    //             return <><img src={auth.currentUser?.photoURL + ""} alt="" className="w-24 h-24 rounded-full m-auto my-5" />
    //         <div className="font-semibold text-2xl text-center underline pb-5 border-b-[1px] mb-2 border-gray-700">{auth.currentUser?.displayName}</div>
    //         <Link className="menuItem" to="/dashboard">Profile</Link>
    //         {onCourse ? () => {
    //             return <>
    //                 <Link className="menuItem" to="/chat">Chat</Link>
    //                 <Link className="menuItem" to="/calendar">Calendario</Link>
    //                 <Link className="menuItem" to="/drive">Cajón</Link>
    //             </>
    //         } : null}
    //         </>
    //         }:null}
    //     </div>


    //     {!close ? () => { return <div style={{ position: "absolute", bottom: 0, fontFamily: "Poppins" }}>
    //         <button className="hover:bg-gray-800 p-2" onClick={() => console.log("Configuracion")} style={{ width: size }}>Configuración</button>
    //         <button className="hover:bg-red-800 p-2" onClick={() => { signOut(auth); location.href = "./" }} style={{ width: size }}>Sign Out</button>
    //     </div> }: null}
    // </div>
}
