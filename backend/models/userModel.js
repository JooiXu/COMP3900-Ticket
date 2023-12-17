const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

//user database schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true 
  },
  paymentId: {
    type: String,
    required: false
  },
  host: {
    type: [ObjectId],
    required: false 
  },
  attend: {
    type: [ObjectId],
    required: false
  },
  tickets: {
    type: [ObjectId],
    required: false
  }
}, { timestamps: true})

userSchema.statics.signup = async function(email, password) {
    const valid = validator.isEmail(email)

    if (!valid || !email) {
        throw Error('Invalid email')
    }

    if (!password) {
      throw Error('Password field must not be empty')
    }

    // send a request to database to check if the email exists
    const emailInUse = await this.findOne({ email })

    // if email exists we send an error otherwise create a new entry
    if (emailInUse) {
        throw Error('Email already in use!')
    } 

    try {
      const newUser = await this.create({ email, password, paymentId:''}) 
      return newUser
    } 
    catch(error) {
      console.log(error)
    }
    
    return null
    
}

userSchema.statics.logIn = async function(email, password) {

  if (!email) {
      throw Error('Email field must not be empty')
  }

  if (!password) {
    throw Error('Password field must not be empty')
  }
  
  // send a request to database to return the user record
  const userRec = await this.findOne({ email })

  // if email does not exist we send an error
  if (!userRec) {
      throw Error('No user found!')
  } 

  // verify the password
  if (password != userRec.password) {
    throw Error('Incorrect Password!')
  }

  return userRec
  
}

module.exports = mongoose.model('User', userSchema)
