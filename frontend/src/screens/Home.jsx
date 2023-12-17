import React, { useState } from "react"
import {useEffect } from 'react'
import { useEventContext } from '../hooks/useEventContext'
import EventCard from "../components/EventCard";
import NavBar from "../components/NavBar";
import { TextField } from "@material-ui/core";

import { useUser } from "../context/UserContext";


import './Home.css'

function Home() {

    const {events, dispatch} = useEventContext()
    const [inputEvent, setInputEvent] = useState("")
    const [toggle, setToggle] = useState(true)

    const [types, setTypes] = useState([])

    const { user } = useUser()

    const filterData = (events) => {
      return events.filter((item) => {
        const tle = item.title.toLowerCase()
        const descr = item.description.toLowerCase()
        if (tle.includes(inputEvent.toLowerCase()) || descr.includes(inputEvent.toLowerCase())) {
          return item
        }
      });
    }

    const getTypes = () => {
      const event_ids = JSON.parse(user).user.attend

      event_ids.forEach(async (element) => {
        const response = await fetch(`/api/events/${element}`)
        const json = await response.json()

        if(response.ok) {
          setTypes(types=> [...types, json.type])
        } else {
          setTypes([])
        }
    })
    }

    const recommendEvent = (events) => {
      return events.filter((item) => {
        if (types.includes(item.type)) {
          return item
        }
      });
    }

    useEffect(() => {
      const fetchEvents= async () => {
        const response = await fetch('/api/events')
        const json = await response.json()

        if(response.ok) {
          dispatch({type: 'SET_EVENTS', payload: json})
        }
      }
      fetchEvents()
      if (user) {getTypes()}
    }, [ dispatch])

    return (
        <>
            <div style={{ background: "#F5F6F6", minHeight:'100vh' }}>
              <NavBar />
              <div style={{ paddingTop:"5%", fontFamily:"Poppins", fontSize: "100px"}}>Lasagna Bookings</div>
              <div style={{ alignSelf:'center' }}>Browse all the latest events</div>
              <div style={{ marginTop:'3%' }}>
              <TextField variant="outlined" label="Search for an event" style={{ width: '60%' }} onChange={(e) => setInputEvent(e.target.value)}/>
              </div>
              <div style={{ display:"flex", width:"20%", paddingTop:"5%", paddingLeft:"5%", justifyContent:'space-between' }}>
                <span style = {{ cursor: "pointer", fontWeight:"bold", fontSize:"1.5rem", fontFamily:"Poppins"}} onClick={() => setToggle(true)}>All</span>
                <span style = {{ cursor: "pointer",fontWeight:"bold", fontSize:"1.5rem", fontFamily:"Poppins"}} onClick={() => setToggle(false)}>Recommended</span>
              </div>
              {toggle ? 
              (<div style={{ display: "flex", flexWrap:"wrap",  justifyItems:"center", padding: "2%"}}>
                {events && filterData(events).map((event) => (
                  <EventCard key={event._id} event={event} eventSrc="" broadcast={false}/>
                ))}
              </div>)
              : (
                <div style={{ display: "flex", flexWrap:"wrap",  justifyItems:"center", padding: "2%"}}>
                {user ? (events && recommendEvent(events).map((event) => (
                  <EventCard key={event._id} event={event} eventSrc="" broadcast={false}/>
                ))) : (<div style={{ position:"relative", marginLeft:'35%', fontFamily:"Poppins", fontSize:"200%"}}>Login to see recommended events</div>)}
              </div>)
              }
            </div>
        </>
    );
}

export default Home;