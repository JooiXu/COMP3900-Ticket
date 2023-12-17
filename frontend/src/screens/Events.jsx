import './Events.css'
import { useState } from "react"
import NavBar from '../components/NavBar'
import { useUser } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import { Button, TextField, Select, MenuItem } from "@material-ui/core";

const EventForm = () => {
  // const {dispatch} = useEventContext()
  const { user } = useUser()
  const history = useHistory()
  //hacky method for getting the info
  //needs to be changed
  const u_wemail = user.split('email')[1].split(',')[0].split(":")[1]
  const u_email = u_wemail.slice(1, u_wemail.length - 1)
  const u_whole = user.split('_id')[1].split(',')[0].split(":")[1]
  const u_id = u_whole.slice(1, u_whole.length - 1)
  
  //all the fields needed to create a new event
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Networking')
  const [tickets, setTickets] = useState('')
  const [price, setPrice] = useState('')
  const [venue, setVenue] = useState('')
  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [host, setHost] = useState(u_email)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  const [error, setError] = useState(null)
  
  //This function handles when create event form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault()
    const fileRead = new FileReader()

    const total_tickets = tickets

    const event = {title, host, type, start_date, end_date, venue, tickets, total_tickets, price, description, image}

    if (image && image.type.match('image.*')) {
      console.log('here')
      fileRead.readAsDataURL(image)
      fileRead.onloadend = async () => {
      const response = await fetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify({title, host, type, start_date, end_date, venue, tickets, total_tickets, price, description, image:fileRead.result}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      const json = await response.json()
      //const new_event = JSON.parse(json)
  
      if (!response.ok) {
        setError(json.error)
  
      }
      if(response.ok) {
        setTitle('')
        setType('Networking')
        setTickets('')
        setPrice('')
        setStartDate("")
        setEndDate("")
        setVenue('')
        setDescription('')
        setHost(u_email)
        setError(null)
  
        const e_id = {host: json._id}
        const response2 = await fetch(`/api/user/host/${u_id}`, {
          method: 'PATCH',
          body: JSON.stringify(e_id),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const json2 = await response2.json()
        if(!response2.ok){
          setError(json2.error)
          history.push('/')
        }
        console.log('new event added:',json)
        history.push('/')
        //dispatch({type: 'CREATE_EVENT', payload: json})
      }
      }
    } else {
      const response = await fetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify({title, host, type, start_date, end_date, venue, tickets, total_tickets, price, description, image:''}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      const json = await response.json()
      //const new_event = JSON.parse(json)
  
      if (!response.ok) {
        setError(json.error)
  
      }
      if(response.ok) {
        setTitle('')
        setType('Networking')
        setTickets('')
        setPrice('')
        setStartDate("")
        setEndDate("")
        setVenue('')
        setDescription('')
        setHost(u_email)
        setError(null)
  
        const e_id = {host: json._id}
        const response2 = await fetch(`/api/user/host/${u_id}`, {
          method: 'PATCH',
          body: JSON.stringify(e_id),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const json2 = await response2.json()
        if(!response2.ok){
          setError(json2.error)
          history.push('/')
        }
        history.push('/')
        console.log('new event added:',json)
        //dispatch({type: 'CREATE_EVENT', payload: json})
      }
    }

    console.log(event)
    
    
  }
  return (
    <>
    <div style={{ background:"#F5F6F6", height: '90vw'}}>
      < NavBar/>
      <div style={{ margin: 'auto', width: '70%', height: '115%', position: 'absolute', top: '70%', left:'15%',  
        transform: 'translate(0, -50%)', border: '1px solid #000000', borderRadius:'10px', padding: '1%', display:'flex',
        flexDirection:'column', fontFamily:'Poppins'}}>
        <h3>Host a New Event</h3>
        <TextField
          style={{ margin:'1%' }}
          variant = 'outlined'
          placeholder='Event Title'
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <TextField
          style={{ margin:'1%' }}
          variant = 'outlined'
          placeholder='Total tickets'
          type="integer"
          min="1"
          onChange={(e) => setTickets(e.target.value)}
          value={tickets}
        />

        <label> Event Type:</label>
        <Select
          style={{ margin:'1%' }}
          placeholder ="Choose event type"
          variant = "outlined"
          value = {type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Networking">Networking</MenuItem>
          <MenuItem value="Social">Social</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Exhibition">Exhibition</MenuItem>
          <MenuItem value="Outdoor">Outdoor</MenuItem>
          <MenuItem value="Convention">Convention</MenuItem>
          <MenuItem value="Concert">Concert</MenuItem>
          <MenuItem value="Performance">Performance</MenuItem>
          <MenuItem value="Conference">Conference</MenuItem>
          <MenuItem value="Dinner">Dinner</MenuItem>
          <MenuItem value="Festival">Festival</MenuItem>
          <MenuItem value="Rally">Rally</MenuItem>
          <MenuItem value="Seminar">Seminar</MenuItem>
        </Select>

        <TextField
          style={{ margin:'1%' }}
          placeholder="Enter Price"
          variant = 'outlined'
          type="number"
          min="0"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />

        <label> Start Date:</label>
        <TextField
          style={{ margin:'1%' }}
          placeholder="Enter start date"
          variant = 'outlined'
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={start_date}
        />

        <label> End Date:</label>
        <TextField
          style={{ margin:'1%' }}
          placeholder="Enter end date"
          variant = 'outlined'
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          value={end_date}
        />

        <TextField
          style={{ margin:'1%' }}
          variant = 'outlined'
          placeholder='Venue'
          type="text"
          onChange={(e) => setVenue(e.target.value)}
          value={venue}
        />

        <TextField
          style={{ margin:'1%' }}
          variant = 'outlined'
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder='Description'
        />

        <TextField 
          style={{ margin:'1%' }} 
          variant="outlined"
          type="file"
          placeholder= "Enter event image"
          onChange={(e) => setImage(e.target.files[0])}>
        </TextField><br></br>


        <Button style={{ marginTop:'7%', fontFamily:'Poppins', fontWeight:'bold', color:'white', background:"#3481EF" }} variant='outlined' onClick={handleSubmit}>Create Event</Button>
        {error && <div className="error">"error {error} {u_email}"</div>}
        </div>
    </div>
    </>
  )
}

export default EventForm