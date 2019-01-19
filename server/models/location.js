const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  soiltypes: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    country: {
      name: {
        type: String,
        required: true
      },
      abbreviation: {
        type: String,
        required: true
      }
    }
  }],
  isActive: {
    type: Boolean,
    required: true
  }
})

module.exports = locationSchema