//gets the database collection for events
const Event = require('../models/eventModel')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

//important note, _id is the identifier for an entry on the database itself
//and id is the parameter we get from the incoming request
//which we use to search the database

//get all event
const getEvents = async(req,res) => {
  const events = await Event.find({}).sort({createdAt: -1})
  res.status(200).json(events)
}


// Get single event
const getEvent = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }
  const event = await Event.findById(id)
  if(!event) {
    return res.status(404).json({error: 'no such event'})
  }

  res.status(200).json(event)
}

// Get event by Host id
const getEventByHost = async (req,res) => {
  const { id } = req.params

  
  const event = await Event.find({host: id})
  if(!event) {
    return res.status(404).json({error: 'no such event'})
  }

  res.status(200).json(event)
}

// Get event by its ObjectId in the database
const getEventByBooking = async (req,res) => {
  const { id } = req.params

  const event = await Event.find({customers: id})
  if(!event) {
    return res.status(404).json({error: 'no such event'})
  }

  res.status(200).json(event)
}

// Updates the ticket numbers for an event. 
const removeTicket = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }
  const host = await Event.findOneAndUpdate({_id: id}, {
    $pull: {
    ...req.body
  }})
  if(!host) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(host)
}


//post single event
const createEvent = async (req,res) => {
  const {title, type, host, start_date, end_date, venue, tickets, total_tickets, price, description, image} = req.body
  
  try {    
    const event = await Event.create({title,type,host,start_date,end_date,venue,tickets,total_tickets,price,description, image})
    res.status(200).json(event)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Deletes event from the database. Upon cancellation by 
// the host the event is deleted and refund is processed.
// All customers in the customer list are notified of the
// cancellation via an email broadcast.

const deleteEvent = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }

  // const paymentIntents = await stripe.paymentIntents.list()

  // if (!paymentIntents) {
  //   return res.status(400).json({error:'cannot find payments'})
  // } else {
  //   console.log(paymentIntents)
  // }
  
  // const refund = await stripe.refunds.create({
  //   payment_intent: paymentIntents.data[3].id,
  // })

  // if (!refund) {
  //   return res.status(400).json({error:'cannot refund'})
  // } else {
  //   console.log(refund)
  // }

  const event = await Event.findOneAndDelete({_id: id})
  if(!event) {
    return res.status(404).json({error: 'no such event'})
  }

  const customers = event.customers
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b071fc943d4801",
      pass: "b70e511dfa83ef"
    }
  });

  customers.forEach((item) => {
      message = {
      from: event.host,
      to: item,
      subject: "Event cancelled",
      text: "The following event has been cancelled.\nHere are your event details:\n\n\n" + 
      event.title + "\nPresented By " + event.host  +
      "Venue: " + event.venue + " \nStart date: " + event.start_date  + " \nEnd Date: " + event.end_date + " \nEvent description "
      + event.description
    }

    transporter.sendMail(message, function(err, res) {
        if (err) {
          return res.status(404).json({error: 'Could not send email'})
        } else {
          res.status(200).json("Success")
        }
    })

    res.status(200).json("Success")
  })

  res.status(200).json(event)
}

// Takes in Event_id in the paramter and updates the database entry
// based on the new request body.
const updateEvent = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }
  const event = await Event.findOneAndUpdate({_id: id}, {
    ...req.body
  })
  if(!event) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(event)
}

// Takes in Event_id in the paramter and adds a
// reply to the user's review.
const createReply = async(req, res) => {

  console.log("Replies", req.body.reviewId)

  const review = await Event.findById(
    {_id:  req.params}
  )

  if(!review) {
    return res.status(404).json({error: 'no such reply'})
  }

  res.status(200).json(review)
}

// Takes in Event_id in the parameter and adds a
// review for the event , storing the writer's 
// email and the message of the body.
const createReview = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }

  const event = await Event.findOneAndUpdate(
    {_id: id},
    { $push: { reviews: {name: req.body.u_email, comment: req.body.review, reply: ''} } }
  )

  if(!event) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(event)
}


// Finds the event based on the event_id and updates 
// the customer list attending the event.
const updateCustomer = async (req,res) => {

  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such event'})
  }
  const customer = await Event.findOneAndUpdate({_id: id}, {
    $addToSet: {
    ...req.body
  }})

  if(!customer) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(customer)
}

// Broadcast feature. Sets up a SMTP server using nodemailer and
// sends an email to all the customers featuring in the customer list.
const notifyCustomer = async(req, res) => {

  const event = req.body.event

  // Setting up SMTP server
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b071fc943d4801",
      pass: "b70e511dfa83ef"
    }
  });

  const customers = req.body.event.customers

  customers.forEach((item) => {
      message = {
      from: req.body.event.host,
      to: item,
      subject: "Event tickets",
      text: "Thanks for choosing Lasagna Bookings.\nHere are your event details:\n\n\n" + 
      event.title + "\nPresented By " + event.host  +
      "\n\nJoin us at " + event.venue + " between " + event.start_date  + " and " + event.end_date + " for "
      + event.description
    }

    transporter.sendMail(message, function(err) {
        if (err) {
          res.status(404).json({error: 'Could not send email'})
        } else {
          res.status(200).json("Success")
        }
      
    })

    res.status(200).json("Success")
  })
}

module.exports = {
  getEvents,
  createEvent,
  getEvent,
  getEventByHost,
  deleteEvent,
  updateEvent,
  createReview,
  createReply,
  updateCustomer,
  getEventByBooking,
  notifyCustomer,
  removeTicket
}