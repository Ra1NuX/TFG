
import { useEffect, useRef, useState } from "react"
import { auth, storage } from "../firebase"
import Message from "./Message"
import { getDownloadURL, ref } from "firebase/storage"
import Loader from "./Loader"

interface MessageListProps {
    messages: any
    data: any
    deleteMessage: (id: string) => void
}

export default function MessageList({ messages, data, deleteMessage }: MessageListProps) {

    const ref2 = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getInfo().then( () => setTimeout(() => {
            setIsLoading(false)
        },300))

    }, [messages])

    useEffect(() => {
        if (!ref2.current) return
        ref2.current.scrollTop = ref2.current.scrollHeight - ref2.current.clientHeight; // scroll to bottom of the list
    })

    const [clock, setClock] = useState(Date.now())

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setClock(Date.now())
        }, 60000)
        return () => {
            clearInterval(interval)
        }
    }, [clock])

    const getPhoto = async (id: string) => {
        let url:string;
            const imgRef = ref(storage, `profilePics/${id}-profile-pic.jpg`)
            url = await getDownloadURL(imgRef); // get the url of the photo
            return url
    }

    const getInfo = async () => {
        const res = await fetch('http://localhost:4400/r/users/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Cors': 'no-cors',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({roomId: data._id})
        })
        const resdata = await res.json()
        resdata.forEach(async (user: any) => {
            const photo = await getPhoto(user.FirebaseRef)
            if(localStorage.getItem(user.FirebaseRef)) return
            localStorage.setItem(user.FirebaseRef, JSON.stringify({photo, color: Math.floor(Math.random()*16777215).toString(16)}))

        })
        
    }

    return (
        <div ref={ref2} className="overflow-auto h-full" id="chat">
            { isLoading ? <Loader/> :
            messages.map((message: any, index: number) =>{
                console.log(message)
                return <Message key={index} deleteMessage={deleteMessage} deleteAt={message.DeletedAt} messageId={message._id} date={message.SendAt} id={message.FirebaseRef} Username={message.SendBy?.Username ? message.SendBy.Username : message.UserName} >{message.Content}</Message>
            })
    }
        </div>
    )

}
