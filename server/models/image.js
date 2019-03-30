const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ordinality: {
    type: Number
  },
  caption: {
    type: String
  },
  awsKey: {
    type: String,
    required: true
  },
  awsKeySmall: {
    type: String
  },
  awsKeyLarge: {
    type: String
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId
  }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image