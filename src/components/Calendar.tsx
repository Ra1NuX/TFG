import { auth } from "../firebase"

import { FC, Fragment, useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer, Event, CalendarProps } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import Input from "./Input"
import ConfirmModal from "./ConfirmModal"
import { Form, Formik } from "formik"
import Loader from "./Loader"

import * as yup from 'yup'
import { Menu } from "@headlessui/react"
import { BsFillPencilFill, BsThreeDotsVertical, BsTrashFill } from "react-icons/bs"
import Card from "./Card"
import { io } from "socket.io-client"

//crea un array de colores de fondo para un texto blanco
const COLORS: any = {}


const Calendar_ = ({ data, socket, ...props }: any) => {


  const [open, setOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [items, setItems] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const checkTheSubjects = async () => {
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
      return resdata
    }
  }

  useEffect(() => {
    const newItems: any = [];
    checkTheSubjects().then(
      (val) => {
        val.forEach((subject: any) => {
          if (!COLORS.hasOwnProperty(subject.Name)) {
            COLORS[subject.Name] = getRandomColor()
          }
          newItems.push({ name: subject.Name, color: COLORS[subject.Name], subjectId: subject._id })
        })
        setItems(newItems)
        setIsLoading(false)
      })
  }, [])


  const messages = {
    allDay: 'Todo el dia',
    previous: '<',
    next: '>',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Diario',
    work_week: 'Semana laboral',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    showMore: (total: any) => `Ver ${total} mas `,
    noEventsInRange: 'No hay eventos en este rango'
  }

  const [events, setEvents] = useState<any>([])

  const getEvents = async () => {
    const res = await fetch(`http://localhost:4400/e/${data._id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Cors': 'no-cors',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const datas = await res.json()
    return datas
  }

  
  const updateEvents = (msg?:any, FirebaseRef?:string) => {
    if(FirebaseRef != undefined && FirebaseRef != auth.currentUser?.uid ) return
    getEvents().then(async (events: any) => {
      const newEvents: any = []
      const subjects = await checkTheSubjects()

      events.forEach((event: any) => {
        const subject = subjects.filter((subject: any) => subject._id == event.Subject)[0]

        newEvents.push({
          title: event.Title,
          start: new Date(event.EventDate),
          end: new Date(event.EventDate),
          subject: { name: subject.Name, color: COLORS[subject.Name], subjectId: subject._id },
          content: event.Content,
          _id: event._id
        })
      })
      setEvents(newEvents)
    })

  }

  useEffect(() => {
    socket.on('event-change-server', updateEvents)
    return () => { socket.off('event-change-server', updateEvents) }
  }, [])


  useEffect(() => {
    updateEvents()
  }, [])


  const updateEventOnDb = async (event: any) => {
    const res = await fetch(`http://localhost:4400/e/update-Event/${event._id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Cors': 'no-cors',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        title: event.title,
        date: event.start,
        content: event.content,
        subject: event.subject.subjectId
      })
    })
    const resdata = await res.json()
    return resdata
  }

  const onChange = (event: any) => {

    const newEvent = {
      title: event.title,
      start: new Date(event.date),
      end: new Date(event.date),
      content: event.content!,
      subject: event.subject!,
      _id: selectedEvent._id
    }

    const lastEvent = {
      ...selectedEvent,
    }

    updateEventOnDb({ ...event, _id: selectedEvent._id })

    setEvents((currentEvents: any) => {
      const Events = [...currentEvents]

      for (let i in Events) {
        if ((Events[i]._id == lastEvent._id)) {
          Events[i] = newEvent
        }
      }
      return Events
    })
    setOpen(false)
    socket.emit('event-change', data._id, auth.currentUser?.uid, newEvent)
  }

  const onEventDrop = (data_: { start: string, end: string, event: { start: Date, end: Date, _id: string, title: string, content: string, subject: { name: string, color: string } } }) => {

    const { start, end, event } = data_

    const newEvent = {
      start: new Date(start),
      end: new Date(start),
      title: event.title,
      content: event.content!,
      subject: event.subject!,
      _id: event._id
    }

    const lastEvent = {
      ...event,
    }

    updateEventOnDb(newEvent)

    setEvents((currentEvents: any) => {
      const Events = [...currentEvents]
      for (let i in Events) {
        if ((Events[i].start == lastEvent.start) && (Events[i].end == lastEvent.end) && (Events[i].title == lastEvent.title)) {
          Events[i] = newEvent
        }
      }

      return Events
    })
    socket.emit('event-change', data._id, auth.currentUser?.uid, newEvent)
  }

  const deleteEventInDb = async (event: any) => {
    const res = await fetch(`http://localhost:4400/e/delete-Event/${event._id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Cors': 'no-cors',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const resdata = await res.json()
    return resdata
  }

  const handleDeleteEvent = (event: any) => {
    deleteEventInDb(event)
    setEvents((currentEvents: any) => {
      return currentEvents.filter((item: any) => item._id !== event._id)
    })
    setOpen(false)
    socket.emit('event-change', data._id, auth.currentUser?.uid, event)
  }


  const addNewEvent = async (event: any) => {

    const { date, title, content, subject } = event

    const newEvent = {
      start: new Date(date),
      end: new Date(date),
      title,
      content,
      subject,
    }

    const dbEvent = await addToDb(event);
    setEvents((currentEvents: any) => {
      return [...currentEvents, { ...newEvent, _id: dbEvent.event._id }]
    })
    setOpen(false)
    socket.emit('event-change', data._id, auth.currentUser?.uid, newEvent)
  }

  const onSelectSlot = (slotInfo: any) => {
    setSelectedEvent(slotInfo)
    setOpen(true)
  }
  const onSelectEvent = (event: any) => {
    setSelectedEvent(event)
    setOpen(true)
  }




  const addToDb = async (event: any) => {
    const { date, title, content, subject } = event

    const response = await fetch('http://localhost:4400/e/add-event', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Cors': 'no-cors',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        date: new Date(date),
        title,
        content,
        subject,
        roomId: data._id,
        FirebaseRef: auth.currentUser!.uid
      })
    })

    const eventInDatabase = await response.json()
    return eventInDatabase
  }

  const cell = (item: any) => {
    return (
      <>
        <div className="mb-1 gap-2 flex items-center relative">

          <span className="font-bold text-[12px] px-2 py-1 rounded-full" style={{ backgroundColor: item.event.subject.color + "5f" }}>

            {item.event.subject.name}
          </span> <span className="text-2xl leading-none">{item.title}</span>
        </div>
        <div className="border-t border-gray-300 pl-7 pt-2 pb-1 italic text-xs">{item.event.content}</div>
      </>
    )
  }

  const dateCell = (item: any) => {
    return (
      <div className="m-auto ">
        {item.label}
      </div>
    )
  }

  const monthCell = (item: any) => {
    return (
      <div className=" flex flex-col relative">

        <div className="gap-2 flex items-center ">
          <span className="font-bold text-[12px] px-2 py-1 rounded-full" style={{ backgroundColor: item.event.subject.color + "5f" }}>
            {item.event.subject.name.substring(0, 3)}
          </span>
          <span className="text-md truncate">{item.title}</span>
        </div>

      </div>
    )
  }



  const initialValues = { title: selectedEvent?.title ? selectedEvent?.title : "", content: selectedEvent?.content ? selectedEvent?.content : "", date: selectedEvent?.start ? selectedEvent?.start : "", subject: selectedEvent?.subject ? selectedEvent?.subject : "" }

  const addSchema = yup.object().shape({
    title: yup.string().required("El titulo no puede estar en blanco"),
    content: yup.string().required("El contenido no puede estar en blanco"),
    date: yup.string().nullable().required("La fecha no puede estar en blanco"),
    subject: yup.object().required("La asignatura no puede estar en blanco"),

  });


  return isLoading ? <Loader /> : <div id="calendar">
    <ConfirmModal isOpen={open} setIsOpen={setOpen} title={!initialValues.title ? "Agregar un nuevo Evento" : "Editar un evento"} description={
      <div>
        <Formik initialValues={initialValues} onSubmit={!initialValues.title ? addNewEvent : onChange} validationSchema={addSchema}>
          {formik => {
            return <Form>
              <Input label="Titulo" name="title" />
              <Input.TextArea name="content" />
              <Input.Date name="date" />
              <Input.DropDown items={items} name="subject" label="Elige una asignatura" />
              <button type="submit" className="bg-blue-mid rounded p-2 text-white mt-3 w-full">{initialValues.title ? "Editar" : "Enviar"}</button>
              {initialValues.title && <button type="button" onClick={() => {handleDeleteEvent(selectedEvent)}}>Eliminar</button>}
            </Form>
          }}
        </Formik>
      </div>
    }/>
    <Card>
      <div className="flex flex-row gap-2 overflow-auto">
        {items.map((subject: { name: string, color: string }, i: number) => {
          return <Fragment key={i}>
            <div className="rounded px-2 flex flex-row items-center gap-2" style={{ backgroundColor: subject.color + "2f" }}>
              <div className="rounded-full w-2 h-2" style={{ backgroundColor: subject.color }} /><span>{subject.name}</span>
            </div>
          </Fragment>
        })}
      </div>
      <DnDCalendar
        messages={messages}
        culture="es"
        defaultView='month'
        views={['work_week', 'month', "agenda"]}
        events={events}
        localizer={localizer}
        onEventDrop={(e: any) => onEventDrop(e)}
        resizable={false}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        style={{ height: '80vh', margin: '10px', marginLeft: '5px' }}
        popup={true}
        eventPropGetter={(event: any, start: any, end: any, isSelected: any) => {
          return {
            className: "bg-blue-mid text-white rounded px-2 py-1 overflow-auto",
            style: {
              backgroundColor: event.subject.color + "2f",
              color: 'black',
              borderColor: event.subject.color,
              borderWidth: isSelected ? '1px' : '0px',
              borderStyle: 'solid',
            },
          }
        }}
        components={{
          agenda: {
            event: cell,
            date: dateCell,
          },
          month: {
            event: monthCell,
          },

        }}

      />
</Card>
  </div>

}

const locales = {
  'es': es,
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)

// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

export default Calendar_