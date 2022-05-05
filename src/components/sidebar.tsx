import { auth } from "../firebase"
import { signOut } from "@firebase/auth"
import { motion } from 'framer-motion'
import { FaAddressCard, FaCalendarAlt, FaCog, FaComment, FaSignOutAlt } from 'react-icons/fa'

import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarFooter, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { BsArrowRightShort } from "react-icons/bs";

import logo from '../public/temporal-logo-dark.svg'

interface SideBarProps {
    onCourse: boolean,
    routes: Array<{
        path: string,
        name: string,
        element: React.ReactElement,
        icon?: React.ReactElement | string,
        courses?: any,
        courseRequired?: boolean
    }>
}



export default function Sidebar({ onCourse, routes }: SideBarProps) {

    const [close, setClose] = useState(false)
    const [uri, setUri] = useState("")

    let selectedLocation = useLocation().pathname

    useEffect(() => {
        setUri(selectedLocation)
    }, [selectedLocation])

    console.log(uri)

    const handleLogOut = () => {
        if (!confirm('¿Estas seguro que quieres cerrar sesión?')) return;
        signOut(auth);
        location.reload();
    }

    return <ProSidebar breakPoint="md" width={200} collapsedWidth={80} collapsed={close}>
        <SidebarHeader>
        <img src={logo} alt="logo" width={"70%"} />
            <div className="flex pl-3 my-5 items-center ">
                {/* <ProfilePic size={35} className="mr-3" /> */}
                {/* {!close && <div className="font-semibold text-sm text-center self-center text-ellipsis overflow-hidden mr-1">{auth.currentUser?.displayName}</div>} */}
                
                
                <motion.button className="-mr-1" animate={{
                    rotate: !close ? 180 : 0,
                    transition: { duration: 0.2 }
                }} onClick={() => setClose(!close)}>
                    <BsArrowRightShort size={"2em"}
                    />
                </motion.button>
                
            </div>
        </SidebarHeader>
        <SidebarContent>
            <Menu iconShape="round">
                {routes.map((route, index) => {
                    if (!route.courseRequired) {
                        return <MenuItem active={uri === route.path} className={`menuItem ${close ? "mr-0 before:!content-none after:!content-none" : ""}`} key={index} icon={route.icon} title={route.path}><Link to={route.path}>{route.name}</Link></MenuItem>
                    } else {
                        return !onCourse && <MenuItem active={uri === route.path} className={`menuItem ${close ? "mr-0 before:!content-none after:!content-none" : ""}`} key={index} icon={route.icon} title={route.path}><Link to={route.path}>{route.name}</Link></MenuItem>
                    }
                }
                )}
            </Menu>
        </SidebarContent>
        <SidebarFooter className="!border-t-0">
            <div className="hover:bg-gray-800 hover:cursor-pointer p-2 rounded m-px text-center" onClick={() => console.log("Configuracion")} >
                <FaCog className="inline mb-1" /> {!close ? "Configuración" : ""}
            </div>
            <div className="hover:bg-red-800 hover:cursor-pointer p-2 rounded m-px text-red-600 hover:text-white text-center" onClick={() => handleLogOut()}>
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
