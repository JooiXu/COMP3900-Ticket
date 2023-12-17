//Backend Express server
//written by Priyanta
// the server waits for requests
// and then directs them

//set up code
//fetching environment variables from .env file
require('dotenv').config()
//requiring dependencies and libraries
const express = require('express')
//this file contains call functions required depending on the request directed to 'api/event/'
const eventRoutes = require('./routes/events')
const userRoutes = require('./routes/user')
const mongoose = require('mongoose')
//express app
const app = express()

//middleware
app.use(express.json())

app.use((req,res,next) => {
  console.log(req.path,req.method)
  next()
})

//routes set up for all requests directed at 'api/events/' and further
app.use('/api/events',eventRoutes)
app.use('/api/user', userRoutes)

//connect to db

//connects to the database
//if successful, it will start listening for requests on port 4000
mongoose.connect(process.env.MONG_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to db & listening on port 4000')
    })
  })
  .catch((error) => {
    console.log(error)
  }) 



