import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect } from "react"

import {auth} from '../firebase'

interface MessageProps {
    children: string,
    date: Date,
    name: string,
    id: string
}

export default function Message({ children, date, name, id }: MessageProps) {
    return (
        id === auth.currentUser?.uid ?
            <div className="m-4 ml-auto w-11/12 md:w-fit md:max-w-[90%] bg-blue-600 rounded p-5 shadow-lg">
                <span className="text-sm">
                    <pre className=" text-white whitespace-pre-wrap break-words overflow-auto leading-4 text-sm font-[Calibri]">
                        {children}
                    </pre>
                    <p className="text-right text-xs italic text-[#eaeaea]">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
                </span>
            </div>
            :
            <div className="m-4 mr-auto w-11/12 md:w-fit md:max-w-[90%] rounded dark:dark white p-2 pt-1 shadow-lg">
                <span className="font-bold text-pink-500">{name}:</span>
                <span className="text-sm dark:text-white text-[#0a1254]">
                    <pre className="whitespace-pre-wrap break-words overflow-auto leading-4 text-sm font-[Calibri]">
                        {children}
                    </pre>
                    <p className="text-right text-xs italic text-gray-400">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
                </span>
            </div>
    )
}

