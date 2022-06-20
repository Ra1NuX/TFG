import { useEffect, useState } from "react"
import Card from "./Card"

export default function Clock() {
    const Today = new Date()
    const [date, setDate] = useState(Today.getTime())

    useEffect(() => {
        setInterval(() => {
            const Today = new Date()
            setDate(Today.getTime())
        }, 1000)
    }, [])

    const now = new Date(date)

    const minutes = now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`
    const hours = now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`
    const seconds = now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`
    return <div className="m-2 mb-0 flex justify-between">
        <Card><span className="">{now.toLocaleString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span></Card>
        <Card className="flex justify-center items-center"><span className="text-xl font-semibold w-20">{hours}:{minutes}:{seconds}</span></Card>
    </div>

}