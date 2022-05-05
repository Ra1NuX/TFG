import {auth } from "../firebase"

import { FC, useState } from 'react'
import { Calendar, dateFnsLocalizer, Event, CalendarProps } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const Calendar_ = ({data, ...props}:any) => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Learn cool stuff',
      start,
      end,
    },
  ])

  const onEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { start, end, event } = data

    const newEvent = {
      start: new Date(start),
      end: new Date(end),
      title: event.title,
    }
  
    const lastEvent = {
      ...event,
    }

    setEvents(currentEvents => {
      const Events = [...currentEvents]
      for (let i in Events) {
        if((Events[i].start == lastEvent.start) && (Events[i].end == lastEvent.end) && (Events[i].title == lastEvent.title)){
          Events[i] = newEvent
        } 
      }

      return Events
    })

  }

  const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {

    const { start, end, event } = data

    const newEvent = {
      start: new Date(start),
      end: new Date(end),
      title: event.title,
    }
  
    const lastEvent = {
      ...event,
    }

    setEvents(currentEvents => {
      const Events = [...currentEvents]
      for (let i in Events) {
        if((Events[i].start == lastEvent.start) && (Events[i].end == lastEvent.end) && (Events[i].title == lastEvent.title)){
          Events[i] = newEvent
        } 
      }

      return Events
    })

  }

  return (
    <DnDCalendar
      defaultView='week'
      events={events}
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      style={{ height: '92vh', margin: '10px', marginLeft: '5px' }}
    />
  )
}

const locales = {
  'en-US': enUS,
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