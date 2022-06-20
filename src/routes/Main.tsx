

import { Fragment, useEffect, useState } from 'react';

import Sidebar from "../components/Sidebar"
import Content from "../components/Content";
import Dashboard from '../components/Dashboard';
import Chat from '../components/Chat';
import Calendar from '../components/Calendar';
import { auth, db } from "../firebase"
import { FaAddressCard, FaCalendarAlt, FaComment, FaFolder } from 'react-icons/fa';
import TopBar from '../components/TopBar';
import MenuIcon from '../components/MenuIcon';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { io, Socket } from 'socket.io-client';
import Loader from '../components/Loader';
import ProfilePic from '../components/ProfilePic';
import { BsBellFill, BsTrashFill } from 'react-icons/bs';
import { Menu } from '@headlessui/react';

import parse from 'html-react-parser';
import { Link, Navigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { signOut } from 'firebase/auth';
import LightSwitch from '../components/LightSwitch';





export default function Main() {
    const [data, setData] = useState<any>(null);
    const [socket, setSocket] = useState<Socket>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [notifications, setNotifications] = useState<any[]>([])
    
    const [confirmModal, setConfirmModal] = useState<boolean>(false)

    const getRoomDataIfSubscribe = async () => {
        try {
            const docRef = doc(db, "users", auth.currentUser?.uid!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().AccessKey) {
                connectToServer(docSnap.data().AccessKey, false);
            }
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getRoomDataIfSubscribe()
    }, [])

    useEffect(() => {
        if (!socket) {
            const sock = io('http://localhost:4400');
            setSocket(sock)
            setIsLoading(false)
            return
        }
        if (!socket || !data) return
        console.log(data)
        socket.emit('subscribe', { username: auth.currentUser?.displayName, userId: auth.currentUser?.uid, connectedAt: Date.now() }, [...data.Subjects, data._id])
        socket.on('notification', addNotifications)
        return () => { socket.off('notification', addNotifications) }
    }, [data, socket])


    const addNotifications = (notification: any) => {
        if (notification.FirebaseRef == auth.currentUser?.uid) return
        setNotifications((current: any) => [notification, ...current])
        createNoti('Tiene una Notificación.', "Click aquí para ver de que se trata", () => console.log("clicked"))
    }

    const connectToServer = async (AccessKey: string, Subscribe: boolean = true, server: string = "127.0.0.1:4400") => {
        try {
            const docRef = doc(db, "users", auth.currentUser?.uid!);
            if (Subscribe) {
                await setDoc(docRef, {
                    AccessKey,
                })
            }

            const res = await fetch(`http://${server}/r/add-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cors": "no-cors",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    username: auth.currentUser?.displayName,
                    userId: auth.currentUser?.uid,
                    AccessKey,
                    Email: auth.currentUser?.email,
                })
            })
            let resdata = await res.json();
            console.log(resdata)
            if(resdata.message == "User is banned from this room" || resdata.message == "Room not found") { setData(null); return} ;
            setData(resdata)
        } catch (e) {
            console.log(e)
        }
    }

    const contentRoutes = [
        {
            path: "/dashboard",
            name: "Perfil",
            icon: <FaAddressCard size={20} />,
            element: <Dashboard data={data} cts={connectToServer} />,
            courseRequired: false
        },
        {
            path: "/chat",
            name: "Chat",
            icon: <FaComment size={20} />,
            element: <Chat data={data} socket={socket} />,
            courseRequired: true,
        },
        {
            path: "/calendar",
            name: "Calendario",
            icon: <FaCalendarAlt size={20} />,
            element: <Calendar data={data} socket={socket} />,
            courseRequired: true
        },
        // {
        //     path: "/drive",
        //     name: "Almacenamiento",
        //     icon: <FaFolder size={20} />,
        //     element: <Calendar data={data} />,
        //     courseRequired: true
        // },
    ]


    const createNoti = (title:string, body:any, cb:any)  => {
        Notification.requestPermission().then(function(permission){console.log(permission)})
        const notification = new Notification(title, {body});
        notification.onclick = cb()

    }

    const handleClickNotification = (noti: any) => { 
        setNotifications((notifications:any) => notifications.filter((notification:any) => noti.message !== notification.message ))
        
    }

    const handleLogOut = async () => {
        await signOut(auth);
        location.reload();
    }

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return isLoading ? <Loader /> : <div className='h-full flex '>
        <div className='hidden'><LightSwitch /></div> 
        <ConfirmModal isOpen={confirmModal} setIsOpen={setConfirmModal} buttonText="Cerrar sesión" title="¿Estas seguro que quiere cerrar sesión?" onAccept={handleLogOut} />
        <Sidebar setConfirmModal={setConfirmModal} routes={contentRoutes} data={data} sidebarOpen={sidebarOpen} socket={socket!} setSidebarOpen={() => setSidebarOpen(!sidebarOpen)} />
        <div className='grid grid-rows-[50px] md:grid-rows-[48px] relative w-full bg-light dark:bg-bg-dark'>
            <TopBar>
                <MenuIcon onClick={() => setSidebarOpen(!sidebarOpen)} open={sidebarOpen} className="md:hidden -mt-2" />
                <div className='w-full h-full flex items-center justify-end mx-5 gap-5 relative'>

                    <Menu as={Fragment}>
                        <Menu.Button className="relative cursor-pointer drop-shadow">
                            {notifications.length > 0 && <span className='w-2 h-2 rounded-full absolute top-0 right-0 translate-x-[1px] -translate-y-[1px] bg-red-500' />}
                            <BsBellFill color='white' size={20} />
                        </Menu.Button>

                        <Menu.Items className={"absolute right-12 top-10 mt-1 p-2 origin-top-right divide-y text-blue-dark divide-gray-100 bg-white shadow-lg rounded rounded-tr-none ring-black ring-opacity-5 focus:outline-none cursor-pointer z-20"}>
                        {notifications.length == 0 && <span className='text-gray-300 italic text-xs'>No tienes ninguna notificación</span>}
                            {notifications.map((notification: any, index: number) => {
                                return <Menu.Item>
                                    {({ active }) => (
                                        <Link onClick={() => handleClickNotification(notification)} to={notification.message.includes("📅") ? '/calendar' : "/chat"} className={`${active ? "bg-blue-light" : ""} px-2 font-mono whitespace-nowrap rounded block  p-1 gap-5`}>
                                            {parse(notification.message)}
                                        </Link>
                                    )}
                                </Menu.Item>
                            }) 
                            }
                        </Menu.Items>
                    </Menu>

                    <ProfilePic className='drop-shadow' size={33} />
                </div>
                {/* <div>{auth.currentUser?.displayName}</div>
                        <ProfilePic size={35} /> */}

            </TopBar>
            <Content routes={contentRoutes} data={data}/>
        </div>
    </div>
}