import { formatDistanceToNow } from "date-fns/esm"
import { es } from 'date-fns/locale'
import { useEffect, useRef, useState } from "react"
import { BsArrowReturnRight } from "react-icons/bs"
import io, { Socket } from 'socket.io-client'
import { auth } from '../firebase'

import MessageList from "./MessageList"


// const SendedMessage = ({ date, children }) => (
//     <div className="m-4 ml-auto w-11/12 md:w-fit md:max-w-[90%] bg-blue-600 rounded p-5 shadow-lg">
//         <span className="text-sm">
//             <pre className=" text-white whitespace-pre-wrap break-words overflow-auto leading-4 text-sm font-[Calibri]">
//                 {children}
//             </pre>
//             <p className="text-right text-xs italic text-[#eaeaea]">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
//         </span>
//     </div>
// )

// const RecivedMessage = ({ date, name, children }) => (
//     <div className="m-4 mr-auto w-11/12 md:w-fit md:max-w-[90%]  white dark:dark  rounded p-2 pt-1 shadow-lg">
//         <span className="font-bold text-pink-500">{name}:</span>
//         <span className="text-sm  text-[#0a1254]">
//             <pre className="whitespace-pre-wrap break-words overflow-auto leading-4 text-sm font-[Calibri]">
//                 {children}
//             </pre>
//             <p className="text-right text-xs italic text-gray-400">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
//         </span>
//     </div>
// )



export default function Chat({ courses }: any) {
    // let inputRef = useRef<HTMLTextAreaElement>(null)

    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<any>([])
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // const messageListener = (data: any) => {
    //     console.log('Acabo de recibir un mensaje', data.message, 'y esto es mi array:', messages)
    //     setMessages([...messages, { key: uuidv4(), date: data.date, name: data.username, message: data.message }])
    //     console.log('hlavni socket', messages)
    // }

    // useEffect(() => {
    //     const sock = io('http://localhost:4400')
    //     setSocket(sock)
    // }, [])

    // useEffect(() => {
    //     if(!socket) return
    //     console.log('mi socket es: ', socket)
    //     socket.emit('register', { username: auth.currentUser?.displayName, userId: auth.currentUser?.uid, connectedAt: Date.now() })
    //     socket.on('server-message', data => messageListener(data))
    // }, [socket])



    // const sendMessage = () => {
    //     if (!socket) return
    //     const changedState = [...messages,{key: uuidv4(), date: Date.now(), message: text, self }]
    //     console.log(changedState)
    //     setMessages(changedState)
    //     socket.emit('message', {
    //         message: text,
    //         date: Date.now(),
    //         username: auth.currentUser?.displayName,
    //     })
    //     console.log('acabo de enviar un mensaje', messages)
    //     setText('')
    // }

    useEffect(() => {
        if (!socket) {
            const sock = io('http://localhost:4400');
            setSocket(sock)
        } else {
            socket.emit('register', { username: auth.currentUser?.displayName, userId: auth.currentUser?.uid, connectedAt: Date.now()})
            const addMessage = (msg:any) => setMessages((prevMessages: any) =>  [...prevMessages, msg]);
            socket.on('messageSended', addMessage);
            () => {
                socket.off('messageSended', addMessage)
            }
        }
    }, [socket])

    const handlerMessage = () => {
        if (!socket) return
        if(!inputRef.current?.value) return
        socket.emit('message', { message: inputRef.current?.value, date: Date.now(), username: auth.currentUser?.displayName, userId: auth.currentUser?.uid }) 
        inputRef.current.value = ""
    }


    return (
        <div className="flex flex-col h-full relative card m-0 ml-2 !bg-[#eaeaea4f] p-2" >
            <MessageList messages={messages} />
            <div className="m-2 mt-4 flex flex-row align-middle shadow-lg">
                <textarea ref={inputRef} className="w-full resize-none px-2 py-1 text-black rounded-tl rounded-bl text-sm" rows={2} placeholder="Mensaje...."></textarea>
                <button type="submit" onClick={() => handlerMessage()} className="px-5 bg-blue-500 text-white font-bold rounded-tr rounded-br">
                    <BsArrowReturnRight />
                </button>
            </div>
        </div>
    )
}