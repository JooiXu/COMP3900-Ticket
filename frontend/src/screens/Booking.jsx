import React from "react";
import  NavBar  from "../components/NavBar";
import { useParams } from "react-router";
import './Profile.css'
import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext";
import EventCard from "../components/EventCard";
import { useHistory } from 'react-router-dom';
import { Button } from "@material-ui/core";

import './Booking.css'

function Booking() {

  const { user } = useUser()
  const usr = JSON.parse(user)
  const history = useHistory()

  const [event, setEvent] = useState('')
  //grab the user email and id
  const u_email = usr["user"].email
  const u_id = usr["user"]._id
  
  const [error, setError] = useState(null)
  const param = useParams()

  //get the event
  const fetchEvent= async () => {
    const response = await fetch(`/api/events/${param.id}`)
    const json = await response.json()

    if(response.ok) {
      setEvent(json)
    }
  }

  useEffect(() => {
    fetchEvent()
  })

  //seat number
  const seat_num = event.tickets
  //submission function
  
  
  const handleSubmit = async (e) => {
        
    e.preventDefault()

    //add customer to event list
    const customer_email = {customers: u_email}
    const response = await fetch(`/api/events/addCustomer/${param.id}`, {
      method: 'PATCH',
      body: JSON.stringify(customer_email),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if(!response.ok){
      setError(json.error)
    }

    //add event to user going list
    const e_id = {attend: param.id}
    const response2 = await fetch(`/api/user/attend/${u_id}`, {
      method: 'PATCH',
      body: JSON.stringify(e_id),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json2 = await response2.json()
    if(!response2.ok){
      setError(json2.error)
    }

    //update ticket to event sold
    const ticket = {sold: {seat: seat_num, owner: u_email}}
    const response3 = await fetch(`/api/events/${param.id}`, {
      method: 'PATCH',
      body: JSON.stringify(ticket),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json3 = await response3.json()
    if(!response3.ok){
      setError(json3.error)
    }

    if(response3.ok){
      const rem_ticket = {tickets: event.tickets - 1}
      const response4 = await fetch(`/api/events/${param.id}`, {
        method: 'PATCH',
        body: JSON.stringify(rem_ticket),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json4 = await response4.json()
      if(!response4.ok){
        setError(json4.error)
      }

      if(response4.ok) {
        const paymentId = JSON.parse(user).user.paymentId
        const price = event.price
        const response5 = await fetch(`/api/user/make/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({price, paymentId})
          
        })
        const json5 = await response5.status
        
        if(json5 === 400){
          setError(json5.error)
          alert("payment failed!")
        } else {
          history.push("/")
          alert("Booking confirmed")
        }
      }

    }
    
    // Make the payment using the saved payment information
  }

  return (
      <div style={{ background:"#F5F6F6", height: '90vw'}}>
          <NavBar/>
          <form className="join" onSubmit={handleSubmit} style={{ fontFamily:"Poppins", fontWeight:"bold" }}>
            <p>Event: {event.title}</p>
            <p>Date: {event.start_date}</p>
            <p>Seat Number: {seat_num}</p>
            <Button style={{ backgroundColor:'#3481EF' }} onClick={handleSubmit} variant='outlined'>Confirm Booking</Button>
          </form>
      </div>
  )
}

export default Booking

