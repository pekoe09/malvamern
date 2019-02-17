const mongoose = require('mongoose')
const locationSchema = require('./location')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  lastName: {
    type: String,
    required: true,
    select: true
  },
  firstNames: {
    type: String,
    required: true,
    select: true
  },
  email: {
    type: String,
    required: true,
    select: true
  },
  locations: [
    locationSchema
  ]
})

userSchema.virtual('fullName').get(() => {
  return (`${this.firstNames} ${this.lastName}`)
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

const User = mongoose.model('User', userSchema)

module.exports = User