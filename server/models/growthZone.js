const mongoose = require('mongoose')

const growthZoneSchema = new mongoose.Schema({
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
  },
  ordinality: {
    type: Number,
    min: 0
  }
})

const GrowthZone = mongoose.model('GrowthZone', growthZoneSchema)

module.exports = GrowthZone