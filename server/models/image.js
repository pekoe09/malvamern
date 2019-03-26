const mongoose = require('mongoose')

const imageRefSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  awsKey: {
    type: String,
    required: true
  }
})

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
  isThumbnail: {
    type: Boolean
  },
  largeVersion: {
    type: imageRefSchema
  },
  smallVersion: {
    type: imageRefSchema
  }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image