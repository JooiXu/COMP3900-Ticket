import { EventsContext } from '../context/EventContext'
import { useContext } from 'react'

//we are using the context we made
//to keep the homepage updated without reloading
export const useEventContext = () => {
  const context = useContext(EventsContext)

  if(!context) {
    throw Error('useEventsContext needs a context')
  }

  return context
}