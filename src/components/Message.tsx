import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useState } from "react"

import { auth, storage } from '../firebase'

import { getDownloadURL, ref, } from "firebase/storage";
import ProfilePic from "./ProfilePic";
import { BsFillPencilFill, BsFillReplyFill, BsThreeDotsVertical, BsTrash, BsTrashFill } from "react-icons/bs";

import { Menu } from '@headlessui/react'
import ConfirmModal from "./ConfirmModal";



interface MessageProps {
    children: string,
    date: Date,
    Username: string,
    id: string
    messageId: string,
    deleteAt: Date | null,
    deleteMessage: (id: string) => void
}



export default function Message({ children, date, Username, id, messageId, deleteAt, deleteMessage }: MessageProps) {

    const [isOpen, setIsOpen] = useState(false)

    

    return (
        
        id === auth.currentUser?.uid ?
            deleteAt ?
                <div className="m-4 ml-auto w-11/12 md:w-fit md:max-w-[90%] min-w-[150px] bg-blue-mid p-2 shadow-lg rounded-lg rounded-tr-none relative group">
                    <pre className="text-white whitespace-pre-wrap break-words leading-4 text-sm font-[Calibri] overflow-hidden italic">
                        Este mensaje se ha eliminado
                    </pre>
                </div> :
                <div className="m-4 ml-auto w-11/12 md:w-fit md:max-w-[90%] min-w-[150px] bg-blue-mid p-2 shadow-lg rounded-lg rounded-tr-none relative group">
                    <ConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} onAccept={() => deleteMessage(messageId)} title="¿Está seguro?" description="Está a punto de eliminar un mensaje, esta acción es irreversible" buttonText="Eliminar"/>
                    <Menu>
                        <Menu.Button className="group-hover:block absolute top-0 right-0 hidden translate-y-1/2 -translate-x-1/2 text-white cursor-pointer"><BsThreeDotsVertical /></Menu.Button>
                        <Menu.Items className={"absolute right-3 mr-3 mt-1 p-2 origin-top-right divide-y text-blue-dark divide-gray-100 bg-white shadow-lg rounded rounded-tr-none ring-black ring-opacity-5 focus:outline-none cursor-pointer z-20"}>

                            <Menu.Item>
                                {({ active }) => (
                                    <a onClick={() => setIsOpen(true)} className={`${active ? "bg-blue-light":""} px-2 font-mono whitespace-nowrap rounded flex justify-between items-center p-1 gap-5`}>
                                        <>
                                        Borrar <BsTrashFill className="inline-block" /> 
                                        
                                        </>
                                    </a>
                                )
                                }
                            </Menu.Item>
                            {/* <Menu.Item>
                                {({ active }) => (<a className={`${active ? "bg-blue-light":""} px-2 font-mono whitespace-nowrap rounded flex justify-between items-center p-1 gap-5`}> Editar <BsFillPencilFill className="inline" /></a>)}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (<a className={`${active ? "bg-blue-light":""} px-2 font-mono whitespace-nowrap rounded flex justify-between items-center p-1 gap-5`}> Responder <BsFillReplyFill className="inline" /></a>)}
                            </Menu.Item> */}
                        </Menu.Items>
                    </Menu>
                    <span className="text-sm">

                        <pre className="text-white whitespace-pre-wrap break-words leading-4 text-sm font-[Calibri] overflow-hidden mr-6">
                            {children}
                        </pre>
                        <p className="text-right relative -bottom-2 text-[9px] italic text-[#eaeaea]">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
                    </span>
                </div>
            :
            <div className="flex">
                <ProfilePic size={50} url={(localStorage.getItem(id)) && JSON.parse(localStorage.getItem(id)!).photo} username={Username} self={false} />
                <div className="m-4 w-11/12 md:w-fit md:max-w-[90%] min-w-[150px] rounded-lg rounded-tl-none dark:dark white p-2 pt-1 shadow-lg relative mr-2 -left-3">
                    <span className="font-semibold -translate-y-[16px] absolute" style={{ color: "#" + ((localStorage.getItem(id)) && JSON.parse(localStorage.getItem(id)!).color) }}>{Username}:</span>
                    <span className="text-sm dark:text-white text-blue-dark ">
                        {deleteAt ?
                            <pre className="mt-3 whitespace-pre-wrap break-words leading-4 text-sm font-[Calibri] overflow-hidden italic text-gray-400">
                                Este mensaje se ha eliminado
                            </pre>
                            :
                            <>
                                <pre className="mt-3 whitespace-pre-wrap break-words leading-4 text-sm font-[Calibri] overflow-hidden">
                                    {children}
                                </pre>
                                <p className="text-right relative -bottom-2 text-[9px] italic text-gray-400">{formatDistanceToNow(new Date(date), { locale: es, addSuffix: true })}</p>
                            </>
                        }

                    </span>
                </div>
            </div>

    )
}

