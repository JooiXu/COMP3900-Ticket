const mongoose = require('mongoose')

const Schema = mongoose.Schema
const event_types = 
  [ 'Networking','Music','Exhibition','Outdoor',
    'Convention','Concert','Performance','Conference',
    'Dinner','Festival','Rally','Seminar','Social']
//this currently a test schema for the project
//needs to be expanded according to spec and other models for users,bookings etc will need to be added
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: event_types
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  tickets: {
    type: Number,
    required: true 
  },
  total_tickets: {
    type: Number,
    required: true 
  },
  seats: {
    type: [Number],
    required: false 
  },
  description: {
    type: String,
    required: true
  },
  customers: {
    type: [String],
    required: false
  },
  sold: {
    type: [{seat: Number, owner: String}],
    required: false
  }, 
  reviews: {
    type: [{name: String, comment: String, reply: String}],
    required: false
  }, 
  image: {
    type: String,
    required: false
  }
}, { timestamps: true})

module.exports = mongoose.model('Event', eventSchema)