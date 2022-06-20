import { auth } from "../firebase"
import { signOut } from "@firebase/auth"
import { FaCog, FaSignOutAlt } from 'react-icons/fa'

import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarContent, SidebarFooter, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import MenuIcon from "./MenuIcon"
import ProfilePic from "./ProfilePic";
import { Socket } from "socket.io-client";
import ConfirmModal from "./ConfirmModal";



interface SideBarProps {
    data: any;
    routes: Array<{
        path: string,
        name: string,
        element: React.ReactElement,
        icon?: React.ReactElement | string,
        courses?: any,
        courseRequired?: boolean
    }>
    sidebarOpen: boolean;
    setSidebarOpen: () => void;
    socket: Socket;
    setConfirmModal: (value: boolean) => void;
}



export default function Sidebar({ data, setConfirmModal, routes, sidebarOpen, setSidebarOpen, socket }: SideBarProps) {


    const [uri, setUri] = useState("")
    const [notifications, setNotifications] = useState<any>({})



    let selectedLocation = useLocation().pathname

    useEffect(() => {

        const setChatNotiNotification = (msg: any, subject: string, id: string) => {
            if (auth.currentUser?.uid === id) return
            setNotifications((notifications: any) => ({ ...notifications, Chat: notifications.Chat + 1 }))
        }

        const setCalendarNotiNotification = (id: string) => {
            if (auth.currentUser?.uid === id) return
            setNotifications((notifications: any) => ({ ...notifications, Calendario: notifications.Calendario + 1 }))
        }


        socket.on('messageSended', setChatNotiNotification)
        socket.on('event-change-server', setCalendarNotiNotification)
        return () => {
            socket.off('messageSended', setChatNotiNotification)
            socket.off('event-change-server', setCalendarNotiNotification)
        }
    }, [])


    useEffect(() => {
        setUri(selectedLocation)
    }, [selectedLocation])



    return <ProSidebar breakPoint="md" width={240} collapsedWidth={60} collapsed={!sidebarOpen} toggled={sidebarOpen} onToggle={setSidebarOpen}>
        <SidebarHeader className="!border-b-0">
            <div className="flex pl-3 my-7 items-center ">

                <MenuIcon onClick={setSidebarOpen} className=" opacity-0 md:opacity-100" open={sidebarOpen} />

            </div>
        </SidebarHeader>
        <SidebarContent>
            <div className="w-full" >
                <div className={`py-4 mb-5 text-center  ${sidebarOpen ? "bg-white/20" : ""} rounded mx-2 transition-all ease-in-out`}>
                    <ProfilePic className="drop-shadow" size={sidebarOpen ? 70 : 35} />
                    {sidebarOpen && <div>
                        <h2 className=" text-sm italic">Welcome</h2>
                        <h3 className="text-2xl">{auth.currentUser?.displayName}</h3>
                    </div>}
                </div>
            </div>
            <Menu iconShape="round">
                {routes.map((route, index) => {
                    if (!notifications.hasOwnProperty(route.name)) notifications[route.name] = 0
                    if (notifications[route.name] != 0) uri === route.path && setNotifications((notifications: any) => ({ ...notifications, [route.name]: 0 }))

                    if (!route.courseRequired) {
                        return <MenuItem active={uri === route.path} className={`menuItem ${!sidebarOpen ? "mr-0 before:!content-none after:!content-none" : ""}`} key={index} icon={route.icon} title={route.path}><Link to={route.path}>{route.name}</Link></MenuItem>
                    } else {
                        return data && <MenuItem suffix={<span className={`bg-red-400/80 text-white flex justify-center items-center w-5 h-5 rounded-full text-xs ${notifications[route.name] == 0 ? "hidden" : ""}`}>{notifications[route.name]}</span>} active={uri === route.path} className={`menuItem ${!sidebarOpen ? "mr-0 before:!content-none after:!content-none" : ""}`} key={index} icon={route.icon} title={route.path}><Link to={route.path}>{route.name}</Link></MenuItem>
                    }
                }
                )}
            </Menu>
        </SidebarContent>
        <SidebarFooter className="!border-t-0">
            <Link to={"/configuration"}>
                <div className="hover:bg-gray-800/40 hover:cursor-pointer p-2 rounded m-px text-center" >
                    <FaCog className="inline mb-1 overflow-hidden truncate !text-white " color="white" /> {sidebarOpen ? "Configuración" : ""}
                </div>
            </Link>

            <div onClick={() => setConfirmModal(true)} className="hover:bg-red-800/80 hover:cursor-pointer p-2 m-px text-red-600 hover:text-white text-center">
                <FaSignOutAlt className="inline mb-1 truncate" /> {sidebarOpen ? "Cerrar sesión" : ""}
            </div>
        </SidebarFooter>
    </ProSidebar >

}
