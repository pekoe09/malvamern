const mongoose = require('mongoose')

const soilTypeSchema = new mongoose.Schema({
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
})

const SoilType = mongoose.model('SoilType', soilTypeSchema)

module.exports = SoilType