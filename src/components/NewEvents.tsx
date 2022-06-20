import { useEffect, useState } from "react"
import Card from "./Card"
import Loader from "./Loader"

export interface RootObject {
    _id: string;
    CreatedBy: string;
    CreatedRoom: string;
    Subject: string;
    Title: string;
    Content: string;
    EventDate: Date;
    DeletedAt?: any;
    LastEdittedAt?: any;
    LastEdittedBy?: any;
    CreatedAt: Date;
    __v: number;
}

const formatWithFirstLetterUpperCase = (str: string) => str.replace(/^.{1}/g, str[0].toUpperCase());

export default function NewEvents({ ...props }) {

    const { data } = props

    const [events, setEvents] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getEvents = async () => {
        if (!data) return
        const events = await fetch(`http://localhost:4400/e/from-today/${data._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cors": "no-cors", 'Access-Control-Allow-Origin': '*'

            }
        })
        const eventsJson = await events.json()
        return eventsJson
    }

    useEffect(() => {
        getEvents().then(events => {
            setEvents(events)
            setIsLoading(false)
        })
    }
        , [data])

    return isLoading ? <Loader /> : 
    <>
    <h2 className="text-2xl m-2 pl-4 w-full border-b border-gray-200">Proximos Eventos</h2>
    <div className="grid grid-cols-1 gap-2 xl:grid-cols-3" >

        {events?.map((element: RootObject) => {
            const { EventDate, Title, Content } = element
            const date = new Date(EventDate)
            return <div>
                
                <Card className="relative flex flex-col h-[92%] justify-between divide-y">
                    <div>
                        <span className="text-xl font-bold block max-w-[70%]">{Title}</span>
                        <span className="italic text-xs">{Content}</span>
                    </div>
                    <div className="flex flex-col justify-center dark:bg-gray-700 py-2 items-center bg-blue-light rounded">
                        <span className="block font-bold">{date.toLocaleString('es-ES', {day: "numeric"}) +" "+ formatWithFirstLetterUpperCase(date.toLocaleString('es-ES',{ month: "short"} ))}</span>
                        <span className="text-xs italic max-w-[70%] m-auto text-center">{date.toLocaleString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                </Card>
            </div>
        })}
    </div>
    </>

}
