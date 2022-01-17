import { Routes, Route, Navigate } from "react-router"
import { useEffect, useState } from "react"
import Dashboard from "./dashboard"
import Chat from "./Chat"
import Calendar from "./Calendar"
import { auth } from "../firebase"

export default function Content({...props}) {
    const {size} = props 

    const [data , setData] = useState(null);

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
            if(data == null && resdata ) setData(resdata);
        }catch(e){
            console.log(e)
        }
    }

    return <div style={{marginLeft: size+10 }}>
            <Routes>
                <Route path="/chat" element={<Chat courses={data}/>}/>
                <Route path="/dashboard" element={<Dashboard data={data} cts={connectToServer}/>} />
                <Route path="/calendar" element={<Calendar courses={data}/>}/>
                <Route path="/drive" element={<Calendar />}/>
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="*" element={<div>Esto es un error</div>} />
            </Routes>
    </div>

}