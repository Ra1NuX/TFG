import { useEffect, useRef, useState } from "react"
import Message from "./message"

interface MessageListProps {
    messages: any
}

export default function MessageList({ messages }: MessageListProps) {

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return
        ref.current.scrollTop = ref.current.scrollHeight - ref.current.clientHeight; // scroll to bottom of the list
    }, [messages])



    const [clock, setClock] = useState(Date.now())
    useEffect(() => {
        const interval = setInterval(() => {
            setClock(Date.now())
        }, 60000)
        return () => {
            clearInterval(interval)
        }
    }, [clock])


    return (
        <div ref={ref} className="overflow-auto h-full" id="chat">
            {messages.map((message: any, index: number) =>
                <Message key={index} date={message.date} id={message.userId} name={message.username} >{message.message}</Message>
            )}
        </div>
    )

}
