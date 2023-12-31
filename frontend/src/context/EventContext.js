import { createContext, useReducer } from 'react'

//This context is used to keep home page updated with current database
export const EventsContext = createContext()

export const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { 
        events: action.payload 
      }
    case 'CREATE_EVENT':
      return { 
        events: [action.payload, ...state.events] 
      }
    default:
      return state
  }
}

export const EventsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, { 
    events: null
  })
  
  return (
    <EventsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </EventsContext.Provider>
  )
}