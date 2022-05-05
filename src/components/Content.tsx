import { Routes, Route, Navigate } from "react-router"
import React from "react"

interface ContentProps {
    handleData: Function,
    routes: Array<{path:string, element:React.ReactElement, icon?:React.ReactElement|string, courses?:any, cts?: Function }>
}

export default function Content({routes, ...props}:ContentProps) {


    return <div className="p-5 grid-cols-2 overflow-auto">
            <Routes>
                {routes.map((route, index) => (
                <Route key={index} {...route} />
                ))}
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="*" element={<Navigate to="/dashboard"/>} />
            </Routes>
    </div>

}