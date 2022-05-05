import { useEffect, useState } from 'react';

import Sidebar from "../components/sidebar"
import Content from "../components/Content";
import Dashboard from '../components/dashboard';
import Chat from '../components/Chat';
import Calendar from '../components/Calendar';
import { auth } from "../firebase"
import { FaAddressCard, FaCalendarAlt, FaComment } from 'react-icons/fa';
import TopBar from '../components/TopBar';
import ProfilePic from '../components/ProfilePic';
import LightSwitch from '../components/LightSwitch';

const connectToServer = async (id:string, server?:string) => {
    try{

        const res = await fetch("http://127.0.0.1:3001/users-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cors": "no-cors",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userName: auth.currentUser?.displayName,
                userId: auth.currentUser?.uid,
                id, 
            })
        })
        let resdata = await res.json();
        // if(data == null && resdata ) setData(resdata);
    }catch(e){
        console.log(e)
    }
}



export default function Main() {
const [data , setData] = useState(null);

const contentRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: <FaAddressCard />,
        element: <Dashboard data={data} cts={connectToServer} />,
        courseRequired: false
    },
    {
        path: "/chat",
        name: "Chat",
        icon: <FaComment />,
        element: <Chat data={data} />,
        courseRequired: true,
    },
    {
        path: "/calendar",
        name: "Calendar",
        icon: <FaCalendarAlt />,
        element: <Calendar data={data} />,
        courseRequired: true
    },
    {
        path: "/drive",
        name: "Drive",
        icon: <FaCalendarAlt />,
        element: <Calendar data={data} />,
        courseRequired: true
    },
]

    const handleData = (info: any) => setData(info);
    let onCourse = data != undefined;


    return <div className='h-full flex '>
            <Sidebar onCourse={onCourse} routes={contentRoutes}/>
            <div className='grid grid-rows-[48px] relative w-full bg-bg-light dark:bg-bg-dark '>
                <TopBar>
                    <LightSwitch/>
                    <div>Ra1NuX</div>
                    <ProfilePic size={35} />
                    
                </TopBar>
                <Content handleData={handleData} routes={contentRoutes}/> 
            </div>
        </div> 
}