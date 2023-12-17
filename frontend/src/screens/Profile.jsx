import React, {useState} from "react";
import { useEffect } from "react"
import { useUser } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import EventCard from "../components/EventCard";

import NavBar from "../components/NavBar";
import Button from 'react-bootstrap/Button';

function Profile() {
    
    const { user } = useUser()
    const usr = JSON.parse(user)
    const [ payment, setPayment ] = useState(usr["user"].paymentId)

    const history = useHistory()

    //grab the user email
    const u_wemail = (user.split('email')[1].split(',')[0].split(":")[1])
    const u_email = u_wemail.slice(1, u_wemail.length - 1)
    
    //ignore next two lines
    //const u_whole = user.split('_id')[1].split(',')[0].split(":")[1]
    //const u_id = u_whole.slice(1, u_whole.length - 1)


    const [hosted, setHosted] = useState([])
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
      //get all events user is hosting from database
      const fetchHost = async () => {
        const response = await fetch(`/api/events/host/${u_email}`)
        const json = await response.json()
  
        if (response.ok) {
          setHosted(json)
        }
      }

      //get all events user is attending from database
      const fetchBook = async () => {
        const response = await fetch(`/api/events/booking/${u_email}`)
        const json = await response.json()
  
        if (response.ok) {
          setBookings(json)
        }
      }
  
      fetchHost()
      fetchBook()

    }, [])

    return (
      <>
      <div style= {{  background: "#F5F6F6" }}>
        <NavBar/>
        <div>
            <div className="Profile-content">
              <div style= {{ height: '15vw', width:'100%', padding:'2%', alignItems:'left' ,marginTop:'15%'}}>
                <p>Email:{JSON.stringify(usr["user"].email)}</p>
                {payment === undefined || payment === '' ? ( <Button style= {{ backgroundColor:'#3481EF' }} onClick={() => {history.push("/payment"); setPayment(usr["user"].paymentId)}}>Add payment details</Button>) : 
                (<p>Payment details updated</p>)}
              </div>
            </div>
            <h3 className="host-header">Hosted events:</h3>
            <div className="hosted_events" style= {{ display: "flex", flexWrap:"wrap",  justifyContent:"center", padding: "2%" }}>
              {hosted && hosted.map((event) => (
                //<p>{event}</p>
                <EventCard key={event._id} event={event} eventSrc="" broadcast={true} cancel={true} />
              ))}
            </div>
            <h3 className="book-header">Booked events:</h3>
            <div className="hosted_events"  style= {{ display: "flex", flexWrap:"wrap",  justifyContent:"center", padding: "2%" }}>
              {bookings && bookings.map((event) => (
                //<p>{event}</p>
                <EventCard key={event._id} event={event} eventSrc=""/>
              ))}
            </div>
        </div>
      </div>
      </>
    );
}

export default Profile;