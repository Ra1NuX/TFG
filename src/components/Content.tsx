import { Routes, Route, Navigate } from "react-router"
import React from "react"
import Config from "../routes/Config"
import CookiesPage from "../routes/CookiesPage"
import Policy from "../routes/Policy"

interface ContentProps {
    routes: Array<{path:string, element:React.ReactElement, icon?:React.ReactElement|string, courses?:any, cts?: Function }>
    data: any
}

export default function Content({routes, data, ...props}:ContentProps) {


    return <div className="px-5 pb-5 md:!p-5 -mt-1 md:mt-0 grid-cols-2 overflow-auto">
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} {...route} />
                ))}
                <Route path="policy" element={<Policy />}  />
                <Route path="cookies" element={<CookiesPage />}  />
                <Route path="/configuration" element={<Config data={data}/>} />
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="*" element={<Navigate to="/dashboard"/>} />
            </Routes>
    </div>

}