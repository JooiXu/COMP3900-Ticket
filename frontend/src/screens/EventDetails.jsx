import React from "react";
import { useParams } from "react-router";
import {useEffect } from 'react'
import test_image from '../test_image.png'
import { useState } from "react"

import { useUser } from "../context/UserContext";
import { useHistory } from 'react-router-dom';
import NavBar from "../components/NavBar";
import { TextField, Button, Typography} from '@material-ui/core';


import Moment from 'moment'

function EventDetails() {
    const { user } = useUser()
    const history = useHistory()

    const param = useParams()
    const usr = JSON.parse(user)
    const u_email = JSON.stringify(usr["user"].email)
    const attend_events = JSON.stringify(usr["user"].attend)
    const payment = usr["user"].paymentId
    const [event, setEvent] = useState('')
    const customer_list = event.customers

    console.log()

    const [review, setReview] = React.useState('');
    const [reviewSubmitted, setReviewSubmitted] = React.useState(false)
    const [reply, setReply] = React.useState('')

    const [eventReviews, setEventReviews] = React.useState([])

    const submitReview = async () => {
      
      const response = await fetch(`/api/events/${param.id}/reviews`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ u_email, review})
      })

      const resp = await response.json()

      if (response.status === 200) {
        setEvent(resp)
        setReviewSubmitted(true)
      } else {
        alert(response.error)
      }
    }

    const submitReply = async (reviewId) => {
      console.log(reviewId)
      const response = await fetch(`/api/events/${param.id}/review/reply`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ reviewId, reply })
      })

      const resp = await response.json()

      if (response.status === 200) {
        setEvent(resp)
      } else {
        alert(response.error)
      }
    }

    const fetchEvent= async () => {
      const response = await fetch(`/api/events/${param.id}`)
      const json = await response.json()

      if(response.ok) {
        setEvent(json)
        setEventReviews(json.reviews)
      }
    }

    useEffect(() => {
      fetchEvent()
    })

    const joinEvent = () => {

        history.push(`/booking/${param.id}`)
    }

    const signUp = () => {

      history.push("/register")
  }
    
    return (
        <>
        <div style={{ background:"#F5F6F6"}}>
          <NavBar/>
            <div style={{ display:"flex", padding: '5%', marginTop: '5%', width: '90%', height:'50%', marginLeft:'5%', background: '#F7DF1E', borderRadius:'10px'}}>   
                <div style={{  alignSelf:'center', flex:'3'}}> 
                  {event.image ? (<img src={event.image} style={{ width:'100%', borderRadius:'10px'}} alt="Test"/>) : (<img src={test_image} style={{ width:'100%', borderRadius:'10px'}} alt="Test"/>) }
                </div>
                <div style={{ alignSelf:'center', paddingLeft:'17%', fontFamily:'Poppins', flex:'3',  color: 'black', fontSize:'120%', fontWeight:'bolder', textAlign:'left'}}>
                  <p style={{ fontSize:'200%' }}>{event.title}</p>
                  <p>By: {event.host} </p>
                  <p>Tickets available: {event.tickets}</p>
                  <p>Price: ${event.price}</p>
                  <p>Start Date: {Moment(event.start_date).format("MMM Do YY")}</p>
                  <p>End Date: {Moment(event.end_date).format("MMM Do YY")}</p>
                  <p>Venue: {event.venue}</p>
                  <p style= {{ fontStyle:'italic', fontColor:'#444279', alignSelf:'center'}}>{event.description}</p>
                </div>
                <div style={{ alignSelf:'center', paddingRight:'10%'}}>
                    { event && payment && u_email !== JSON.stringify(event.host) && !customer_list.includes(usr["user"].email) && !attend_events.includes(event._id) && (<Button style={{ fontFamily:'Poppins', fontWeight:'bold', color:'white', background:"#3481EF" }} onClick={joinEvent}> Book now </Button>)}
                  </div>
            </div>    
            <div style={{ display:"flex", flexDirection: 'column', margin: '5%', fontFamily:'Poppins', width: '90%', height:'50%', marginLeft:'5%', borderRadius:'10px'}}>
                <div>
                  { !reviewSubmitted  && (u_email !== JSON.stringify(event.host)) && (<div>
                    <TextField style= {{ marginRight:'10%', width:'70%' }} variant="outlined" target= {review} placeholder='Enter your review here' onChange={(e) => { setReview(e.target.value) }}></TextField>
                    <Button style= {{ fontFamily:'Poppins', fontWeight:'bold', color:'white', background:"#3481EF" }} onClick={submitReview} variant='outlined'>Submit Review</Button>
                  </div>) }
                </div>
                <div>
                <h4 style={{marginLeft:'-51%', marginTop:'2%', fontFamily:'Poppins', textAlign: "center"}}>See what others have to say about this event</h4>
                  {eventReviews.map((l, idx) => {
                    return (
                      <div style={{ display: 'flex', marginBottom:'2%', padding:'1%', width:'100%', border: 'solid 1px',  borderRadius: "8px" }}  key={idx}>
                        <br/>
                        <div style={{ flex:'1', display:"flex",  textAlign:'left', alignItems:'center'}}>
                          <Typography style={{ fontWeight: 'bolder', marginRight:'50px', fontSize:'90%', fontFamily:'Poppins' }}>{l.name}:</Typography>
                          <Typography style={{ fontWeight:'bolder', fontSize:'90%', fontFamily:'Poppins'}}>{l.comment}</Typography>
                        </div>
                        { u_email === JSON.stringify(event.host) && (
                        <div style={{ flex:'1' }}>
                        <TextField style= {{ marginLeft:'-10%', marginRight:'10%', height: '20%', width:'50%' }} placeholder="Reply to this review" variant="outlined" target= {reply}  onChange={(e) => { setReply(e.target.value) }}></TextField>
                        <Button style= {{ fontFamily:'Poppins', fontWeight:'bold', color:'white', background:"#3481EF" }} onClick={() => submitReply(l._id)}>Reply</Button>
                        </div>)}
                        <br/>
                      </div>
                    )
                  })}
                </div>
            </div>

        </div>
        </>
    );
}

export default EventDetails;