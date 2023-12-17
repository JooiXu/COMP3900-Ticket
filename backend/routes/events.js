const express = require('express')
const {
  createEvent,
  getEvent,
  getEvents,
  getEventByHost,
  deleteEvent,
  updateEvent,
  createReview,
  createReply,
  updateCustomer,
  getEventByBooking,
  notifyCustomer,
  removeTicket
} = require('../Controllers/eventController')

const router = express.Router()

//calls appropriate functions based on the request it gets
//functions themselves are in the eventController file 
router.get('/', getEvents)

router.get('/:id',getEvent)

router.get('/host/:id',getEventByHost)

router.get('/booking/:id',getEventByBooking)

router.post('/',createEvent)

router.delete('/:id', deleteEvent)

router.patch('/:id', updateEvent)

router.patch('/removeTicket/:id', removeTicket)

router.put('/:id/reviews', createReview)

router.put('/:id/review/reply', createReply)

router.patch('/addCustomer/:id', updateCustomer)

router.post('/notify/', notifyCustomer)

module.exports = router