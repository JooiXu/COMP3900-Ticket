//gets the database collection for users
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const stripe = require('stripe')('sk_test_51M0i1sHJFX5EY1UjRQshbCEaQMQaj3Er8NQQE7UGC4RqJyY6XXOPePvQqCozZv43YnZ6FyxrEGU9MKTF0rfQcOfU00f2jbHeO0');

// POST login details of the intended user
const logIn = async (req, res) => {
    const { email, password } = req.body

    // verify the email address and password
    try {    
        const user = await User.logIn(email, password)
        const _id = user._id
        const token = jwt.sign({_id}, "COMP3900_Lasagna")

        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

// post user signup details
const signUp = async (req, res) => {
    const {email, password} = req.body
        
    try {    
        const user = await User.signup(email, password)
        const _id = user._id
        const token = jwt.sign({_id}, "COMP3900_Lasagna")
        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

// charge the user- by creating a PaymnetIntent based on the 
// paymentMethod and then confirming the amount of the paymnetIntent
// on actual ticket prices. 
const makePayment = async(req, res) => {
  const customer_id = await stripe.paymentMethods.retrieve(
    req.body.paymentId
  )

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.price + 50,
        currency: 'usd',
        customer: customer_id.customer,
        payment_method: req.body.paymentId,
      })
      
      const confirmPaymentIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {payment_method: 'pm_card_visa',
        setup_future_usage: 'off_session'}
      );

      if (confirmPaymentIntent) {
        return res.status(200).json({confirmPaymentIntent})
      }

    } catch (err) {
      console.log('Error code is: ', JSON.stringify(err.code))
      return res.status(400).json({err})
    }
}

// Payment details store
const updatePayment = async (req, res) => {
    
    const customer = await stripe.customers.create()

    const paymentMethod = await stripe.paymentMethods.attach(
      req.body.payment,
      {customer: customer.id}
    )

    if (!paymentMethod) {
      return res.status(400).json({error: 'something went wrong'})
    }

    const {payment, user} = req.body
        console.log(payment)
        const usr = await User.findOneAndUpdate({email: JSON.parse(req.body.user)}, 
        { paymentId: payment }
        ) 

        if(!usr) {
            return res.status(404).json({error: 'no such User'})
          }
        

        console.log(usr)
        
        res.status(200).json({"user": usr})
}

//get the user
const getUser = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such user'})
  }
  const user = await User.findById(id)
  if(!user) {
    return res.status(404).json({error: 'no such user'})
  }

  res.status(200).json(user)
}

//add to events hosting
const updateHost = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such user'})
  }
  const host = await User.findOneAndUpdate({_id: id}, {
    $addToSet: {
    ...req.body
  }})
  if(!host) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(host)
}

//add to events attending
const updateAttend = async (req,res) => {
  const { id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such user'})
  }
  const host = await User.findOneAndUpdate({_id: id}, {
    $addToSet: {
    ...req.body
  }})
  if(!host) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(host)
}

//add to tickets
const updateTickets = async (req,res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'no such user'})
  }
  const host = await User.findOneAndUpdate({_id: id}, {
    $addToSet: {
    ...req.body
  }})
  if(!host) {
    return res.status(404).json({error: 'no such Event'})
  }

  res.status(200).json(host)
}

//add to events attending

module.exports = {signUp, logIn, updatePayment, updateHost, updateAttend, updateTickets, getUser, makePayment}