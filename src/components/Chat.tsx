
import { useEffect, useRef, useState } from "react"
import { BsArrowReturnRight } from "react-icons/bs"
import io, { Socket } from 'socket.io-client'
import { auth } from '../firebase'
import Loader from "./Loader"
import MessageList from "./MessageList"
import { useThrottleFn } from "ahooks"
import bg from "../images/bg.jpg"


let refs: any = {}

export default function Chat({ data, socket, setSocket }: any) {


    const [messages, setMessages] = useState<any>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [room, setRoom] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<any>(null)
    const [Loading, setLoading] = useState<boolean>(true)
    const [typing, setTyping] = useState<string | null>(null)
    const [lastMessages, setLastMessages] = useState<any>(null)



    function useForceUpdate(msg: any,) {
        setMessages((msgs: any) => msgs.map((message: any) => message._id === msg._id ? message = msg : message))
    }

    const checkTheSubjects = async () => {
        if (subjects) return
        const res = await fetch(`http://127.0.0.1:4400/r/subjects/${data._id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Cors': 'no-cors',
                'Access-Control-Allow-Origin': '*'
            }
        })
        const resdata = await res.json()

        if (resdata.length > 0) {
            setSubjects(resdata)
        }
    }



    useEffect(() => {

        checkTheSubjects().then(
            () => {
                setLoading(false)
            }
        )

    }, [])


    useEffect(() => {

        const addMessage = (msg: any, subject: string) => subject == room ?
            setMessages((prevMessages: any) => [...prevMessages, msg.message])
            :
            refs[subject].lastChild.classList.contains('hidden') && refs[subject].lastChild.classList.remove("hidden")

        const handlerTyping = (user: string, userId: string, troom: string) => {
            if (userId === auth!.currentUser?.uid || room !== troom) return
            setTyping(user)
            setTimeout(() => {
                setTyping(null)
            }
                , 2000)
        }

        socket.on('messageSended', addMessage);
        socket.on('deleteMessage', useForceUpdate);
        socket.on('typing-server', handlerTyping)
        return () => {
            socket.off('messageSended', addMessage)
            socket.off('deleteMessage', useForceUpdate)
            socket.off('typing-server', handlerTyping)
        }

    }, [socket, room, refs])

    const { run } = useThrottleFn((e: any) => {
        if (e.target.value.length > 0) {
            socket?.emit('typing', { username: auth.currentUser?.displayName, userId: auth.currentUser?.uid, connectedAt: Date.now(), room: room })
        }
    })

    const handlerMessage = () => {
        if (!socket) return
        if (!inputRef.current?.value.trim().normalize()) return
        socket.emit('message', { message: inputRef.current?.value.trim().normalize(), date: Date.now(), FirebaseRef: auth.currentUser?.uid, roomId: data._id }, room)
        inputRef.current.value = ""
    }

    const handleChangeOfRoom = async (subject: any) => {
        if (subject !== room) setRoom(subject)
        if (!refs[subject].lastChild.classList.contains('hidden')) refs[subject].lastChild.classList.add("hidden")
        const messagesOfRoom = await fetch(`http://localhost:4400/m/get-messages/${subject}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Cors': 'no-cors',
                'Access-Control-Allow-Origin': '*'
            }
        })
        const messagesOfRoomData = await messagesOfRoom.json()
        setMessages(messagesOfRoomData.messages)
    }

    const deleteMessage = async (messageId: string) => {
        socket?.emit('deleteMessage', { messageId, roomId: room })
    }

    const getTheElement = (subjectId: string): any => {
        let target;
        subjects.forEach((element: any) => {
            if (element._id === subjectId) {
                target = element
            }
        });
        return target ? target : null
    }

    const getLastMessage = async (subId: string) => {
        const res = await fetch(`http://localhost:4400/m/get-first-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cors': 'no-cors',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ subject: subId, room: data._id })
        })
        const resData = await res.json()


        setLastMessages((currentMessages:any) => ({ ...currentMessages, [subId]: resData.message }))

    }

    useEffect(() => {
        data.Subjects.forEach((subject: any) => {
            getLastMessage(subject)
        })
    }, [])

    return (Loading || !lastMessages) ? <Loader /> : (
        <div className="flex h-full w-full relative">
            <div className="w-72 flex flex-col h-full divide-y" id="subjectInChat">
                {data.Subjects.map((subject: any, i: number) => {
                    return <button key={i} ref={ref => refs[subject] = ref} id={subject} className={`${subject === room ? "bg-blue-100/50 dark:bg-gray-700 rounded-l" : ""} ml-2 py-2 relative border-0 px-4 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 `} onClick={() => handleChangeOfRoom(subject)}>
                        <div className="text-left">{getTheElement(subject).Name}</div>
                        <div className={`text-gray-500 text-xs my-2 mx-5  px-2 border-l  ${subject === room ? "border-l-blue-dark border-l-2" : "border-l-gray-300"} `}>
                        {lastMessages[subject]?.SendBy && <span className="block text-left font-semibold text-base">{lastMessages[subject] && lastMessages[subject].SendBy.FirebaseRef === auth.currentUser?.uid ? "Tu" : lastMessages[subject].SendBy.Username}:</span>}
                            <span className="block text-gray-500 text-left pl-2">{lastMessages[subject] && lastMessages[subject].Content}</span>
                            </div>
                        <div className="hidden">
                            <div className="w-4 h-4 absolute top-0 right-0 translate-x-1/2 rounded-full -translate-y-1/2 bg-red-500/50 animate-pulse"></div>
                            <div className="w-3 h-3 absolute top-0 right-0 translate-x-1/2 rounded-full -translate-y-1/2 bg-red-500 "></div>
                        </div>
                    </button>
                })}
                
            </div>
            <div className="flex flex-col h-full w-full relative m-0 pl-10 bg-blue-100/50 dark:bg-gray-700 p-2" >
                {!room && <div className="h-full rounded inset-0" style={{ backgroundImage: `url(${bg})` }}>
                    <div className="inset-0 bg-blue-mid/80 absolute text-white rounded backdrop-blur-sm">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">Bienvenido/a al chat de tu clase.</span>
                    </div>
                </div>}
                {Array.isArray(messages) && <>
                    <MessageList messages={messages} data={data} deleteMessage={deleteMessage} />
                    <div className="m-2 mt-4 flex flex-row align-middle shadow-lg relative">
                        {typing && <span className="absolute top-0 left-2 -translate-y-7">{typing} esta escribiendo...</span>}
                        <textarea onChange={run} ref={inputRef} className="w-full resize-none px-2 py-1 text-black rounded-tl rounded-bl text-sm dark:bg-gray-500" rows={2} placeholder="Mensaje...."></textarea>
                        <button type="submit" onClick={() => handlerMessage()} className="px-5 bg-blue-mid text-white font-bold rounded-tr rounded-br">
                            <BsArrowReturnRight />
                        </button>
                    </div>
                </>
                }
            </div>
        </div>
    )
}