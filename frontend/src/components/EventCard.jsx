import React, {useContext, useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CardMedia } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.css';
import { useHistory } from 'react-router-dom';
import './EventCard.css'
import Moment from 'moment'


//Card component which will display event info
import { useUser } from '../context/UserContext';

import test_image from '../test_image.png'

function EventCard ({event, eventSrc, broadcast, cancel}) {

    const history = useHistory();
    
    const eventDetails = () => {
        history.push(`/event/${event._id}`);
    };

    const broadcastEmail = async () => {

        if (event.customers.length === 0) {
            alert('No customers to send event info!')
            return
        }

        const response = await fetch('/api/events/notify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ event })
        })

        const resp = await response.json()
        
        if(response.status === 200) {
            alert('Event details and tickets sent to the customers')
        }
    };

    const cancelEvent = async () => {
        const start = Moment(event.start_date)

      const daysLeft = start.fromNow().split(" ")[1]

      if (daysLeft <= 7 || daysLeft === "in") {
          alert("Cannot cancel booking, Event too close to start date ")
          return
      }

      if (daysLeft <= 7 || daysLeft === "in") {
          alert("Cannot cancel booking, Event too close to start date ")
          return
      }
      const response2 = await fetch(`/api/events/${event._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json2 = await response2.json()
      if(!response2.ok){
        //setError(json2.error)
        //history.push('/')
      }
      
      if(response2.ok){
        alert("Your event is cancelled!")
        history.push("/")
      }
    }

    const { user } = useUser();
    console.log(event)
    return(
        <>
            <Card style={{ 
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)", cursor: "pointer",
                height: "30vw",
                margin: "20px",
                padding: "0 20px",
                position: "relative",
                textAlign: "center",
                flex: "0 1 30%" 
            }} 
            className="cards"
            // onClick={eventDetails}
            >
                {event.image ? (<CardMedia style={{ width: '90%',height: '80vw', marginTop: '2%', marginBottom: '3%', alignSelf:"center", borderRadius: '10px',}} image={event.image}/>) : (<CardMedia style={{ width: '90%',height: '80vw', marginTop: '2%', marginBottom: '3%', alignSelf:"center", borderRadius: '10px',}} image={test_image}/>)}
                <Card.Title style={{
                    fontFamily: 'Poppins',
                    fontSize: "30px"
                }}>
                    {event.title}</Card.Title>
                    <div>
                        <Card.Body style={{ display:"flex", flexDirection:"column", justifyContent:'space-around' }}>
                        {user ? ( <Button style={{ backgroundColor:'#3481EF' }} onClick={eventDetails}>More info</Button>) : (<><div>Price: ${event.price}</div>
                        <div>Start Date: {Moment(event.start_date).format("MMM Do YY")}</div><br/>
                        <div>End Date: {Moment(event.end_date).format("MMM Do YY")}</div><br/>
                        <div>Venue: {event.venue}</div><br/></>)}
                        {broadcast && (<Button style={{ backgroundColor:'#3481EF' }} onClick={broadcastEmail}>Send event info </Button>)}
                        {cancel && (<Button style={{ backgroundColor:'#FF4E00' }} onClick={cancelEvent}>Cancel booking</Button>)}
                        </Card.Body>
                    </div>
            </Card>
        </>
    );
}

export default EventCard;