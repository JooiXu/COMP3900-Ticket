const express = require('express')

const { signUp, logIn, updatePayment, updateHost, updateAttend, updateTickets, getUser, makePayment } = require('../Controllers/userController')

const router = express.Router()

//calls appropriate functions based on the request it gets
//functions themselves are in the eventController file
router.post('/signup', signUp)
router.post('/login', logIn)
router.put('/payment', updatePayment)
router.patch('/host/:id', updateHost)
router.patch('/attend/:id', updateAttend)
router.patch('/tickets/:id', updateTickets)
router.get('/:id', getUser)
router.post('/make/payment', makePayment)

module.exports = router