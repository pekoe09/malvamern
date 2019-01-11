const mongoose = require('mongoose')

const monthSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  }
})

module.exports = monthSchema